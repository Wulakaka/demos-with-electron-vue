<template>
  <div>
    <table
      class="table"
      @mousedown.capture="onMouseDown"
      @mouseup.capture="onMouseUp"
      ref="table"
    >
      <tr
        v-for="(col, rolIndex) of table.cells"
        :key="rolIndex"
      >
        <td
          is="WidgetTableCell"
          v-for="(cell, rowIndex) of col"
          :key="rowIndex"
          :cell="cell"
          :range="range"
          :active-cells-array="activeCellsArray"
          @activate="onActivate"
          @deactivate="onDeactivate"
        />
      </tr>
    </table>
    <el-button
      size="mini"
      @click="onMergeCells"
    >
      合并
    </el-button>
    {{ range }}{{ activeCellsArray }}
    <pre>
      {{ table.cells }}
    </pre>
  </div>
</template>
<script>
import WidgetTableCell from './WidgetTableCell'
import debounce from 'lodash/debounce'

export default {
  name: 'WidgetTable',
  components: {
    WidgetTableCell
  },
  data () {
    return {
      table: {
        cells: []
      },
      activeCellsByHover: {},
      activeCells: {},
      activeCellsArray: [],
      startPosition: null,
      endPosition: null
    }
  },
  computed: {
    range () {
      if (this.startPosition && this.endPosition) {
        return {
          x: [
            Math.min(this.startPosition.x, this.endPosition.x),
            Math.max(this.startPosition.x, this.endPosition.x)
          ],
          y: [
            Math.min(this.startPosition.y, this.endPosition.y),
            Math.max(this.startPosition.y, this.endPosition.y)
          ]
        }
      }
      return {}
    }
  },
  created () {
    this.table.cells = this.generateCells(35, 5)
    this.onMouseMove = debounce(this.onMouseMove, 16)
    this.cells = this.table.cells.reduce((acc, row) => {
      return [...acc, ...row]
    }, [])
  },
  methods: {
    generateCells (rows, cols) {
      const cells = []
      for (let row = 0; row < rows; row++) {
        const _row = []
        for (let col = 0; col < cols; col++) {
          _row.push({
            index: `${row}-${row + 1}_${col}-${col + 1}`,
            width: 100,
            height: 30
          })
        }
        cells.push(_row)
      }
      return cells
    },
    onMouseDown (e) {
      // 重置处于活跃状态的单元格
      this.activeCells = {}
      // 重置处于活跃状态的单元格的数组
      this.resetActiveCellsArray()
      // 重置起始位置
      this.startPosition = this.getTableOffset(e)
      // 清空结束位置
      this.endPosition = null
      // 增加监听
      this.$refs.table.addEventListener('mousemove', this.onMouseMove)
    },
    onMouseMove (e) {
      this.endPosition = this.getTableOffset(e)
    },
    onMouseUp (e) {
      this.endPosition = this.getTableOffset(e)
      this.$refs.table.removeEventListener('mousemove', this.onMouseMove)
      this.activeCells = this.activeCellsByHover
      this.activeCellsByHover = {}
      this.resetActiveCellsArray()
    },
    onActivate (cell) {
      // console.log('activate', new Date())
      this.activeCellsByHover[cell.index] = cell
      this.resetActiveCells()
      // console.log('activate end', new Date())
    },
    onDeactivate ({ index }) {
      console.log('deactivate')
      delete this.activeCellsByHover[index]
      this.resetActiveCells()
    },
    // 合并单元格
    onMergeCells () {
      const { length } = this.activeCellsArray
      if (length > 1) {
        // 获取边界
        const {
          rowLowerBound, rowHigherBound, colLowerBound, colHigherBound
        } = this.getBounds(this.activeCells)
        const activeCells = this.table.cells.map(row => {
          return row.filter(cell => {
            const [, _rowLowerBound, _rowHigherBound, _colLowerBound, _colHigherBound] = /^(\d+)-(\d+)_(\d+)-(\d+)$/.exec(cell.index)
            return (
              rowLowerBound <= _rowLowerBound &&
                                rowHigherBound >= _rowHigherBound &&
                                colLowerBound <= _colLowerBound &&
                                colHigherBound >= _colHigherBound
            )
          })
        }).reduce((acc, row) => {
          return [...acc, ...row]
        }, [])
        // 修改第一个单元格的index
        const leftTopCell = activeCells.shift()
        leftTopCell.index = `${rowLowerBound}-${rowHigherBound}_${colLowerBound}-${colHigherBound}`
        // 删除原始数据 需要从后往前删
        activeCells.reverse()
        activeCells.forEach(cell => {
          const { rowIndex, colIndex } = this.getCellByIndex(cell.index)
          this.table.cells[rowIndex].splice(colIndex, 1)
        })
        // 重置起始位置
        this.startPosition = null
        // 重置结束位置
        this.endPosition = null
        // 重置处于活跃状态的单元格
        this.activeCells = {}
        // 重置处于活跃状态的单元格的数组
        this.resetActiveCellsArray()
      }
    },
    // 获取以table为基准的相对位置
    getTableOffset (e) {
      const offset = {
        x: e.offsetX,
        y: e.offsetY
      }
      let target = e.target
      while (target !== this.$refs.table) {
        offset.x += target.offsetLeft
        offset.y += target.offsetTop
        target = target.offsetParent
      }
      return offset
    },
    // 获取边界
    getBounds (cellsMap) {
      let rowLowerBound, rowHigherBound, colLowerBound, colHigherBound
      Object.keys(cellsMap).forEach(cellIndex => {
        const [, _rowLowerBound, _rowHigherBound, _colLowerBound, _colHigherBound] = /^(\d+)-(\d+)_(\d+)-(\d+)$/.exec(cellIndex)
        rowLowerBound = typeof rowLowerBound === 'undefined' ? _rowLowerBound : Math.min(rowLowerBound, _rowLowerBound)
        rowHigherBound = typeof rowHigherBound === 'undefined' ? _rowHigherBound : Math.max(rowHigherBound, _rowHigherBound)
        colLowerBound = typeof colLowerBound === 'undefined' ? _colLowerBound : Math.min(colLowerBound, _colLowerBound)
        colHigherBound = typeof colHigherBound === 'undefined' ? _colHigherBound : Math.max(colHigherBound, _colHigherBound)
      })
      return {
        rowLowerBound, rowHigherBound, colLowerBound, colHigherBound
      }
    },
    resetActiveCells () {
      let {
        rowLowerBound, rowHigherBound, colLowerBound, colHigherBound
      } = this.getBounds(this.activeCellsByHover)
      if (typeof rowLowerBound === 'undefined') return
      // 循环获取激活边界
      let newRowLowerBound, newRowHigherBound, newColLowerBound, newColHigherBound
      this.activeCells = this.activeCellsByHover
      while (
        rowLowerBound !== newRowLowerBound ||
                    rowHigherBound !== newRowHigherBound ||
                    colLowerBound !== newColLowerBound ||
                    colHigherBound !== newColHigherBound
      ) {
        ({
          rowLowerBound, rowHigherBound, colLowerBound, colHigherBound
        } = this.getBounds(this.activeCells))
        this.cells.forEach(cell => {
          const [, _rowLowerBound, _rowHigherBound, _colLowerBound, _colHigherBound] = /^(\d+)-(\d+)_(\d+)-(\d+)$/.exec(cell.index)
          // 判断是否有交集
          if (
            Math.max(rowLowerBound, _rowLowerBound) < Math.min(rowHigherBound, _rowHigherBound) &&
                            Math.max(colLowerBound, _colLowerBound) < Math.min(colHigherBound, _colHigherBound)
          ) {
            this.activeCells[cell.index] = cell
          } else {
            delete this.activeCells[cell.index]
          }
        });
        ({
          rowLowerBound: newRowLowerBound,
          rowHigherBound: newRowHigherBound,
          colLowerBound: newColLowerBound,
          colHigherBound: newColHigherBound
        } = this.getBounds(this.activeCells))
      }
      this.resetActiveCellsArray()
    },
    resetActiveCellsArray () {
      this.activeCellsArray = Object.keys(this.activeCells)
    },
    getCellByIndex (index) {
      const [, rowIndex] = /^(\d+)-\d+_\d+-\d+$/.exec(index)
      const cell = this.table.cells[rowIndex].find(cell => cell.index === index)
      const colIndex = this.table.cells[rowIndex].findIndex(cell => cell.index === index)
      return {
        cell,
        rowIndex,
        colIndex
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .table {
    border-collapse: collapse;

    tr {
      height: 30px;
    }
  }

</style>
