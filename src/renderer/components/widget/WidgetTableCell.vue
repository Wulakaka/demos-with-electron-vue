<template>
  <td
    ref="td"
    :colspan="cell.colspan"
    :height="cell.height"
    :rowspan="cell.rowspan"
    :width="cell.width"
    :class="{active: active}"
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
    },
    activeCells: {
      required: true,
      type: Array
    },
    range: {
      required: true,
      type: Object
    }
  },
  computed: {
    active () {
      if (Object.hasOwnProperty.call(this.range, 'x') && Object.hasOwnProperty.call(this.range, 'y')) {
        console.log(this.$refs.td.offsetWidth)
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
  td {
  border: {
    width: 1px;
    color: #4fc08d;
    style: solid;
  }

  &.active {
     background: rgba(79, 192, 141, 0.3);
    /*outline: {*/
    /*  color: rgba(79, 192, 141, 1);*/
    /*  width: 3px;*/
    /*  style: solid;*/
    /*}*/
   }
  }
</style>
