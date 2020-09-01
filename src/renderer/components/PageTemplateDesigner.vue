<template>
  <div class="templateDesignerPage">
    <content-widget-list />
    <content-designer />
    <content-configuration />
  </div>
</template>
<script>
import ContentWidgetList from './PageTemplateDesigner/ContentWidgetList'
import ContentDesigner from './PageTemplateDesigner/ContentDesigner'
import ContentConfiguration from './PageTemplateDesigner/ContentConfiguration'
export default {
  name: 'PageTemplateDesigner',
  components: {
    ContentWidgetList,
    ContentDesigner,
    ContentConfiguration
  }
}
</script>
<style lang="scss" scoped>
.templateDesignerPage {
  display: flex;
  height: calc(100vh - 30px);
}
</style>
