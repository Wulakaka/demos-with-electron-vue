<template>
  <div class="contentDisplayer">
    <div class="content">
      <widget-wrapper
        v-for="(item,index) of widgetList"
        :key="index"
        :widget="item"
      >
        <component
          :is="item.name"
          :configuration="item"
          :edit-mode="editMode"
          :start-time="startTime"
          :end-time="endTime"
        />
      </widget-wrapper>
    </div>
  </div>
</template>

<script>
import WidgetWrapper from './WidgetWrapper'
import WidgetInput from '../PageTemplateDesigner/WidgetInput'
import WidgetTextarea from '../PageTemplateDesigner/WidgetTextarea'
import WidgetText from '../PageTemplateDesigner/WidgetText'
import WidgetLine from '../PageTemplateDesigner/WidgetLine'
import WidgetPhysicalSign from '../PageTemplateDesigner/WidgetPhysicalSign'
import WidgetNews from '../PageTemplateDesigner/WidgetNews'
export default {
  name: 'ContentDisplayer',
  components: {
    WidgetWrapper,
    WidgetInput,
    WidgetTextarea,
    WidgetText,
    WidgetLine,
    WidgetPhysicalSign,
    WidgetNews
  },
  props: {
    widgetList: {
      type: Array,
      default () {
        return []
      }
    },
    startTime: {
      type: String,
      default () {
        return ''
      }
    },
    endTime: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      editMode: false
    }
  },
  computed: {

  },
  created () {
  },
  methods: {

  }
}
</script>
<style lang='scss' scoped>
.contentDisplayer {
  height: calc(100vh - 30px);
  overflow: auto;
  .content {
    position: relative;
    width: 210mm;
    height: 297mm;
  }
}
</style>
