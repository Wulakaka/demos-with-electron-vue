<template>
  <div>
    <canvas ref="canvas" />
    <canvas id="SomeElementYouWantToAnimate" />
    <el-table
      :data="tableData"
      style="width: 100%;height:200px"
    >
      <el-table-column
        prop="date"
        label="日期"
        width="180"
      />
      <el-table-column
        prop="name"
        label="姓名"
        width="180"
      />
      <el-table-column
        prop="address"
        label="地址"
      />
    </el-table>
  </div>
</template>
<script>
const { Observable } = require('rxjs')
export default {
  name: 'CanvasPage',
  data () {
    return {
      observable: null,
      ctx: null,
      positions: [],
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    }
  },
  watch: {
    // positions: function (val) {
    //   console.log(val)
    //   // this.drawLine(val)
    // }
  },
  methods: {
    draw () {
      const canvas = this.$refs.canvas
      if (canvas.getContext) {
        this.ctx = canvas.getContext('2d')
        this.ctx.lineWidth = 2
        this.ctx.lineJoin = 'round'
        // this.ctx.font = '48px serif'
        // this.ctx.fillText('Hello world', 10, 50)
        // drawing code here
        // ctx.beginPath()
        // ctx.arc(50, 50, 30, 0, Math.PI * 2, true)
        // ctx.arc(50, 50, 15, 0, Math.PI * 2, true)
        // ctx.fill('evenodd')
        // const positions = [
        //   {
        //     x: 10,
        //     y: 20
        //   }, {
        //     x: 13,
        //     y: 60
        //   }
        // ]
        // this.drawLine(positions, ctx)
      } else {
        // canvas-unsupported code here
      }

      canvas.addEventListener('mouseDown', function (event) {
        if (event.region) {
          console.log(event.region)
        }
      })
    },
    drawLine (position) {
      if (this.positions.length === 1) {
        this.ctx.beginPath()
        this.ctx.moveTo(position.x, Math.floor(position.y))
      } else {
        this.ctx.lineTo(position.x, Math.floor(position.y))
        this.ctx.stroke()
      }
      // this.ctx.c
      // const arr = [...this.positions]
      // this.ctx.beginPath()
      // const firstPosition = arr.shift()
      // this.ctx.moveTo(firstPosition.x, Math.floor(firstPosition.y))
      // arr.forEach(position => {
      //   this.ctx.lineTo(position.x, Math.floor(position.y))
      // })
      // this.ctx.stroke()
      // this.ctx.addHitRegion({ id: 'line' })
    }
  },
  mounted () {
    this.draw()
    this.observable.subscribe(res => {
      this.positions.push(res)
      if (this.ctx) {
        this.drawLine(res)
      }
    })

    var start = null
    var element = document.getElementById('SomeElementYouWantToAnimate')
    element.style.position = 'absolute'

    function step (timestamp) {
      if (!start) start = timestamp
      var progress = timestamp - start
      element.style.left = Math.min(progress / 10, 200) + 'px'
      if (progress < 2000) {
        window.requestAnimationFrame(step)
      }
    }

    window.requestAnimationFrame(step)
  },
  created () {
    this.observable = new Observable(subscriber => {
      let x = 1
      subscriber.next({ x: x++ * 10, y: Math.random() * 200 })
      const timeout = () => {
        setTimeout(() => {
          subscriber.next({ x: x++ * 10, y: Math.random() * 200 })
          if (x * 10 > 300) {
            subscriber.complete()
          } else {
            timeout()
          }
        }, 1000)
      }
      timeout()
    })
  }
}
</script>
<style lang="scss" scoped>
canvas {
  border: 1px solid black;
}
</style>
