<template>
  <div
    class="widgetCopiable"
    draggable="true"
    @dragstart="onDragStart"
    ref="widgetCopiable"
  >
    {{ widget.label }}
  </div>
</template>
<script>
import { v4 as uuidv4 } from 'uuid'
export default {
  name: 'WidgetCopiable',
  props: {
    widget: {
      required: true,
      type: Object
    }
  },
  data () {
    return {}
  },
  methods: {
    onDragStart (e) {
      // 设置拖动数据类型
      e.dataTransfer.setData('text/html', e.target.outerHTML)
      e.dataTransfer.setData('text/plain', JSON.stringify({
        id: uuidv4(),
        name: this.widget.name,
        offsetX: e.offsetX,
        offsetY: e.offsetY,
        width: this.$refs.widgetCopiable.clientWidth,
        height: this.$refs.widgetCopiable.clientHeight,
        type: 'copy'
      }))
      // 定义拖动效果
      e.dataTransfer.dropEffect = 'copy'
    }
  },
  mounted () {}
}
</script>
<style lang="scss" scoped>
.widgetCopiable {
  width: 100px;
  height: 30px;
  background: #f9f9f9;
  line-height: 30px;
  margin:5px 10px;
  text-align: center;
  border-radius: 4px;
  color: #333;
}
</style>
