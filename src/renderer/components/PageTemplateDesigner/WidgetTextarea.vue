<template>
  <div
    class="widgetTextArea"
  >
    <textarea
      class="textarea"
      :style="widgetStyle"
      v-model="configuration.value"
      :placeholder="configuration.placeholder"
    />
  </div>
</template>
<script>
export default {
  name: 'WidgetTextarea',
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
.widgetTextArea {
  width: 100%;
  height: 100%;
  .textarea {
    width: 100%;
    height: 100%;
    background: transparent;
    outline: none;
    border: none;
  }
}
</style>
