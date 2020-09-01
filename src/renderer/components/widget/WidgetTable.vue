<template>
  <div>
    <table
      class="table"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
    >
      <tr
        v-for="(col, rolIndex) in table.cells"
        :key="rolIndex"
      >
        <td
          is="WidgetTableCell"
          v-for="(cell, rowIndex) in col"
          :key="rowIndex"
          :cell="cell"
          :active-cells="activeCells"
          :range="range"
        />
      </tr>
    </table>
    {{ range }}
  </div>
</template>
<script>
import WidgetTableCell from './WidgetTableCell'
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
      activeCells: ['1-1', '2-1'],
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
    this.table.cells = this.generateCells(5, 3)
  },
  methods: {
    generateCells (rows, cols) {
      const cells = []
      for (let row = 0; row < rows; row++) {
        const _row = []
        for (let col = 0; col < cols; col++) {
          _row.push({
            index: `${row}-${col}`,
            width: 100,
            height: 30,
            colspan: 1,
            rowspan: 1
          })
        }
        cells.push(_row)
      }
      return cells
    },
    onMouseDown (e) {
      this.startPosition = {
        x: e.clientX,
        y: e.clientY
      }
    },
    onMouseUp (e) {
      console.log(e)
      this.endPosition = {
        x: e.clientX,
        y: e.clientY
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .table {
    border-collapse: collapse;
  }

</style>
