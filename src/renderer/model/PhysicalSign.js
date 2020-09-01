import { Polyline, Label } from 'spritejs'
import moment from 'moment'
export class PhysicalSignLine {
  constructor ({ signId, name, label, color, group, layer, startTime, endTime, min, max }) {
    this._signId = signId
    this._name = name
    this._label = label
    this._color = color
    this._group = group
    this._layer = layer
    this._startMoment = +moment(startTime)
    this._endMoment = +moment(endTime)
    this._min = min
    this._max = max
    this._labels = new Map()
    this._line = new Polyline(
      {
        pos: [0, 0],
        points: [],
        strokeColor: this._color,
        lineWidth: 1,
        className: 'signLine'
      }
    )
    this._group.append(this._line)
  }

  addPoint ({ time, value }) {
    const { x, y } = this._coordinateAdaptor({ time, value })
    const thisMoment = +moment(time, 'YYYY-MM-DD HH:mm:ss')
    const text = thisMoment % (5 * 60 * 1000) === 0 ? this._label : ''
    const label = new Label(text)
    const position = [x, y]
    const width = 12
    const height = 14
    label.attr({
      anchor: [0, 0],
      width,
      height,
      fontSize: 12,
      textAlign: 'center',
      verticalAlign: 'middle',
      fillColor: this._color,
      pos: [position[0] - width / 2, position[1] - height / 2],
      zIndex: 1,
      className: 'signLabel',
      signId: this._signId,
      pointValue: { time, value }
    })
    this._labels.set(label, position)

    let offsetPosition = [0, 0]
    const mousedownHandler = e => {
      const { x, y } = e
      offsetPosition = label.getOffsetPosition(x - width / 2, y - height / 2)
      this._layer.addEventListener('mousemove', mousemoveHandler)
      this._layer.addEventListener('mouseup', mouseupHandler)
    }
    const mousemoveHandler = e => {
      const { x, y } = e
      const groupOffsetPosition = this._group.getOffsetPosition(x, y)
      let newPosY = Math.min(groupOffsetPosition[1] - offsetPosition[1], this._group.attr('height'))
      newPosY = Math.max(0, newPosY)
      const newPos = [position[0], newPosY]
      label.setAttribute('pos', [newPos[0] - width / 2, newPos[1] - height / 2])
      label.setAttribute('fillColor', 'red')
      this._labels.set(label, newPos)
      this._drawLine()
      label.attr('pointValue', this.getPoint(label))
    }
    const mouseupHandler = e => {
      this._layer.removeEventListener('mousemove', mousemoveHandler)
      this._layer.removeEventListener('mouseup', mouseupHandler)
    }
    label.addEventListener('mousedown', mousedownHandler)
    this._group.append(label)
    this._drawLine()
  }

  getPoint (label) {
    const position = this._labels.get(label)
    if (position) {
      return this._valueAdaptor(position)
    } else {
      return null
    }
  }

  getLegend () {
    const legend = new Label(this._label + this._name)
    legend.attr({
      anchor: [0, 0],
      fontSize: 12,
      height: 20,
      textAlign: 'center',
      verticalAlign: 'middle',
      fillColor: this._color
    })
    return legend
  }

  _drawLine () {
    const points = Array.from(this._labels.values()).reduce((arr, item) => arr.concat(item))
    this._line.setAttribute('points', points)
  }

  // 时间和值转化为坐标
  _coordinateAdaptor ({ time, value }) {
    const thisMoment = +moment(time)
    let x = (thisMoment - this._startMoment) / (this._endMoment - this._startMoment) * this._group.attr('width')
    x = Math.round(x)
    let y = (this._max - value) / (this._max - this._min) * this._group.attr('height')
    y = Math.round(y)
    return {
      x,
      y
    }
  }

  // 坐标转化为时间和值
  _valueAdaptor ([x, y]) {
    let time = x / this._group.attr('width') * (this._endMoment - this._startMoment) + this._startMoment
    time = moment(time).format('YYYY-MM-DD HH:mm')
    let value = this._max - y / this._group.attr('height') * (this._max - this._min)
    value = Math.round(value)
    return {
      time,
      value
    }
  }
}

export class PhysicalSignLegends {
  constructor (group) {
    this._group = group
    this.legends = []
  }

  addLegend ({ label, name, color }) {
    const legend = new Label(label + name)
    legend.attr({
      anchor: [0, 0],
      fontSize: 12,
      height: 20,
      textAlign: 'center',
      verticalAlign: 'middle',
      fillColor: color
    })
    this.legends.push(legend)
    legend.attr('pos', [0, 20 * (this.legends.length - 1)])
    this._group.append(legend)
  }

  clear () {
    this.legends = []
    this._group.removeAllChildren()
  }
}

export class PhysicalSignEventTags {
  constructor ({ group, startTime, endTime }) {
    this._group = group
    this._startMoment = +moment(startTime)
    this._endMoment = +moment(endTime)
  }

  addTag ({ order, label, time, color }) {
    const text = label || order + ''
    const tag = new Label(text)
    tag.attr({
      anchor: [0, 0],
      fontSize: 12,
      width: 12,
      textAlign: 'center',
      verticalAlign: 'middle',
      fillColor: color,
      className: 'eventTag'
    })

    const thisMoment = +moment(time, 'YYYY-MM-DD HH:mm:ss')
    let x = (thisMoment - this._startMoment) / (this._endMoment - this._startMoment) * this._group.attr('width')
    x = Math.round(x)

    tag.attr('pos', [x - 6, 10])
    this._group.append(tag)
  }

  clear () {
    const tags = this._group.querySelectorAll('.eventTag')
    tags.forEach(el => this._group.removeChild(el))
  }
}
