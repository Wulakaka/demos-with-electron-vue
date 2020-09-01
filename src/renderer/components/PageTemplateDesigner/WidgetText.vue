<template>
  <div
    class="widgetText"
    :style="widgetStyle"
  >
    {{ configuration.text }}
  </div>
</template>
<script>
export default {
  name: 'WidgetText',
  props: {
    configuration: {
      type: Object,
      required: true
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
<style lang="scss" scoped>
.widgetText {
  width: 100%;
  height: 100%;
  word-break: break-all;
  overflow: hidden;
}
</style>
