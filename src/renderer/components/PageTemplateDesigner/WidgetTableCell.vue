<template>
  <td
    ref="td"
    :colspan="colspan"
    :rowspan="rowspan"
    :style="style"
  >
    {{ cell.text }}
  </td>
</template>

<script>
export default {
  name: 'WidgetTableCell',
  props: {
    cell: {
      required: true,
      type: Object
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
    style () {
      const style = {}
      if (this.cell.width) style.width = `${this.cell.width}px`
      if (this.cell.height) style.height = `${this.cell.height}px`
      if (this.cell.borderColor) style['border-color'] = this.cell.borderColor
      if (this.cell.color) style.color = this.cell.color
      if (this.cell.textAlign) style['text-align'] = this.cell.textAlign
      if (this.cell.textIndent) style['text-indent'] = `${this.cell.textIndent}px`
      if (this.cell.fontSize) style['font-size'] = `${this.cell.fontSize}px`
      if (this.cell.fontWeight) style['font-weight'] = this.cell.fontWeight
      return style
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

  }
</style>
