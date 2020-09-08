<template>
  <div>
    <el-form-item label="单元格配置">
      <el-button @click="onConfigure">
        配置
      </el-button>
    </el-form-item>
    <el-dialog
      title="单元格配置"
      :visible.sync="dialogVisible"
      fullscreen
      destroy-on-close
    >
      <div class="dialogContent">
        <div class="tableContent">
          <table
            class="table"
            @mousedown.capture="onMouseDown"
            ref="table"
          >
            <tr
              v-for="(col, rolIndex) of cells"
              :key="rolIndex"
            >
              <td
                is="ConfigurationCellsTableCell"
                v-for="(cell, rowIndex) of col"
                :key="rowIndex"
                :cell="cell"
                :range="range"
                :active-cells-array="activeCellsArray"
                :editable="editable"
                @activate="onActivate"
                @deactivate="onDeactivate"
                @change-text="(text) => cell.text = text"
              />
            </tr>
          </table>
          {{ cellActiveConfiguration }}
        </div>
        <div class="configurationContent">
          <configuration-cells-form
            :rows="rows"
            :cols="cols"
            :cell-active-configuration="cellActiveConfiguration"
            :editable="editable"
            @merge-cells="onMergeCells"
            @split-cells="onSplitCells"
            @change-rows="onChangeRows"
            @change-cols="onChangeCols"
            @change-cell="onChangeCell"
            @switch-editable="onSwitchEditable"
          />
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="onConfirm"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ConfigurationCellsTableCell from './ConfigurationCellsTableCell'
import ConfigurationCellsForm from './ConfigurationCellsForm'
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'
import { Cell } from '@/model/WidgetTable'
export default {
  name: 'ConfigurationCells',
  components: {
    ConfigurationCellsTableCell,
    ConfigurationCellsForm
  },
  data () {
    return {
      dialogVisible: false,
      // 辅助变量
      cells: [],
      rows: 1,
      cols: 1,
      // 存储与鼠标范围有交集的单元格
      activeCellsSetByHover: new Set(),
      // 存储最终被选中的单元格
      activeCellsArray: [],
      // 鼠标框选范围开始位置
      startPosition: null,
      // 鼠标框选范围结束位置
      endPosition: null,
      // 是否开启编辑
      editable: false
    }
  },
  props: {
    value: {
      type: Array,
      required: true
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
      return this.cells.reduce((acc, row) => [...acc, ...row], [])
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
    },
    // 辅助变量 - 存储所有激活状态单元格
    cellArrayActive () {
      return this.cellArray.filter((cell) =>
        this.activeCellsArray.includes(cell.index)
      )
    },
    // 可以批量修改的配置项
    cellActiveConfiguration () {
      const configurationNames = [
        'width',
        'height',
        'borderColor',
        'color',
        'text',
        'textAlign',
        'textIndent',
        'fontSize',
        'fontWeight',
        'tableName',
        'className'
      ]
      const configurationMap = configurationNames.reduce((acc, name) => {
        acc[name] = new Set()
        return acc
      }, {})

      this.cellArrayActive.forEach((cell) => {
        configurationNames.forEach((name) => {
          configurationMap[name].add(cell[name])
        })
      })

      for (const name in configurationMap) {
        configurationMap[name] = [...configurationMap[name]]
      }
      return configurationMap
    }
  },
  created () {
    this.cells = cloneDeep(this.value)
    const {
      rowLowerBound,
      rowHigherBound,
      colLowerBound,
      colHigherBound
    } = this.getBounds([...this.cellIndexSet])
    this.rows = rowHigherBound - rowLowerBound
    this.cols = colHigherBound - colLowerBound
  },
  methods: {
    onConfigure () {
      this.dialogVisible = true
    },
    onMouseDown (e) {
      // 重置处于活跃状态的单元格的数组
      this.activeCellsArray = []
      this.activeCellsSetByHover.clear()
      // 重置起始位置
      this.startPosition = this.getTableOffset(e)
      // 清空结束位置
      this.endPosition = null

      const mouseMoveHandler = debounce(e => {
        if (e.path.includes(this.$refs.table)) {
          this.endPosition = this.getTableOffset(e)
        }
      }, 10)
      const mouseUpHandler = e => {
        mouseMoveHandler(e)
        window.removeEventListener('mousemove', mouseMoveHandler)
        window.removeEventListener('mouseup', mouseUpHandler)
      }
      // 增加监听
      window.addEventListener('mousemove', mouseMoveHandler)
      window.addEventListener('mouseup', mouseUpHandler)
      // 存储一个保存所有索引的set，用于判断是否所有状态已经更新
      this.toBeActivateAndDeactivateSet = new Set(this.cellIndexSet)
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
    // 修改行数
    onChangeRows ({ newRows, oldRows }) {
      this.rows = newRows
      if (newRows > oldRows) {
        for (let row = oldRows; row < newRows; row++) {
          const _row = []
          for (let col = 0; col < this.cols; col++) {
            const cell = new Cell(`${row}-${row + 1}_${col}-${col + 1}`)
            _row.push(cell)
          }
          this.cells.push(_row)
        }
      } else if (newRows < oldRows) {
        // 删除多余行
        for (let row = oldRows; row > newRows; row--) {
          this.cells.pop()
        }
        // 对index进行修正
        this.cellArray.forEach((cell) => {
          const [
            ,
            _rowLowerBound,
            _rowHigherBound,
            _colLowerBound,
            _colHigherBound
          ] = /^(\d+)-(\d+)_(\d+)-(\d+)$/.exec(cell.index)
          if (+_rowHigherBound > newRows) {
            cell.index = `${_rowLowerBound}-${newRows}_${_colLowerBound}-${_colHigherBound}`
          }
        })
      }
    },
    // 修改列数
    onChangeCols ({ newCols, oldCols }) {
      this.cols = newCols
      if (newCols > oldCols) {
        this.cells.forEach((row, rowIndex) => {
          for (let col = oldCols; col < newCols; col++) {
            const cell = new Cell(
              `${rowIndex}-${rowIndex + 1}_${col}-${col + 1}`
            )
            row.push(cell)
          }
        })
      } else if (newCols < oldCols) {
        // 对index进行修正
        const cellArray = [...this.cellArray].reverse()
        cellArray.forEach((cell) => {
          const [
            ,
            _rowLowerBound,
            _rowHigherBound,
            _colLowerBound,
            _colHigherBound
          ] = /^(\d+)-(\d+)_(\d+)-(\d+)$/.exec(cell.index)
          if (+_colLowerBound >= newCols) {
            const { rowIndex, colIndex } = this.getCellByIndex(cell.index)
            this.cells[rowIndex].splice(colIndex, 1)
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
          rowLowerBound,
          rowHigherBound,
          colLowerBound,
          colHigherBound
        } = this.getBounds(this.activeCellsArray)
        const activeCells = this.cells
          .map((row) => {
            return row.filter((cell) => {
              const [
                ,
                _rowLowerBound,
                _rowHigherBound,
                _colLowerBound,
                _colHigherBound
              ] = /^(\d+)-(\d+)_(\d+)-(\d+)$/.exec(cell.index)
              return (
                rowLowerBound <= _rowLowerBound &&
                rowHigherBound >= _rowHigherBound &&
                colLowerBound <= _colLowerBound &&
                colHigherBound >= _colHigherBound
              )
            })
          })
          .reduce((acc, row) => {
            return [...acc, ...row]
          }, [])
        // 修改第一个单元格的index
        const leftTopCell = activeCells.shift()
        leftTopCell.index = `${rowLowerBound}-${rowHigherBound}_${colLowerBound}-${colHigherBound}`
        // 删除原始数据 需要从后往前删
        activeCells.reverse()
        activeCells.forEach((cell) => {
          const { rowIndex, colIndex } = this.getCellByIndex(cell.index)
          this.cells[rowIndex].splice(colIndex, 1)
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
        const [
          ,
          rowLowerBound,
          rowHigherBound,
          colLowerBound,
          colHigherBound
        ] = /^(\d+)-(\d+)_(\d+)-(\d+)$/.exec(cellIndex)
        leftTopCell.index = `${rowLowerBound}-${
          +rowLowerBound + 1
        }_${colLowerBound}-${+colLowerBound + 1}`
        for (let row = +rowLowerBound; row < +rowHigherBound; row++) {
          for (let col = +colLowerBound; col < +colHigherBound; col++) {
            activeCellsArray.push(`${row}-${row + 1}_${col}-${col + 1}`)
            if (row !== +rowLowerBound || col !== +colLowerBound) {
              const cell = new Cell(`${row}-${row + 1}_${col}-${col + 1}`)
              this.cells[row].push(cell)
            }
          }
          this.cells[row].sort((a, b) => {
            const [, colLowerBoundA] = /^\d+-\d+_(\d+)-\d+$/.exec(a.index)
            const [, colLowerBoundB] = /^\d+-\d+_(\d+)-\d+$/.exec(b.index)
            return colLowerBoundA - colLowerBoundB
          })
        }
      }
      this.activeCellsArray.forEach((cellIndex) => splitCell(cellIndex))
      this.activeCellsArray = activeCellsArray
    },
    // 单元格配置修改
    onChangeCell (name, val) {
      this.cellArrayActive.forEach((cell) => {
        cell[name] = val
      })
    },
    // 可编辑模式切换
    onSwitchEditable () {
      this.editable = !this.editable
      this.startPosition = null
      this.endPosition = null
      // 默认选中第一个
      if (this.editable) {
        this.$nextTick(() => {
          const input = this.$refs.table.querySelector('input')
          if (input) {
            input.focus()
            input.select()
          }
        })
      }
    },
    // 确定
    onConfirm () {
      this.$emit('change', {
        cells: this.cells
      })
      this.dialogVisible = false
    },
    // 获取以table为基准的相对位置
    getTableOffset (e) {
      const offset = {
        x: e.offsetX,
        y: e.offsetY
      }
      let target = e.target
      while (target !== this.$refs.table) {
        offset.x += target.offsetLeft || 0
        offset.y += target.offsetTop || 0
        target = target.offsetParent
      }
      return offset
    },
    // 获取边界
    getBounds (cellIndexArray) {
      let rowLowerBound, rowHigherBound, colLowerBound, colHigherBound
      cellIndexArray.forEach((cellIndex) => {
        const [
          ,
          _rowLowerBound,
          _rowHigherBound,
          _colLowerBound,
          _colHigherBound
        ] = /^(\d+)-(\d+)_(\d+)-(\d+)$/.exec(cellIndex)
        rowLowerBound =
          typeof rowLowerBound === 'undefined'
            ? _rowLowerBound
            : Math.min(rowLowerBound, _rowLowerBound)
        rowHigherBound =
          typeof rowHigherBound === 'undefined'
            ? _rowHigherBound
            : Math.max(rowHigherBound, _rowHigherBound)
        colLowerBound =
          typeof colLowerBound === 'undefined'
            ? _colLowerBound
            : Math.min(colLowerBound, _colLowerBound)
        colHigherBound =
          typeof colHigherBound === 'undefined'
            ? _colHigherBound
            : Math.max(colHigherBound, _colHigherBound)
      })
      return {
        rowLowerBound,
        rowHigherBound,
        colLowerBound,
        colHigherBound
      }
    },
    // 设置活跃的单元格数组
    setActiveCellsArray () {
      let {
        rowLowerBound,
        rowHigherBound,
        colLowerBound,
        colHigherBound
      } = this.getBounds([...this.activeCellsSetByHover])
      if (typeof rowLowerBound === 'undefined') return
      // 循环获取激活边界
      let newRowLowerBound,
        newRowHigherBound,
        newColLowerBound,
        newColHigherBound
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
        this.cellArray.forEach((cell) => {
          const [
            ,
            _rowLowerBound,
            _rowHigherBound,
            _colLowerBound,
            _colHigherBound
          ] = /^(\d+)-(\d+)_(\d+)-(\d+)$/.exec(cell.index)
          // 判断是否有交集
          if (
            Math.max(rowLowerBound, _rowLowerBound) <
              Math.min(rowHigherBound, _rowHigherBound) &&
            Math.max(colLowerBound, _colLowerBound) <
              Math.min(colHigherBound, _colHigherBound)
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
      const cell = this.cells[rowIndex].find((cell) => cell.index === index)
      const colIndex = this.cells[rowIndex].findIndex(
        (cell) => cell.index === index
      )
      return {
        cell,
        rowIndex,
        colIndex
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.dialogContent {
  display: flex;
  height: 80vh;
  .tableContent {
    flex: 1 1 auto;
    .table {
      border-collapse: collapse;
      margin: auto;
    }
  }

  .configurationContent {
    flex: 0 0 200px;
    border-left: gainsboro 1px solid;
  }
}
</style>
