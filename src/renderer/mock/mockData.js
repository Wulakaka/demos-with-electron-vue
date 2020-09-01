import sourceData from './source_data'
import dictionaryTableData from './dictionary_table_data'
import templateData from './template_data'
import signData from './sign_data'
import eventData from './event_data'
const Mock = require('mockjs')
Mock.setup({
  timeout: '200-600'
})
// 源数据表名和字段名
Mock.mock('/api/dataSource', 'get', sourceData)
// 字典表名、字段名、关系名
Mock.mock('/api/getDictionaryTableData', 'get', dictionaryTableData)
// 模板信息
Mock.mock('/api/getTemplateInfo', 'post', {
  code: 200,
  success: true,
  data: {
    templateId: 1,
    startTime: '2020-06-23 09:00',
    endTime: '2020-06-23 13:00',
    pageIndex: 0,
    pageTotal: 3
  }
})

// 模板数据
Mock.mock('/api/getTemplateData', templateData)

// 获取源数据表中查出的结果
Mock.mock('/api/getValueData', {
  code: 200,
  success: true,
  data: {
    acis_ope_apply_info: {
      patient_id: '123211',
      visit_id: '01101',
      inpatient_ward: '二病区'
    }
  }
})

// 字典数据
Mock.mock('/api/getDictionaryData', 'post', {
  code: 200,
  success: true,
  data: [
    {
      value: '一病区'
    },
    {
      value: '二病区'
    },
    {
      value: '三病区'
    }
  ]
})
// 体征数据
Mock.mock('/api/getSignData', 'post', signData)
// 事件数据
Mock.mock('/api/getEventData', 'post', eventData)
