<template>
  <div
    class="widgetMovable"
    :style="style"
    draggable="true"
    @dragstart="onDragStart"
    @drag="onDrag"
    @dragend="onDragEnd"
    @dragover="onDragOver"
    @drop="onDrop"
    @dblclick="onDblckick"
  >
    <div
      class="mask"
      :style="{'borderColor': active ? 'rebeccapurple' : 'transparent'}"
    />
    <div
      class="circle"
      v-for="(circle, index) of circles"
      :key="index"
      :style="circle.style"
      draggable="true"
      @dragstart.stop="onDragStartResize"
      @drag.stop="onDragResize"
      @dragend.stop="onDragEndResize"
      v-show="active"
    />
    <slot />
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers(
  'Designer'
)
export default {
  name: 'WidgetMovable',
  props: {
    widget: {
      type: Object,
      required: true
    }
  },
  data () {
    const circleWidth = 8
    const circleOffset = -(circleWidth / 2 - 1) + 'px'
    return {
      circles: [
        {
          style: {
            left: circleOffset,
            top: circleOffset,
            cursor: 'nw-resize'
          }
        },
        {
          style: {
            left: 'calc(50% - ' + circleWidth / 2 + 'px)',
            top: circleOffset,
            cursor: 'n-resize'
          }
        },
        {
          style: {
            right: circleOffset,
            top: circleOffset,
            cursor: 'ne-resize'
          }
        },
        {
          style: {
            left: circleOffset,
            top: 'calc(50% - ' + circleWidth / 2 + 'px)',
            cursor: 'w-resize'
          }
        },
        {
          style: {
            right: circleOffset,
            top: 'calc(50% - ' + circleWidth / 2 + 'px)',
            cursor: 'e-resize'
          }
        },
        {
          style: {
            left: circleOffset,
            bottom: circleOffset,
            cursor: 'sw-resize'
          }
        },
        {
          style: {
            left: 'calc(50% - ' + circleWidth / 2 + 'px)',
            bottom: circleOffset,
            cursor: 's-resize'
          }
        },
        {
          style: {
            right: circleOffset,
            bottom: circleOffset,
            cursor: 'se-resize'
          }
        }
      ],
      resize: {
        start: {
          pageX: '',
          pageY: ''
        }
      },
      drag: {
        start: {
          pageX: '',
          pageY: ''
        }
      },
      visual: null
    }
  },
  computed: {
    style () {
      return {
        left: this.widget.positionX + 'px',
        top: this.widget.positionY + 'px',
        width: this.widget.width + 'px',
        height: this.widget.height + 'px'
      }
    },
    active () {
      return this.widget.id === this.activeWidgetId
    },
    ...mapState(['activeWidgetId'])
  },
  created () {
  },
  mounted () {
    document.addEventListener('keyup', this.onDocumentKeyup)
  },
  beforeDestroy () {
    document.removeEventListener('keyup', this.onDocumentKeyup)
  },
  methods: {
    setVisual () {
      const { width, height, positionX, positionY, id } = this.widget
      this.visual = { width, height, positionX, positionY, id }
    },
    removeVisual () {
      this.visual = null
    },
    onDragStart (e) {
      // 记录起始位置
      const { pageX, pageY } = e
      this.drag.start.pageX = pageX
      this.drag.start.pageY = pageY

      // 定义拖动效果
      e.dataTransfer.dropEffect = 'move'

      // 定义跟随图片
      const canvas = document.createElementNS(
        'http://www.w3.org/1999/xhtml',
        'canvas'
      )
      canvas.width = canvas.height = 50

      // var ctx = canvas.getContext('2d')
      // ctx.lineWidth = 4
      // ctx.moveTo(0, 0)
      // ctx.lineTo(50, 50)
      // ctx.moveTo(0, 50)
      // ctx.lineTo(50, 0)
      // ctx.stroke()
      e.dataTransfer.setDragImage(canvas, 25, 25)

      // 通知父组件，删除当前控件的参考线
      this.$emit('widget-drag-start', this.widget.id)

      // 设置visual
      this.setVisual()
    },
    onDrag (e) {
      // 处理最后一次会变成0
      if (e.pageX === 0 && e.pageY === 0) {
        return
      }
      // 获取位置增量
      const dX = e.pageX - this.drag.start.pageX
      const dY = e.pageY - this.drag.start.pageY

      // 更新visual
      this.visual.positionX += dX
      this.visual.positionY += dY

      // 重置起始位置
      const { pageX, pageY } = e
      this.drag.start.pageX = pageX
      this.drag.start.pageY = pageY
      // 边界修正
      const { positionX, positionY } = this.correctPositon(this.visual)
      this.visual.positionX = positionX
      this.visual.positionY = positionY

      // 通知父组件
      this.$emit('widget-move', this.visual)
    },
    onDragOver (e) {
      e.dataTransfer.dropEffect = 'none'
    },
    onDragEnd (e) {
      this.removeVisual()
    },
    onDrop (e) {
      e.preventDefault()
    },
    onDragStartResize (e) {
      const { pageX, pageY } = e
      this.resize.start.pageX = pageX
      this.resize.start.pageY = pageY
      // 定义拖动效果
      e.dataTransfer.dropEffect = 'move'
      // 定义跟随图片
      const canvas = document.createElementNS(
        'http://www.w3.org/1999/xhtml',
        'canvas'
      )
      canvas.width = canvas.height = 50
      // var ctx = canvas.getContext('2d')
      // ctx.lineWidth = 4
      // ctx.moveTo(0, 0)
      // ctx.lineTo(50, 50)
      // ctx.moveTo(0, 50)
      // ctx.lineTo(50, 0)
      // ctx.stroke()
      e.dataTransfer.setDragImage(canvas, 25, 25)

      this.$emit('widget-drag-start', this.widget.id)
      this.setVisual()
    },
    onDragResize (e) {
      // 处理最后一次会变成0
      if (e.pageX === 0 && e.pageY === 0) {
        return
      }
      const dX = e.pageX - this.resize.start.pageX
      const dY = e.pageY - this.resize.start.pageY

      // 重置起始位置
      const { pageX, pageY } = e
      this.resize.start.pageX = pageX
      this.resize.start.pageY = pageY
      switch (e.target.style.cursor) {
        case 'nw-resize':
          this.visual.positionX += dX
          this.visual.positionY += dY
          this.visual.width -= dX
          this.visual.height -= dY
          break
        case 'n-resize':
          this.visual.positionY += dY
          this.visual.height -= dY
          break
        case 'ne-resize':
          this.visual.positionY += dY
          this.visual.width += dX
          this.visual.height -= dY
          break
        case 'w-resize':
          this.visual.positionX += dX
          this.visual.width -= dX
          break
        case 'e-resize':
          this.visual.width += dX
          break
        case 'sw-resize':
          this.visual.positionX += dX
          this.visual.width -= dX
          this.visual.height += dY
          break
        case 's-resize':
          this.visual.height += dY
          break
        case 'se-resize':
          this.visual.width += dX
          this.visual.height += dY
          break
        default:
          return
      }

      this.$emit('widget-resize', {
        widget: this.visual,
        cursor: e.target.style.cursor
      })
    },
    onDragEndResize (e) {
      this.removeVisual()
    },
    onDblckick () {
      this.$emit('widget-active', this.widget.id)
    },
    onDocumentKeyup (e) {
      if (e.target === document.body) {
        if (['Delete', 'Backspace'].includes(e.code)) {
          this.$emit('widget-delete', this.widget.id)
        }
      }
    },
    // 边界修正
    correctPositon ({ positionX, positionY, width, height }) {
      positionX = positionX < 0 ? 0 : positionX
      positionY = positionY < 0 ? 0 : positionY
      positionX =
        positionX + width > this.$parent.$refs.designerContent.clientWidth
          ? this.$parent.$refs.designerContent.clientWidth - width
          : positionX
      positionY =
        positionY + height > this.$parent.$refs.designerContent.clientHeight
          ? this.$parent.$refs.designerContent.clientHeight - height
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
.widgetMovable {
  position: absolute;
  background: transparent;
  .mask {
    width: 100%;
    height: 100%;
    position: absolute;
    border: 2px solid transparent;
    z-index: 1;
  }
  .circle {
    width: 8px;
    height: 8px;
    background: rebeccapurple;
    position: absolute;
    border-radius: 2px;
    z-index: 1;
  }
}
</style>
