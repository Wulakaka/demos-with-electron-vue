<template>
  <div
    ref="stage"
    class="stage"
  />
</template>
<script>
import * as spritejs from 'spritejs'
import { webSocket } from 'rxjs/webSocket'
const { Sprite, Scene, Polyline } = spritejs
// const { Observable } = require('rxjs')
export default {
  data () {
    return {
      observable: null,
      subject: null,
      layer: null,
      interval: 5,
      birds: new Map(),
      line: null
    }
  },
  computed: {
  },
  created () {
    // this.observable = new Observable(subscriber => {
    // let x = 1
    // subscriber.next({ x: x++, y: Math.random() * 200 })
    // const timeout = () => {
    //   setTimeout(() => {
    //     subscriber.next({ x: x++, y: Math.random() * 200 })
    //     if (x * this.interval > 1200) {
    //       subscriber.complete()
    //     } else {
    //       timeout()
    //     }
    //   }, 1000)
    // }
    // timeout()
    // })

    this.subject.subscribe(res => {
      console.log('response', res)

      try {
        res = JSON.parse(res)
        this.drawBird(res)
        this.drawLine()
      } catch (e) {
        console.log(e)
      }
    })

    // var ws = new WebSocket('ws://192.168.1.157:8081/imserver/10')
    // ws.onopen = function (evt) {
    //   console.log('Connection open ...')
    //   ws.send('Hello WebSockets!')
    // }

    // ws.onmessage = function (evt) {
    //   console.log('Received Message: ' + evt.data)
    //   // ws.close()
    // }

    // ws.onclose = function (evt) {
    //   console.log('Connection closed.')
    // }
  },
  async mounted () {
    const container = this.$refs.stage
    const scene = new Scene({
      container,
      width: 1200,
      height: 800,
      mode: 'stickyTop'
    })

    this.layer = scene.layer()
    this.drawGrid()

    const birdsJsonUrl = 'https://s5.ssl.qhres.com/static/5f6911b7b91c88da.json'
    const birdsRes = 'https://p.ssl.qhimg.com/d/inn/c886d09f/birds.png'
    await scene.preload([birdsRes, birdsJsonUrl])

    this.line = new Polyline({
      pos: [0, 0],
      points: [],
      strokeColor: 'blue',
      lineWidth: 3
    })
    this.layer.append(this.line)

    // this.observable.subscribe(res => {
    //   this.drawBird(res)
    //   this.drawLine()
    // })
  },
  methods: {
    drawGrid () {
      const gridWidth = 1200
      const gridHeight = 800

      // 表格区域
      for (let i = 0; i < gridHeight / 100; i++) {
        const gridHLine = new Polyline({
          pos: [0, 0],
          points: [0, i * 100, gridWidth, i * 100],
          strokeColor: '#eee',
          lineWidth: 1
        })

        this.layer.append(gridHLine)
      }

      for (let i = 0; i < gridWidth / 100; i++) {
        const gridVLine = new Polyline({
          pos: [0, 0],
          points: [i * 100, 0, i * 100, gridHeight],
          strokeColor: '#eee',
          lineWidth: 1
        })

        this.layer.append(gridVLine)
      }
    },
    drawBird ({ x, y }) {
      const bird = new Sprite('bird1.png')
      const originalPos = [x * this.interval, Math.round(y)]
      bird.attr({
        anchor: [0.5, 0.5],
        size: [65, 45],
        pos: originalPos,
        zIndex: 200
      })
      this.birds.set(bird, originalPos)

      let offsetPosition = [0, 0]

      const mousedownHandler = e => {
        const { x, y } = e
        offsetPosition = bird.getOffsetPosition(x, y)
        this.layer.addEventListener('mousemove', mousemoveHandler)
        this.layer.addEventListener('mouseup', mouseupHandler)
      }

      const mousemoveHandler = e => {
        const { y } = e
        const newPos = [originalPos[0], y - offsetPosition[1]]
        bird.setAttribute('pos', newPos)
        this.birds.set(bird, newPos)
        this.drawLine()
      }

      const mouseupHandler = e => {
        this.layer.removeEventListener('mousemove', mousemoveHandler)
        this.layer.removeEventListener('mouseup', mouseupHandler)
      }

      bird.addEventListener('mousedown', mousedownHandler)

      this.layer.append(bird)
    },
    drawLine () {
      const points = Array.from(this.birds.values()).reduce((arr, item) => arr.concat(item))

      this.line.setAttribute('points', points)
    },
    createConnection () {
      this.subject = webSocket({
        url: 'ws://192.168.1.157:8081/imserver/10',
        deserializer: ({ data }) => data
      })
    },
    reconnect () {
      this.reconnectTimer = setTimeout(() => {
        this.subject = webSocket({
          url: 'ws://192.168.1.157:8081/imserver/10',
          deserializer: ({ data }) => data
        })
      }, 2000)
    },
    setListener () {
      this.subject.subscribe(
        // Called whenever there is a message from the server.
        this.onMessage,
        // Called if at any point WebSocket API signals some kind of error.
        this.onError,
        // Called when connection is closed (for whatever reason).
        this.onClose
      )
      this.subject.next({ message: '建立连接' })
    },
    onMessage (msg) {
      console.log('message received: ' + msg)
    },
    onError (err) {
      console.log(err)
      this.subject.unsubscribe()
      this.createConnection()
      this.setListener()
    },
    onClose () {
      console.log('complete')
    }
  }
}
</script>
<style lang="scss" scoped>
.stage {
  width: 100%;
  padding-bottom: 50%;
  // background: #eee;
}
</style>
