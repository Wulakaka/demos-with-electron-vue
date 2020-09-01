<template>
  <div
    class="widgetLine"
    :style="widgetStyle"
  >
    <div
      class="line"
      :style="lineStyle"
    />
  </div>
</template>
<script>
export default {
  name: 'WidgetLine',
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
      widgetStyle: {},
      lineStyle: {}
    }
  },
  created () {
    this.setStyle()
  },
  methods: {
    setStyle () {
      if (this.configuration.direction === 'horizontal') {
        this.widgetStyle = {
          'flex-direction': 'column'
        }
        this.lineStyle = {
          height: '1px',
          width: '100%'
        }
      } else {
        this.widgetStyle = {
          'flex-direction': 'row'
        }
        this.lineStyle = {
          height: '100%',
          width: '1px'
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.widgetLine {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .line {
    width: 100%;
    height: 1px;
    background: black;
  }
}
</style>
