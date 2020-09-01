<template>
  <div class="designer">
    <div
      class="designerContent"
      @drop="onDrop"
      @dragover="onDragOver"
      ref="designerContent"
      @click.self="() => setActiveWidget(null)"
    >
      <!-- <canvas
        class="canvas"
        @click="onClickCanvas"
      /> -->
      <widget-movable
        v-for="(item,index) of widgetList"
        :key="index"
        :widget="item"
        @widget-delete="onWidgetDelete"
        @widget-resize="onWidgetResize"
        @widget-active="onWidgetActive"
        @widget-move="onWidgetMove"
        @widget-drag-start="onWidgetDragStart"
      >
        <component
          :is="item.name"
          :configuration="item"
          :edit-mode="editMode"
        />
      </widget-movable>
      <!-- <pre>{{ widgetList }}</pre> -->
    </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'

import getConfigurationItems from './WidgetConfigurationItems.js'
// import { v4 as uuidv4 } from 'uuid'
// import Mock from 'mockjs'
import WidgetMovable from './WidgetMovable'
import WidgetInput from './WidgetInput'
import WidgetTextarea from './WidgetTextarea'
import WidgetText from './WidgetText'
import WidgetLine from './WidgetLine'
import WidgetPhysicalSign from './WidgetPhysicalSign'
import WidgetNews from './WidgetNews'
// const Random = Mock.Random
const { mapState, mapActions } = createNamespacedHelpers(
  'Designer'
)
// import * as _ from 'lodash'
export default {
  name: 'ContentDesigner',
  components: {
    WidgetMovable,
    WidgetInput,
    WidgetTextarea,
    WidgetText,
    WidgetLine,
    WidgetPhysicalSign,
    WidgetNews
  },
  data () {
    return {
      referenceLine: {
        x: [],
        y: []
      },
      adsorptionDistance: 5,
      editMode: true,
      widget: {
        id: '',
        name: '',
        width: '',
        height: '',
        positionX: '',
        positionY: ''
      }
    }
  },
  computed: {
    ...mapState({
      widgetMap: state => state.widgetMap,
      widgetList: state => state.widgetList,
      activeWidgetId: state => state.activeWidgetId
    })
    // ...mapGetters(['activeWidgetId'])
  },
  created () {
    // var data = Mock.mock({
    // // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
    //   'list|100-200': [{
    //     // 属性 id 是一个自增数，起始值为 1，每次增 1
    //     id: function () {
    //       return uuidv4()
    //     },
    //     name: 'widget-input',
    //     'width|10-200': 10,
    //     'height|10-30': 10,
    //     'positionX|0-200': 0,
    //     'positionY|0-400': 0
    //   }]
    // })
    // // 输出结果
    // console.log(data.list.length)
    // data.list.forEach(item => {
    //   this.setWidgetMap(item)
    // })
  },
  methods: {
    ...mapActions(['setWidgetMap', 'deleteWidget', 'setActiveWidget']),
    onDragOver (e) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
    },
    onDrop (e) {
      try {
        const { offsetX, offsetY, id, name, width, height, type } = JSON.parse(
          e.dataTransfer.getData('text/plain')
        )
        if (type === 'copy') {
          let left = e.offsetX
          let top = e.offsetY

          // 如果重叠
          if (e.target !== this.$refs.designerContent) {
            const closestWidgetMovable = e.target.closest('.widgetMovable')
            if (closestWidgetMovable) {
              left += +closestWidgetMovable.style.left.replace(/px/g, '')
              top += +closestWidgetMovable.style.top.replace(/px/g, '')
            }
          }
          left = left - offsetX
          top = top - offsetY

          const { positionX, positionY } = this.correctPositon({
            positionX: left,
            positionY: top,
            width,
            height
          })
          this.setWidgetMap({
            id,
            name,
            positionX,
            positionY,
            width,
            height,
            ...getConfigurationItems(name)
          })
        }
      } catch (e) {}
    },
    onWidgetDragStart (id) {
      this.setReferenceLine(id)
    },
    onWidgetMove (visualWidget) {
      // 获取边界线
      const { width, height, positionX, positionY, id } = visualWidget
      const selfLines = {
        x: [
          {
            name: 'lineLeftX',
            value: positionX
          },
          {
            name: 'lineRightX',
            value: positionX + width
          },
          {
            name: 'lineCenterX',
            value: positionX + width / 2
          }
        ],
        y: [
          {
            name: 'lineTopY',
            value: positionY
          },
          {
            name: 'lineBottomY',
            value: positionY + height
          },
          {
            name: 'lineCenterY',
            value: positionY + height / 2
          }
        ]
      }
      const { closestX, closestY } = this.getClosestLine(selfLines)

      const actual = { width, height, positionX, positionY, id }
      if (
        closestX.closestLine &&
        closestX.closestLine.abs < this.adsorptionDistance
      ) {
        switch (closestX.name) {
          case 'lineLeftX':
            actual.positionX = closestX.closestLine.value
            break
          case 'lineRightX':
            actual.positionX = closestX.closestLine.value - width
            break
          case 'lineCenterX':
            actual.positionX = closestX.closestLine.value - width / 2
            break
        }
      }
      if (
        closestY.closestLine &&
        closestY.closestLine.abs < this.adsorptionDistance
      ) {
        switch (closestY.name) {
          case 'lineTopY':
            actual.positionY = closestY.closestLine.value
            break
          case 'lineBottomY':
            actual.positionY = closestY.closestLine.value - height
            break
          case 'lineCenterY':
            actual.positionY = closestY.closestLine.value - height / 2
            break
        }
      }

      // 更新widgetMap
      this.setWidgetMap(actual)
    },
    onWidgetResize (payload) {
      // 获取边界线
      const { cursor, widget: visual } = payload
      const { width, height, positionX, positionY, id } = visual
      const actual = { width, height, positionX, positionY, id }

      if (positionX < 0 || positionY < 0) {
        return
      }
      if (
        positionX + width >
          this.$refs.designerContent.clientWidth ||
        positionY + height >
          this.$refs.designerContent.clientHeight
      ) {
        return
      }
      if (width <= 0 || height <= 0) {
        return
      }

      switch (cursor) {
        case 'nw-resize': {
          const selfLines = {
            x: [
              {
                name: 'lineX',
                value: positionX
              }
            ],
            y: [
              {
                name: 'lineY',
                value: positionY
              }
            ]
          }

          const { closestX, closestY } = this.getClosestLine(selfLines)
          if (
            closestX.closestLine &&
            closestX.closestLine.abs < this.adsorptionDistance
          ) {
            switch (closestX.name) {
              case 'lineX':
                actual.positionX = closestX.closestLine.value
                actual.width =
                  visual.width -
                  (closestX.closestLine.value - actual.positionX)
                break
            }
          }
          if (
            closestY.closestLine &&
            closestY.closestLine.abs < this.adsorptionDistance
          ) {
            switch (closestY.name) {
              case 'lineY':
                actual.positionY = closestY.closestLine.value
                actual.height =
                  visual.height -
                  (closestY.closestLine.value - visual.positionY)
                break
            }
          }
          break
        }
        case 'n-resize': {
          const selfLines = {
            x: [],
            y: [
              {
                name: 'lineY',
                value: visual.positionY
              }
            ]
          }
          const { closestY } = this.getClosestLine(selfLines)
          if (
            closestY.closestLine &&
            closestY.closestLine.abs < this.adsorptionDistance
          ) {
            switch (closestY.name) {
              case 'lineY':
                actual.positionY = closestY.closestLine.value
                actual.height =
                  visual.height -
                  (closestY.closestLine.value - visual.positionY)
                break
            }
          }
          break
        }

        case 'ne-resize': {
          const selfLines = {
            x: [
              {
                name: 'lineX',
                value: visual.positionX + visual.width
              }
            ],
            y: [
              {
                name: 'lineY',
                value: visual.positionY
              }
            ]
          }

          const { closestX, closestY } = this.getClosestLine(selfLines)
          if (
            closestX.closestLine &&
            closestX.closestLine.abs < this.adsorptionDistance
          ) {
            switch (closestX.name) {
              case 'lineX':
                actual.width = closestX.closestLine.value - visual.positionX
                break
            }
          }
          if (
            closestY.closestLine &&
            closestY.closestLine.abs < this.adsorptionDistance
          ) {
            switch (closestY.name) {
              case 'lineY':
                actual.positionY = closestY.closestLine.value
                actual.height =
                  visual.height -
                  (closestY.closestLine.value - visual.positionY)
                break
            }
          }
          break
        }
        case 'w-resize': {
          const selfLines = {
            x: [
              {
                name: 'lineX',
                value: visual.positionX
              }
            ],
            y: []
          }

          const { closestX } = this.getClosestLine(selfLines)
          if (
            closestX.closestLine &&
            closestX.closestLine.abs < this.adsorptionDistance
          ) {
            switch (closestX.name) {
              case 'lineX':
                actual.positionX = closestX.closestLine.value
                actual.width =
                  visual.width -
                  (closestX.closestLine.value - visual.positionX)
                break
            }
          }
          break
        }
        case 'e-resize': {
          const selfLines = {
            x: [
              {
                name: 'lineX',
                value: visual.positionX + visual.width
              }
            ],
            y: []
          }

          const { closestX } = this.getClosestLine(selfLines)
          if (
            closestX.closestLine &&
            closestX.closestLine.abs < this.adsorptionDistance
          ) {
            switch (closestX.name) {
              case 'lineX':
                actual.width = closestX.closestLine.value - visual.positionX
                break
            }
          }
          break
        }
        case 'sw-resize': {
          const selfLines = {
            x: [
              {
                name: 'lineX',
                value: visual.positionX
              }
            ],
            y: [
              {
                name: 'lineY',
                value: visual.positionY + visual.height
              }
            ]
          }

          const { closestX, closestY } = this.getClosestLine(selfLines)
          if (
            closestX.closestLine &&
            closestX.closestLine.abs < this.adsorptionDistance
          ) {
            switch (closestX.name) {
              case 'lineX':
                actual.positionX = closestX.closestLine.value
                actual.width =
                  visual.width -
                  (closestX.closestLine.value - actual.positionX)
                break
            }
          }
          if (
            closestY.closestLine &&
            closestY.closestLine.abs < this.adsorptionDistance
          ) {
            switch (closestY.name) {
              case 'lineY':
                actual.height = closestY.closestLine.value - visual.positionY
                break
            }
          }
          break
        }
        case 's-resize': {
          const selfLines = {
            x: [],
            y: [
              {
                name: 'lineY',
                value: visual.positionY + visual.height
              }
            ]
          }

          const { closestY } = this.getClosestLine(selfLines)
          if (
            closestY.closestLine &&
            closestY.closestLine.abs < this.adsorptionDistance
          ) {
            switch (closestY.name) {
              case 'lineY':
                actual.height = closestY.closestLine.value - visual.positionY
                break
            }
          }
          break
        }
        case 'se-resize': {
          const selfLines = {
            x: [
              {
                name: 'lineX',
                value: visual.positionX + visual.width
              }
            ],
            y: [
              {
                name: 'lineY',
                value: visual.positionY + visual.height
              }
            ]
          }

          const { closestX, closestY } = this.getClosestLine(selfLines)
          if (
            closestX.closestLine &&
            closestX.closestLine.abs < this.adsorptionDistance
          ) {
            switch (closestX.name) {
              case 'lineX':
                actual.width = closestX.closestLine.value - visual.positionX
                break
            }
          }
          if (
            closestY.closestLine &&
            closestY.closestLine.abs < this.adsorptionDistance
          ) {
            switch (closestY.name) {
              case 'lineY':
                actual.height = closestY.closestLine.value - visual.positionY
                break
            }
          }
          break
        }
        default:
      }

      // 更新widgetMap
      this.setWidgetMap(actual)
    },
    onWidgetActive (e) {
      this.setActiveWidget(e)
    },
    onWidgetDelete (e) {
      if (this.activeWidgetId === e) {
        this.deleteWidget(e)
        this.setActiveWidget(null)
      }
    },
    onClickCanvas () {
      this.setActiveWidget(null)
    },
    setReferenceLine (id) {
      this.referenceLine.x = [...this.widgetMap.values()]
        .filter(item => item.id !== id)
        .reduce(
          (arr, item) =>
            arr.concat([
              item.positionX,
              item.positionX + item.width,
              item.positionX + item.width / 2
            ]),
          []
        )
        .reduce((arr, item) => {
          if (!arr.includes(item)) {
            return arr.concat([item])
          } else {
            return arr
          }
        }, [])
        .sort((a, b) => a - b)
      this.referenceLine.y = [...this.widgetMap.values()]
        .filter(item => item.id !== id)
        .reduce(
          (arr, item) =>
            arr.concat([
              item.positionY,
              item.positionY + item.height,
              item.positionY + item.height / 2
            ]),
          []
        )
        .reduce((arr, item) => {
          if (!arr.includes(item)) {
            return arr.concat([item])
          } else {
            return arr
          }
        }, [])
        .sort((a, b) => a - b)
    },
    getClosestLine (selfLines) {
      // 获取最近的参考线
      const closestX = selfLines.x.reduce((value, line) => {
        const closestLine = this.referenceLine.x.reduce((val, x) => {
          if (val) {
            if (val.abs > Math.abs(x - line.value)) {
              return {
                value: x,
                abs: Math.abs(x - line.value)
              }
            } else {
              return val
            }
          } else {
            return {
              value: x,
              abs: Math.abs(x - line.value)
            }
          }
        }, null)
        if (value && value.closestLine) {
          if (value.closestLine.abs > closestLine.abs) {
            return {
              closestLine,
              name: line.name
            }
          } else {
            return value
          }
        } else {
          return {
            closestLine,
            name: line.name
          }
        }
      }, null)
      const closestY = selfLines.y.reduce((value, line) => {
        const closestLine = this.referenceLine.y.reduce((val, y) => {
          if (val) {
            if (val.abs > Math.abs(y - line.value)) {
              return {
                value: y,
                abs: Math.abs(y - line.value)
              }
            } else {
              return val
            }
          } else {
            return {
              value: y,
              abs: Math.abs(y - line.value)
            }
          }
        }, null)
        if (value && value.closestLine) {
          if (value.closestLine.abs > closestLine.abs) {
            return {
              closestLine,
              name: line.name
            }
          } else {
            return value
          }
        } else {
          return {
            closestLine,
            name: line.name
          }
        }
      }, null)
      return { closestX, closestY }
    },
    // 边界修正
    correctPositon ({ positionX, positionY, width, height }) {
      positionX = positionX < 0 ? 0 : positionX
      positionY = positionY < 0 ? 0 : positionY
      positionX =
        positionX + width > this.$refs.designerContent.clientWidth
          ? this.$refs.designerContent.clientWidth - width
          : positionX
      positionY =
        positionY + height > this.$refs.designerContent.clientHeight
          ? this.$refs.designerContent.clientHeight - height
          : positionY
      return {
        positionX,
        positionY
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.designer {
  height: 100%;
  flex: 1 1 600px;
  background: cornsilk;
  overflow: auto;
}
.designerContent {
  width: 210mm;
  height: 297mm;
  background: white;
  margin: 0 auto;
  border: 1px dashed palevioletred;
  position: relative;
  overflow: hidden;

  .canvas {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
</style>
