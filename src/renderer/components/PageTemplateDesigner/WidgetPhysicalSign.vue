<template>
  <div
    ref="physicalSign"
    class="widgetPhysicalSign"
    :style="widgetStyle"
    :title="title"
  />
</template>

<script>
import * as spritejs from 'spritejs'
import { addListener, removeListener } from 'resize-detector'
import debounce from 'lodash/debounce'
import moment from 'moment'
import {
  getSocketData,
  getSignData,
  getEventData
} from '@/api/medicalDocument'
import request from '@/utils/request'
import {
  PhysicalSignLine,
  PhysicalSignLegends,
  PhysicalSignEventTags
} from '@/model/PhysicalSign'
import io from 'socket.io-client'

const { Scene, Group, Label, Polyline } = spritejs
export default {
  props: {
    configuration: {
      type: Object,
      required: true
    },
    editMode: {
      type: Boolean,
      default: true
    },
    startTime: {
      type: String,
      default: ''
    },
    endTime: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      widgetStyle: {},
      title: '',
      layer: null,
      layout: {},
      lines: {},
      legends: null,
      eventTags: null,
      socket: null
    }
  },
  watch: {
    configuration: {
      deep: true,
      handler: function (val) {
        if (this.editMode) {
          this.setStyle()
          this.resize()
        }
      }
    },
    startTime: {
      handler: function (val) {
        if (val) {
          if (!this.editMode) {
            this.getData()
          }
        }
      }
    }
  },
  created () {
    this.setStyle()
    this.resize = debounce(this.domResizeListener, 20)
  },
  async mounted () {
    this.renderScene()
    this.createGroups()
    this.setLayout()
    this.setContent()
    if (this.editMode) {
      addListener(this.$refs.physicalSign, this.resize)
    } else {
      // 初始化图例区域
      this.setLegends()
      // 获取拖动过的数据
      this.layer.addEventListener('mouseup', this.getChangedPoint)
      // 初始化事件标记区域
      this.setEventTags()
      // 获取数据
      this.getData()
      // 添加grid展示详情效果
      this.addGirdTooltip()
    }
  },
  beforeDestroy () {
    if (this.editMode) {
      removeListener(this.$refs.physicalSign, this.resize)
    } else {
      this.layer.removeEventListener('mouseup', this.getChangedPoint)
      this.socket = null
    }
    this.scene = null
  },
  methods: {
    setStyle () {
      const { border } = this.configuration
      let styleObj = {}
      const borderObj = border.position.reduce((obj, item) => {
        obj['border-' + item] = border.width + 'px solid ' + border.color
        return obj
      }, {})

      styleObj = { ...styleObj, ...borderObj }
      this.widgetStyle = styleObj
    },
    domResizeListener () {
      this.scene.resize()
      this.setLayout()
      this.setContent()
    },
    renderScene () {
      this.scene = new Scene({
        container: this.$refs.physicalSign,
        width: this.$refs.width,
        height: this.$refs.height,
        mode: 'static'
      })

      this.layer = this.scene.layer()
    },
    createGroups () {
      const leftPart = new Group({
        className: 'leftPart'
      })
      const middlePart = new Group({
        className: 'middlePart'
      })
      const rightPart = new Group({
        className: 'rightPart'
      })
      this.layer.append(leftPart, middlePart, rightPart)

      const leftTitle = new Group({
        className: 'leftTitle content'
      })
      const leftMain = new Group({
        className: 'leftMain'
      })
      leftPart.append(leftTitle, leftMain)

      const timeTitle = new Group({
        className: 'timeTitle content'
      })
      const yAxis = new Group({
        className: 'yAxis content'
      })
      const eventTitle = new Group({
        className: 'eventTitle content'
      })
      leftMain.append(timeTitle, yAxis, eventTitle)

      const xAxis = new Group({
        className: 'xAxis content'
      })
      const grid = new Group({
        className: 'grid content'
      })
      const eventTag = new Group({
        className: 'eventTag content'
      })
      middlePart.append(xAxis, grid, eventTag)

      const totalTitle = new Group({
        className: 'totalTitle content'
      })
      const legend = new Group({
        className: 'legend content'
      })
      rightPart.append(totalTitle, legend)
    },
    setLayout () {
      // 清空子元素
      this.layer.getElementsByClassName('content').forEach(ref => {
        ref.removeAllChildren()
      })
      // leftPart
      const leftPart = this.layer.getElementsByClassName('leftPart')[0]
      leftPart.attr({
        size: [
          Math.round(this.layer.width * this.configuration.leftPartWidthRate),
          this.layer.height
        ]
      })
      // leftPart/leftTitle
      const leftTitle = leftPart.getElementsByClassName('leftTitle')[0]
      leftTitle.attr({
        size: [this.configuration.leftTitle.width || 0, leftPart.attr('height')]
      })
      const leftTitleBorderRightLine = new Polyline({
        pos: [leftTitle.attr('width') - 0.5, 0],
        points: [0, 0, 0, leftPart.attr('height')],
        strokeColor: 'black',
        lineWidth: 1
      })
      leftTitle.append(leftTitleBorderRightLine)
      // leftPart/leftMain
      const leftMain = leftPart.getElementsByClassName('leftMain')[0]
      leftMain.attr({
        size: [
          leftPart.attr('width') - leftTitle.attr('width'),
          leftPart.attr('height')
        ],
        pos: [leftTitle.attr('width'), 0]
      })
      // leftPart/leftMain/timeTitle
      const timeTitle = leftMain.getElementsByClassName('timeTitle')[0]
      timeTitle.attr({
        size: [leftMain.attr('width'), this.configuration.timeTitle.height]
      })
      const timeTitleBorderRightLine = new Polyline({
        pos: [timeTitle.attr('width') - 0.5, 0],
        points: [0, timeTitle.attr('height') - 1, 0, timeTitle.attr('height')],
        strokeColor: 'black',
        lineWidth: 1
      })
      timeTitle.append(timeTitleBorderRightLine)

      // leftPart/leftMain/yAxis
      const yAxis = leftMain.getElementsByClassName('yAxis')[0]
      yAxis.attr({
        size: [
          leftMain.attr('width'),
          leftMain.attr('height') -
            this.configuration.timeTitle.height -
            this.configuration.eventTitle.height
        ],
        pos: [0, this.configuration.timeTitle.height]
      })
      const yAxisBorderRightLine = new Polyline({
        pos: [yAxis.attr('width') - 0.5, 0],
        points: [0, 0, 0, yAxis.attr('height')],
        strokeColor: 'black',
        lineWidth: 1
      })
      const yAxisBorderBottomLine = new Polyline({
        pos: [0, yAxis.attr('height') - 0.5],
        points: [0, 0, yAxis.attr('width'), 0],
        strokeColor: 'black',
        lineWidth: 1
      })
      yAxis.append(yAxisBorderRightLine, yAxisBorderBottomLine)

      // leftPart/leftMain/eventTitle
      const eventTitle = leftMain.getElementsByClassName('eventTitle')[0]
      eventTitle.attr({
        size: [leftMain.attr('width'), this.configuration.eventTitle.height],
        pos: [0, leftMain.attr('height') - this.configuration.eventTitle.height]
      })
      const eventTitleBorderRightLine = new Polyline({
        pos: [eventTitle.attr('width') - 0.5, 0],
        points: [0, 0, 0, eventTitle.attr('height')],
        strokeColor: 'black',
        lineWidth: 1
      })
      eventTitle.append(eventTitleBorderRightLine)

      // middlePart
      const middlePart = this.layer.getElementsByClassName('middlePart')[0]
      middlePart.attr({
        size: [
          Math.round(
            this.layer.width *
              (1 -
                this.configuration.leftPartWidthRate -
                this.configuration.rightPartWidthRate)
          ),
          this.layer.height
        ],
        pos: [leftPart.attr('width'), 0]
      })

      // middlePart/xAxis
      const xAxis = middlePart.getElementsByClassName('xAxis')[0]
      xAxis.attr({
        size: [middlePart.attr('width'), this.configuration.timeTitle.height]
      })
      const xAxisBorderRightLine = new Polyline({
        pos: [xAxis.attr('width') - 0.5, 0],
        points: [0, 0, 0, xAxis.attr('height')],
        strokeColor: 'black',
        lineWidth: 1
      })
      const xAxisBorderBottomLine = new Polyline({
        pos: [0, xAxis.attr('height') - 0.5],
        points: [0, 0, xAxis.attr('width'), 0],
        strokeColor: 'black',
        lineWidth: 1
      })
      xAxis.append(xAxisBorderRightLine, xAxisBorderBottomLine)
      // middlePart/grid
      const grid = middlePart.getElementsByClassName('grid')[0]
      grid.attr({
        size: [
          middlePart.attr('width'),
          middlePart.attr('height') -
            this.configuration.timeTitle.height -
            this.configuration.eventTitle.height
        ],
        pos: [0, xAxis.attr('height')]
      })
      const gridBorderRightLine = new Polyline({
        pos: [grid.attr('width') - 0.5, 0],
        points: [0, 0, 0, grid.attr('height')],
        strokeColor: 'black',
        lineWidth: 1
      })
      const gridBorderBottomLine = new Polyline({
        pos: [0, grid.attr('height') - 0.5],
        points: [0, 0, grid.attr('width'), 0],
        strokeColor: 'black',
        lineWidth: 1
      })
      grid.append(gridBorderRightLine, gridBorderBottomLine)
      // middlePart/eventTag
      const eventTag = middlePart.getElementsByClassName('eventTag')[0]
      eventTag.attr({
        size: [middlePart.attr('width'), this.configuration.eventTitle.height],
        pos: [
          0,
          middlePart.attr('height') - this.configuration.eventTitle.height
        ]
      })
      const eventTagBorderRightLine = new Polyline({
        pos: [eventTag.attr('width') - 0.5, 0],
        points: [0, 0, 0, eventTag.attr('height')],
        strokeColor: 'black',
        lineWidth: 1
      })
      eventTag.append(eventTagBorderRightLine)

      // rightPart
      const rightPart = this.layer.getElementsByClassName('rightPart')[0]
      rightPart.attr({
        size: [
          Math.round(this.layer.width * this.configuration.rightPartWidthRate),
          this.layer.height
        ],
        pos: [leftPart.attr('width') + middlePart.attr('width'), 0]
      })

      // rightPart/totalTitle
      const totalTitle = rightPart.getElementsByClassName('totalTitle')[0]
      totalTitle.attr({
        size: [rightPart.attr('width'), this.configuration.timeTitle.height]
      })
      const totalTitleBorderBottomLine = new Polyline({
        pos: [0, totalTitle.attr('height') - 0.5],
        points: [0, 0, totalTitle.attr('width'), 0],
        strokeColor: 'black',
        lineWidth: 1
      })
      totalTitle.append(totalTitleBorderBottomLine)

      // rightPart/legend
      const legend = rightPart.getElementsByClassName('legend')[0]
      legend.attr({
        size: [
          rightPart.attr('width'),
          rightPart.attr('height') - this.configuration.timeTitle.height
        ],
        pos: [0, this.configuration.timeTitle.height]
      })
    },
    setContent () {
      this.setLeftTitle()
      this.setTimeTitle()
      this.setYAxis()
      this.setEventTitle()
      this.setXAxisList()
      this.setXAxis()
      this.setGrid()
      this.setTotalTitle()
    },
    setLeftTitle () {
      const leftTitle = this.layer.getElementsByClassName('leftTitle')[0]
      const width = leftTitle.attr('width')
      const height = leftTitle.attr('height')
      const textArr = this.configuration.leftTitle.text.split('')
      const lineHeight = this.configuration.leftTitle.lineHeight
      const titleTextGroup = new Group()
      titleTextGroup.attr({
        size: [width - 1, textArr.length * lineHeight],
        pos: [width / 2, height / 2],
        anchor: [0.5, 0.5]
      })
      textArr.forEach((item, i, arr) => {
        const title = new Label(item)
        title.attr({
          pos: [0, lineHeight * i - (lineHeight * arr.length) / 2],
          anchor: [0.5, 0],
          fontSize: 12,
          fontFamily: '宋体',
          textAlign: 'center',
          fillColor: 'black',
          width: width,
          height: lineHeight,
          lineHeight: lineHeight
        })
        titleTextGroup.append(title)
      })
      leftTitle.append(titleTextGroup)
    },
    setTimeTitle () {
      const timeTitle = this.layer.getElementsByClassName('timeTitle')[0]
      const text = new Label(this.configuration.timeTitle.text)
      text.attr({
        fontSize: 12,
        fontFamily: '宋体',
        textAlign: 'center',
        fillColor: 'black',
        width: Math.round(timeTitle.attr('width')),
        height: this.configuration.timeTitle.height,
        lineHeight: this.configuration.timeTitle.lineHeight
      })
      timeTitle.append(text)
    },
    setYAxis () {
      const yAxis = this.layer.getElementsByClassName('yAxis')[0]
      const width = Math.round(
        yAxis.attr('width') / this.configuration.yAxis.list.length
      )
      this.configuration.yAxis.list.forEach(item => {
        const { index, values } = item
        const textGroup = new Group()
        textGroup.attr({
          width: width,
          height: yAxis.attr('height'),
          anchor: [0, 1],
          pos: [width * index, yAxis.attr('height')]
        })
        yAxis.append(textGroup)
        const arrange = values[values.length - 1].value - values[0].value
        const scale = yAxis.attr('height') / arrange
        values.forEach((t, i) => {
          const label = new Label(t.label.toString())
          let posY = -(t.value - values[0].value) * scale
          posY = Math.min(-7, posY)
          posY = Math.max(-yAxis.attr('height') + 7, posY)
          label.attr({
            fontSize: 12,
            fontFamily: '宋体',
            textAlign: 'right',
            fillColor: 'black',
            width: width,
            height: 18,
            padding: [0, 5, 0, 0],
            anchor: [1, 0.5],
            pos: [width, posY]
          })
          textGroup.append(label)
        })
      })
    },
    setEventTitle () {
      const eventTitle = this.layer.getElementsByClassName('eventTitle')[0]
      const text = new Label(this.configuration.eventTitle.text)
      text.attr({
        fontSize: 12,
        fontFamily: '宋体',
        textAlign: 'center',
        fillColor: 'black',
        width: Math.round(eventTitle.attr('width')),
        height: this.configuration.eventTitle.height,
        lineHeight: this.configuration.eventTitle.lineHeight
      })
      eventTitle.append(text)
    },
    setTotalTitle () {
      const totalTitle = this.layer.getElementsByClassName('totalTitle')[0]
      const text = new Label(this.configuration.totalTitle.text)
      text.attr({
        fontSize: 12,
        fontFamily: '宋体',
        textAlign: 'center',
        fillColor: 'black',
        width: Math.round(totalTitle.attr('width')),
        height: this.configuration.timeTitle.height,
        lineHeight: this.configuration.timeTitle.lineHeight
      })
      totalTitle.append(text)
    },
    setXAxisList () {
      const startMoment = +moment(this.configuration.xAxis.startTime)
      const endMoment = +moment(this.configuration.xAxis.endTime)
      const list = []
      for (let i = startMoment; i < endMoment;) {
        list.push({
          // value: i - startMoment,
          label: moment(i).format('HH:mm')
        })
        i += this.configuration.xAxis.timeInterval * 60 * 1000
      }
      this.xAxisList = list
    },
    setXAxis () {
      const xAxis = this.layer.getElementsByClassName('xAxis')[0]
      const width = xAxis.attr('width')
      const height = xAxis.attr('height')
      const list = this.xAxisList
      const scale = width / list.length
      list.forEach((item, index, arr) => {
        const label = new Label(item.label.toString())
        label.attr({
          fontSize: 12,
          fontFamily: '宋体',
          textAlign: 'right',
          fillColor: 'black',
          height: height,
          lineHeight: height,
          anchor: [0.5, 0],
          pos: [Math.round(index * scale), 0]
        })
        xAxis.append(label)
      })
    },
    setGrid () {
      const grid = this.layer.getElementsByClassName('grid')[0]
      const width = grid.attr('width')
      const height = grid.attr('height')
      const xAxislist = this.xAxisList
      const xScale = width / xAxislist.length
      xAxislist.forEach((item, index, arr) => {
        if (index) {
          const mainLine = new Polyline({
            pos: [Math.round(index * xScale) - 0.5, 0],
            points: [0, 0, 0, height],
            strokeColor: 'gray',
            lineWidth: 1
          })
          grid.append(mainLine)
        }
        for (let i = 1; i < this.configuration.xAxis.lineInterval; i++) {
          const line = new Polyline({
            pos: [
              Math.round(
                index * xScale +
                  i * (xScale / this.configuration.xAxis.lineInterval)
              ) - 0.5,
              0
            ],
            points: [0, 0, 0, height],
            strokeColor: 'gray',
            lineWidth: 1,
            lineDash: [1, 2, 3]
          })
          grid.append(line)
        }
      })
      const yAxislistMax =
        this.configuration.yAxis.list.reduce((max, item) => {
          return Math.max(max, item.values.length)
        }, 0) - 1
      const yScale = height / yAxislistMax
      for (let index = 0; index < yAxislistMax; index++) {
        if (index) {
          const mainLine = new Polyline({
            pos: [0, Math.round(index * yScale) - 0.5],
            points: [0, 0, width, 0],
            strokeColor: 'gray',
            lineWidth: 1
          })
          grid.append(mainLine)
        }
        for (let i = 1; i < this.configuration.yAxis.lineInterval; i++) {
          const line = new Polyline({
            pos: [
              0,
              Math.round(
                index * yScale +
                  i * (yScale / this.configuration.yAxis.lineInterval)
              ) - 0.5
            ],
            points: [0, 0, width, 0],
            strokeColor: 'gray',
            lineWidth: 1,
            lineDash: [1, 2, 3]
          })
          grid.append(line)
        }
      }
    },
    async getData () {
      // 清空折线、清空图例、清空事件
      this.clearLines()
      this.clearLegends()
      this.clearEventTags()
      // 请求折线数据
      await this.getPastSignData()
      // 绘制折线
      this.drawLines()
      // 绘制折线图例
      this.drawLineLegends()
      // 请求事件数据
      await this.getPastEventData()
      // 绘制事件标记
      this.drawEventTags()
      // 绘制事件图例
      this.drawEventLegends()
      // socket.io
      this.getDataBySocketIO()
    },
    getPastSignData () {
      return request({
        method: 'POST',
        url: getSignData,
        data: {
          startTime: this.startTime,
          endTime: this.endTime
        }
      })
        .then(res => {
          const requestData = res.data.data
          this.lineList = requestData
        })
        .catch(err => {
          console.log(err)
        })
    },
    drawLines () {
      const gridGroup = this.layer.getElementsByClassName('grid')[0]
      this.lineList.forEach(item => {
        const { min, max } = this.getYAxisValueRange(item.yindex)
        if ((min === max) === 0) {
          return
        }
        const {
          itemCode: signId,
          itemName: name,
          drawIcon: label,
          disColor: color
        } = item
        this.lines[signId] = new PhysicalSignLine({
          signId,
          name,
          label,
          color: '#' + color,
          group: gridGroup,
          layer: this.layer,
          startTime: this.configuration.xAxis.startTime,
          endTime: this.configuration.xAxis.endTime,
          min,
          max
        })
        item.list.forEach(value => {
          this.lines[signId].addPoint({
            time: value.timePoint,
            value: value.itemValue
          })
        })
      })
    },
    clearLines () {
      // 清空对象引用
      this.lines = {}
      // 清除group内的所有线
      const gridGroup = this.layer.getElementsByClassName('grid')[0]
      const lines = gridGroup.querySelectorAll('.signLine')
      lines.forEach(el => gridGroup.removeChild(el))
      const labels = gridGroup.querySelectorAll('.signLabel')
      labels.forEach(el => gridGroup.removeChild(el))
    },
    drawLineLegends () {
      this.lineList.forEach(item => {
        this.legends.addLegend({
          label: item.drawIcon,
          name: item.itemName,
          color: '#' + item.disColor
        })
      })
    },
    setLegends () {
      this.legends = new PhysicalSignLegends(
        this.layer.getElementsByClassName('legend')[0]
      )
    },
    clearLegends () {
      this.legends.clear()
    },
    // 获取某一个Y轴的最大最小值
    getYAxisValueRange (yIndex) {
      const yAxis = this.configuration.yAxis.list.find(
        item => +item.index === yIndex
      )
      if (!yAxis) {
        return {
          min: 0,
          max: 0
        }
      }
      return {
        min: yAxis.values[0].value,
        max: yAxis.values[yAxis.values.length - 1].value
      }
    },
    getChangedPoint (e) {
      if (e.target instanceof Label && e.target.className === 'signLabel') {
        const label = e.target
        const line = this.lines[label.attr('signId')]
        console.log(line.getPoint(label), label.attr('signId'))
      }
    },
    setEventTags () {
      this.eventTags = new PhysicalSignEventTags({
        group: this.layer.getElementsByClassName('eventTag')[0],
        startTime: this.configuration.xAxis.startTime,
        endTime: this.configuration.xAxis.endTime
      })
    },
    clearEventTags () {
      this.eventTags.clear()
    },
    getPastEventData () {
      return request({
        method: 'POST',
        url: getEventData,
        data: {}
      })
        .then(res => {
          const requestData = res.data.data
          this.eventList = this.convertEventData(requestData)
        })
        .catch(err => {
          console.log(err)
        })
    },
    convertEventData (eventData) {
      if (!Array.isArray(eventData)) {
        return []
      }
      const startMoment = +moment(this.startTime)
      const endMoment = +moment(this.endTime)
      let order = 0
      const list = eventData.reduce((arr, item) => {
        const eventArr = []
        const {
          eventCode,
          detailCode,
          detailName: name,
          drawIcon: label,
          iconColor,
          eventStartTime,
          eventEndTime
        } = item
        if (eventStartTime) {
          const eventStartMoment = +moment(eventStartTime, 'YYYY-MM-DD HH:mm:ss')
          if (eventStartMoment >= startMoment && eventStartMoment <= endMoment) {
            eventArr.push({
              eventId: eventCode + '' + detailCode,
              order: ++order,
              name,
              label,
              color: iconColor ? '#' + iconColor : 'black',
              time: eventStartTime,
              startTime: eventStartTime,
              endTime: eventEndTime
            })
          }
        }
        if (eventEndTime) {
          const eventEndMoment = +moment(eventEndTime, 'YYYY-MM-DD HH:mm:ss')
          if (eventEndMoment >= startMoment && eventEndMoment <= endMoment) {
            eventArr.push({
              eventId: eventCode + '' + detailCode,
              order: ++order,
              name,
              label,
              color: iconColor ? '#' + iconColor : 'black',
              time: eventEndTime,
              startTime: eventStartTime,
              endTime: eventEndTime
            })
          }
        }
        return arr.concat(eventArr)
      }, [])
      return list
    },
    drawEventTags () {
      this.eventList.forEach(event => {
        this.eventTags.addTag(event)
      })
    },
    drawEventLegends () {
      this.eventList.forEach(event => {
        if (event.label) {
          this.legends.addLegend(event)
        }
      })
    },
    getDataBySocketIO () {
      // 与当前时间对比，如果结束时间为当前时间之前，则不需要建立连接
      if (+moment(this.endTime) < new Date()) {
        return
      }
      const loginUserNum = 'b0f9d8bda9244397a44cb8ff278937d9'
      this.socket = io(getSocketData, {
        query: {
          loginUserNum
        }
      })
      this.socket.on('connect', () => {
        console.log('socket.io connected')
      })
      this.socket.on('reconnect_error', (e) => {
        console.error(e)
      })
      this.socket.on('disconnect', () => {
        console.log('socket.io disconnect')
      })
      // 体征曲线
      this.socket.on('push_event', res => {
        if (Array.isArray(res)) {
          res.forEach(item => {
            const { itemCode: signId, ...value } = item
            this.lines[signId].addPoint({
              time: value.timePoint,
              value: value.itemValue
            })
          })
        }
      })
      // 术中事件
      this.socket.on('operation event', res => {
        this.eventTags.addTag(res)
        if (res.label) {
          this.legends.addLegend(res)
        }
      })
    },
    addGirdTooltip () {
      const grid = this.layer.querySelector('.grid')
      if (grid) {
        const mousemoveHandler = e => {
          if (e.target instanceof Label) {
            const pointValue = e.target.attr('pointValue')
            this.$tooltip({
              dangerouslyUseHTMLString: true,
              message: `
                <p style="color:white">时间：${pointValue.time}</p>
                <p style="color:white">值：${pointValue.value}</p>
              `,
              positionX: e.originalEvent.pageX,
              positionY: e.originalEvent.pageY
            })
          } else {
            this.$tooltip.remove()
          }
        }
        const mouseleaveHandler = e => {
          this.$tooltip.remove()
        }
        grid.addEventListener('mousemove', mousemoveHandler)
        grid.addEventListener('mouseleave', mouseleaveHandler)
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.widgetPhysicalSign {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}
</style>
