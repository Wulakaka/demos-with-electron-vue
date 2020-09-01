const mock = process.env.NODE_ENV === 'development' ? !(process.env.MOCK === 'none') : false

const base = 'http://192.168.1.154:8090/'
// const base = 'http://localhost:8090/'
export const getSocketData = 'http://192.168.1.149:9099'
// export const getSocketData = 'http://192.168.1.154:9099/'
export const dataSource = mock ? '/api/dataSource' : base + 'acis/dataSource/queryDataSource'
export const getDictionaryTableData = mock ? '/api/getDictionaryTableData' : base + 'acis/common/templateDataSource/showTemplateDataSource'
export const getTemplateInfo = mock ? '/api/getTemplateInfo' : base + ''
export const getTemplateData = mock ? '/api/getTemplateData' : base + 'acis/dataSourceDict/queryDataSourceDict'
export const getValueData = mock ? '/api/getValueData' : ''
export const getDictionaryData = mock ? '/api/getDictionaryData' : ''
export const getSignData = mock ? '/api/getSignData' : ''
export const getEventData = mock ? '/api/getEventData' : ''
