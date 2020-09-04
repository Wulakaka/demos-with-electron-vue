<template>
  <div
    class="widgetTable"
  >
    <table
      class="table"
      ref="table"
      :style="widgetStyle"
    >
      <tr
        v-for="(col, rolIndex) of configuration.cells"
        :key="rolIndex"
      >
        <td
          is="WidgetTableCell"
          v-for="(cell, rowIndex) of col"
          :key="rowIndex"
          :cell="cell"
        />
      </tr>
    </table>
  </div>
</template>

<script>
import WidgetTableCell from './WidgetTableCell'
export default {
  name: 'WidgetTable',
  components: {
    WidgetTableCell
  },
  props: {
    configuration: {
      type: Object,
      required: true
    },
    editMode: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    configuration: {
      deep: true,
      handler: function (val) {
        this.setStyle()
      }
    },
    editMode: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      widgetStyle: {}
    }
  },
  created () {
    this.setStyle()
  },
  methods: {
    setStyle () {
      const { font, border } = this.configuration
      let styleObj = {
        fontSize: font.size + 'pt',
        fontWeight: font.weight,
        lineHeight: font.lineHeight + 'px',
        textAlign: font.textAlign
      }
      const borderObj = border.position.reduce((obj, item) => {
        obj['border-' + item] = border.width + 'px solid ' + border.color
        return obj
      }, {})

      styleObj = { ...styleObj, ...borderObj }
      this.widgetStyle = styleObj
    }
  }
}

</script>
<style lang='scss' scoped>
.widgetTable {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .table {
    border-collapse: collapse;
    tr {
      min-height: 30px;
    }
  }
}
</style>
