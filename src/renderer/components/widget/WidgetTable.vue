<template>
  <div class="content">
    <table
      class="table"
      @mousedown.capture="onMouseDown"
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
    <div>
      <div>
        <el-button
          size="mini"
          @click="onMergeCells"
        >
          合并
        </el-button>
      </div>
      <div>
        <el-button
          size="mini"
          @click="onSplitCells"
        >
          拆分
        </el-button>
      </div>
      <div>
        行数
        <el-input-number
          v-model="rows"
          size="mini"
          @change="onChangeRows"
          step-strictly
          :min="1"
        />
      </div>
      <div>
        列数
        <el-input-number
          v-model="cols"
          size="mini"
          @change="onChangeCols"
          step-strictly
          :min="1"
        />
      </div>
      {{ activeCellsArray }}
    </div>
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
      rows: 10,
      cols: 5,
      // 数据结构
      table: {
        cells: []
      },
      // 辅助变量
      // 存储与鼠标范围有交集的单元格
      activeCellsSetByHover: new Set(),
      // 存储最终被选中的单元格
      activeCellsArray: [],
      // 鼠标框选范围开始位置
      startPosition: null,
      // 鼠标框选范围结束位置
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
    },
    // 辅助变量 - 将单元格变为一维数组 - 为了快速获取单元格数据
    cellArray () {
      return this.table.cells.reduce((acc, row) => [...acc, ...row], [])
    },
    // 辅助变量 - 单元格map - 为了快速获取单元格数据
    cellMap () {
      return this.cellArray.reduce((acc, cell) => {
        acc[cell.index] = cell
        return acc
      }, {})
    },
    // 辅助变量 - 存储所有单元格index的set
    cellIndexSet () {
      return new Set(Object.keys(this.cellMap))
    }
  },
  // watch: {
  //   cellArray: function () {
  //     console.log('cellArray')
  //   },
  //   cellMap: function () {
  //     console.log('cellMap')
  //   },
  //   cellIndexSet: function () {
  //     console.log('cellIndexSet')
  //   }
  // },
  created () {
    this.table.cells = this.generateCells(this.rows, this.cols)
    this.onMouseMove = debounce(this.onMouseMove, 10)
  },
  methods: {
    // 根据行数列数生成表格初始数据
    generateCells (rows, cols) {
      const cells = []
      for (let row = 0; row < rows; row++) {
        const _row = []
        for (let col = 0; col < cols; col++) {
          const cell = {
            index: `${row}-${row + 1}_${col}-${col + 1}`,
            width: 100,
            height: 30
          }
          _row.push(cell)
        }
        cells.push(_row)
      }
      return cells
    },
    onMouseDown (e) {
      // 重置处于活跃状态的单元格的数组
      this.activeCellsArray = []
      this.activeCellsSetByHover.clear()
      // 重置起始位置
      this.startPosition = this.getTableOffset(e)
      // 清空结束位置
      this.endPosition = null
      // 增加监听
      window.addEventListener('mousemove', this.onMouseMove)
      window.addEventListener('mouseup', this.onMouseUp)
      // 存储一个保存所有索引的set，用于判断是否所有状态已经更新
      this.toBeActivateAndDeactivateSet = new Set(this.cellIndexSet)
    },
    onMouseMove (e) {
      if (e.path.includes(this.$refs.table)) {
        this.endPosition = this.getTableOffset(e)
      }
    },
    onMouseUp (e) {
      if (e.path.includes(this.$refs.table)) {
        this.onMouseMove(e)
        window.removeEventListener('mousemove', this.onMouseMove)
      }
      window.removeEventListener('mouseup', this.onMouseUp)
    },
    // 激活
    onActivate (cellIndex) {
      this.activeCellsSetByHover.add(cellIndex)
      this.toBeActivateAndDeactivateSet.delete(cellIndex)
      if (this.toBeActivateAndDeactivateSet.size === 0) {
        this.toBeActivateAndDeactivateSet = new Set(this.cellIndexSet)
        this.setActiveCellsArray()
      }
    },
    // 灭活
    onDeactivate (cellIndex) {
      this.activeCellsSetByHover.delete(cellIndex)
      this.toBeActivateAndDeactivateSet.delete(cellIndex)
      if (this.toBeActivateAndDeactivateSet.size === 0) {
        this.toBeActivateAndDeactivateSet = new Set(this.cellIndexSet)
        this.setActiveCellsArray()
      }
    },
    onChangeRows (newRows, oldRows) {
      if (newRows > oldRows) {
        for (let row = oldRows; row < newRows; row++) {
          const _row = []
          for (let col = 0; col < this.cols; col++) {
            const cell = {
              index: `${row}-${row + 1}_${col}-${col + 1}`,
              width: 100,
              height: 30
            }
            _row.push(cell)
          }
          this.table.cells.push(_row)
        }
      } else if (newRows < oldRows) {
        // 删除多余行
        for (let row = oldRows; row > newRows; row--) {
          this.table.cells.pop()
        }
        // 对index进行修正
        this.cellArray.forEach(cell => {
          const [, _rowLowerBound, _rowHigherBound, _colLowerBound, _colHigherBound] = /^(\d+)-(\d+)_(\d+)-(\d+)$/.exec(cell.index)
          if (+_rowHigherBound > newRows) {
            cell.index = `${_rowLowerBound}-${newRows}_${_colLowerBound}-${_colHigherBound}`
          }
        })
      }
    },
    onChangeCols (newCols, oldCols) {
      if (newCols > oldCols) {
        this.table.cells.forEach((row, rowIndex) => {
          for (let col = oldCols; col < newCols; col++) {
            const cell = {
              index: `${rowIndex}-${rowIndex + 1}_${col}-${col + 1}`,
              width: 100,
              height: 30
            }
            row.push(cell)
          }
        })
      } else if (newCols < oldCols) {
        // 对index进行修正
        const cellArray = [...this.cellArray].reverse()
        cellArray.forEach(cell => {
          const [, _rowLowerBound, _rowHigherBound, _colLowerBound, _colHigherBound] = /^(\d+)-(\d+)_(\d+)-(\d+)$/.exec(cell.index)
          if (+_colLowerBound >= newCols) {
            const {
              rowIndex,
              colIndex
            } = this.getCellByIndex(cell.index)
            this.table.cells[rowIndex].splice(colIndex, 1)
          }
          if (+_colHigherBound > newCols) {
            cell.index = `${_rowLowerBound}-${_rowHigherBound}_${_colLowerBound}-${newCols}`
          }
        })
      }
    },
    // 合并单元格
    onMergeCells () {
      const { length } = this.activeCellsArray
      if (length > 1) {
        // 获取边界
        const {
          rowLowerBound, rowHigherBound, colLowerBound, colHigherBound
        } = this.getBounds(this.activeCellsArray)
        const activeCells = this.table.cells.map(row => {
          return row.filter(cell => {
            const [, _rowLowerBound, _rowHigherBound, _colLowerBound, _colHigherBound] =
                /^(\d+)-(\d+)_(\d+)-(\d+)$/.exec(cell.index)
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
        // 重置处于活跃状态的单元格的数组
        this.activeCellsArray = [leftTopCell.index]
      }
    },
    // 拆分单元格
    onSplitCells () {
      const { length } = this.activeCellsArray
      if (length === 0) return
      const activeCellsArray = []
      const splitCell = (cellIndex) => {
        const leftTopCell = this.getCellByIndex(cellIndex).cell
        const [, rowLowerBound, rowHigherBound, colLowerBound, colHigherBound] =
            /^(\d+)-(\d+)_(\d+)-(\d+)$/.exec(cellIndex)
        leftTopCell.index = `${rowLowerBound}-${+rowLowerBound + 1}_${colLowerBound}-${+colLowerBound + 1}`
        for (let row = +rowLowerBound; row < +rowHigherBound; row++) {
          for (let col = +colLowerBound; col < +colHigherBound; col++) {
            activeCellsArray.push(`${row}-${row + 1}_${col}-${col + 1}`)
            if (row !== +rowLowerBound || col !== +colLowerBound) {
              const cell = {
                index: `${row}-${row + 1}_${col}-${col + 1}`,
                width: 100,
                height: 30
              }
              this.table.cells[row].push(cell)
            }
          }
          this.table.cells[row].sort((a, b) => {
            const [, colLowerBoundA] = /^\d+-\d+_(\d+)-\d+$/.exec(a.index)
            const [, colLowerBoundB] = /^\d+-\d+_(\d+)-\d+$/.exec(b.index)
            return colLowerBoundA - colLowerBoundB
          })
        }
      }
      this.activeCellsArray.forEach(cellIndex => splitCell(cellIndex))
      this.activeCellsArray = activeCellsArray
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
    getBounds (cellIndexArray) {
      let rowLowerBound, rowHigherBound, colLowerBound, colHigherBound
      cellIndexArray.forEach(cellIndex => {
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
    // 设置活跃的单元格数组
    setActiveCellsArray () {
      let {
        rowLowerBound, rowHigherBound, colLowerBound, colHigherBound
      } = this.getBounds([...this.activeCellsSetByHover])
      if (typeof rowLowerBound === 'undefined') return
      // 循环获取激活边界
      let newRowLowerBound, newRowHigherBound, newColLowerBound, newColHigherBound
      const activeCellsSet = new Set(this.activeCellsSetByHover)
      while (
        rowLowerBound !== newRowLowerBound ||
          rowHigherBound !== newRowHigherBound ||
          colLowerBound !== newColLowerBound ||
          colHigherBound !== newColHigherBound
      ) {
        rowLowerBound = newRowLowerBound || rowLowerBound
        rowHigherBound = newRowHigherBound || rowHigherBound
        colLowerBound = newColLowerBound || colLowerBound
        colHigherBound = newColHigherBound || colHigherBound
        this.cellArray.forEach(cell => {
          const [, _rowLowerBound, _rowHigherBound, _colLowerBound, _colHigherBound] = /^(\d+)-(\d+)_(\d+)-(\d+)$/.exec(cell.index)
          // 判断是否有交集
          if (
            Math.max(rowLowerBound, _rowLowerBound) < Math.min(rowHigherBound, _rowHigherBound) &&
              Math.max(colLowerBound, _colLowerBound) < Math.min(colHigherBound, _colHigherBound)
          ) {
            activeCellsSet.add(cell.index)
          } else {
            activeCellsSet.delete(cell.index)
          }
        });
        ({
          rowLowerBound: newRowLowerBound,
          rowHigherBound: newRowHigherBound,
          colLowerBound: newColLowerBound,
          colHigherBound: newColHigherBound
        } = this.getBounds(Array.from(activeCellsSet)))
      }
      this.activeCellsArray = Array.from(activeCellsSet)
    },
    // 通过index获取单元格信息
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
  .content {
    display: flex;

    .table {
      border-collapse: collapse;

      tr {
        height: 30px;
      }
    }
  }

</style>
