<template>
  <div
    class="widgetWrapper"
    :style="style"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'WidgetWrapper',
  props: {
    widget: {
      type: Object,
      required: true
    }
  },
  computed: {
    style () {
      return {
        left: this.widget.positionX + 'px',
        top: this.widget.positionY + 'px',
        width: this.widget.width + 'px',
        height: this.widget.height + 'px'
      }
    }
  }
}

</script>
<style lang='scss' scoped>
.widgetWrapper {
position: absolute;
  background: transparent;
}
</style>
