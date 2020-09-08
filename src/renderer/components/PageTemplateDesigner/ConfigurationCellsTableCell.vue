<template>
  <td
    ref="td"
    :colspan="colspan"
    :rowspan="rowspan"
    :height="cell.height"
    :width="cell.width"
    :class="{active: active}"
    :style="style"
  >
    <input
      ref="input"
      v-show="editable"
      v-model="cell.text"
    >
    <span v-show="!editable">
      {{ cell.text }}
    </span>
  </td>
</template>

<script>
export default {
  name: 'ConfigrationCellsTableCell',
  props: {
    cell: {
      required: true,
      type: Object
    },
    activeCellsArray: {
      required: true,
      type: Array
    },
    range: {
      required: true,
      type: Object
    },
    editable: {
      required: true,
      type: Boolean
    }
  },
  computed: {
    colspan () {
      const col = this.cell.index.split('_')[1]
      return col.split('-')[1] - col.split('-')[0]
    },
    rowspan () {
      const row = this.cell.index.split('_')[0]
      return row.split('-')[1] - row.split('-')[0]
    },
    active () {
      return this.activeCellsArray.includes(this.cell.index)
    },
    style () {
      const style = {}
      if (this.cell.borderColor) style['border-color'] = this.cell.borderColor
      if (this.cell.color) style.color = this.cell.color
      if (this.cell.textAlign) style['text-align'] = this.cell.textAlign
      if (this.cell.textIndent) style['text-indent'] = `${this.cell.textIndent}px`
      if (this.cell.fontSize) style['font-size'] = `${this.cell.fontSize}px`
      if (this.cell.fontWeight) style['font-weight'] = this.cell.fontWeight
      return style
    }
  },
  watch: {
    range: function (range) {
      if (Object.hasOwnProperty.call(range, 'x') &&
        Object.hasOwnProperty.call(range, 'y')
      ) {
        const { offsetLeft, offsetWidth, offsetTop, offsetHeight } = this.$refs.td
        const position = {
          x: [offsetLeft, offsetLeft + offsetWidth],
          y: [offsetTop, offsetTop + offsetHeight]
        }
        if ((Math.max(this.range.x[0], position.x[0]) <= Math.min(this.range.x[1], position.x[1])) &&
          (Math.max(this.range.y[0], position.y[0]) <= Math.min(this.range.y[1], position.y[1]))
        ) {
          this.$emit('activate', this.cell.index)
          return
        }
      }
      this.$emit('deactivate', this.cell.index)
    }
  }
}
</script>

<style lang="scss" scoped>
  td {
    user-select: none;
    border: {
      width: 1px;
      style: solid;
    }

    &.active {
      background: rgba(173, 173, 173, 0.3);
    }

    input {
      width: 100%;
      height: 100%;
    }
  }
</style>
