<template>
  <div class="templateDesignerPage">
    <content-displayer
      :widget-list="widgetList"
      :start-time="startTime"
      :end-time="endTime"
    />
    <div>
      <el-button
        type="primary"
        @click="showList"
      >
        保存
      </el-button>
    </div>
  </div>
</template>
<script>
import {
  getTemplateInfo,
  getTemplateData,
  getValueData
} from '@/api/medicalDocument'
import request from '@/utils/request'
import ContentDisplayer from './PageTemplateDisplayer/ContentDisplayer'
export default {
  name: 'PageTemplateDesigner',
  components: {
    ContentDisplayer
  },
  data () {
    return {
      widgetList: [],
      startTime: '',
      endTime: ''
    }
  },
  async created () {
    const templateInfo = await this.getTemplateInfo()
    this.getTemplateAndValueData(templateInfo)
    setTimeout(() => {
      this.startTime = '2020-06-23 09:10'
    }, 3000)
  },
  // mounted () {
  //   this.$electron.ipcRenderer.send('show-window')
  // },
  methods: {
    getTemplateAndValueData ({ templateId, startTime, endTime }) {
      return Promise.all([
        request({
          url: getTemplateData,
          method: 'POST',
          data: {
            templateId
          }
        }),
        request({
          url: getValueData,
          method: 'POST',
          data: {
            templateId
          }
        })
      ]).then(res => {
        const [widgetList, valueMap] = [res[0].data.data, res[1].data.data]
        widgetList.forEach(widget => {
          // 源数据赋值
          if (widget.dataSource) {
            const { tableName, className } = widget.dataSource
            let value
            if (valueMap[tableName] && valueMap[tableName][className]) {
              value = valueMap[tableName][className]
            }
            if (value) {
              widget.value = value
            }
          }
          // x轴起止时间更改
          if (widget.xAxis) {
            widget.xAxis.startTime = startTime
            widget.xAxis.endTime = endTime
          }
        })
        this.widgetList = widgetList
      })
    },
    getTemplateInfo () {
      return request({
        method: 'POST',
        url: getTemplateInfo,
        data: {}
      }).then(
        res => {
          this.startTime = res.data.data.startTime
          this.endTime = res.data.data.endTime
          return res.data.data
        }
      )
    },
    showList () {
      console.log(JSON.stringify(this.widgetList))
    }
  }
}
</script>
<style lang="scss" scoped>
.templateDesignerPage {
  display: flex;
}
</style>
