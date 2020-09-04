<template>
  <td
    ref="td"
    :colspan="colspan"
    :rowspan="rowspan"
    :height="cell.height"
    :width="cell.width"
    :style="{'border-color': cell.borderColor}"
  >
    {{ cell.index }}
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
