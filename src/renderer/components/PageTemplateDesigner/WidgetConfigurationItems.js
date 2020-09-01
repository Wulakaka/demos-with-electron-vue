export default function getConfigurationItems (widgetName) {
  const border = {
    position: ['top', 'right', 'bottom', 'left'],
    color: '#000000',
    width: 1
  }
  const font = {
    size: 9,
    weight: 'normal',
    lineHeight: 30,
    textAlign: 'left'
  }
  // 源数据
  const dataSource = {
    tableName: '',
    className: ''
  }
  // 字典
  const dictionarySource = {
    dictTableName: '',
    conditionClassNameId: '',
    dictClassName: '',
    dictRelationName: ''
  }
  switch (widgetName) {
    case 'widget-physical-sign':
      return {
        border,
        leftPartWidthRate: 0.18,
        rightPartWidthRate: 0.1,
        leftTitle: {
          text: '左标题',
          width: 50,
          lineHeight: 30
        },
        timeTitle: {
          text: '时间',
          height: 30,
          lineHeight: 30
        },
        eventTitle: {
          text: '事件标题',
          height: 40,
          lineHeight: 40
        },
        totalTitle: {
          text: '图例'
        },
        yAxis: {
          list: [
            {
              label: 'Y轴1',
              index: 0,
              values: [
                {
                  value: 0,
                  label: '℃'
                },
                {
                  value: 10,
                  label: 10
                },
                {
                  value: 20,
                  label: '到顶啦'
                }
              ]
            }
          ],
          lineInterval: 2
        },
        xAxis: {
          startTime: '2018-01-01 08:00',
          endTime: '2018-01-01 12:00',
          timeInterval: 15,
          lineInterval: 3
        }
      }
    case 'widget-news':
      return {
        font,
        border,
        column: 3
      }
    case 'widget-input':
      return {
        font,
        border,
        placeholder: '占位内容',
        readonly: false,
        dataSource,
        multiSelect: false,
        dictionarySource
      }
    case 'widget-textarea':
      return {
        font,
        border,
        placeholder: '占位内容',
        dataSource
      }
    case 'widget-text':
      return {
        font,
        border,
        text: '文本内容'
      }
    case 'widget-line':
      return {
        direction: 'horizontal'
      }
    default:
      return {}
  }
}

const configurationItems = {
  layout: ['width', 'height'],
  position: ['positionX', 'positionY'],
  data: ['dataSource', 'dictionarySource']
}

const configurationMap = {}
let parent
for (parent in configurationItems) {
  configurationItems[parent].forEach(item => {
    configurationMap[item] = {
      parent
    }
  })
}

export {
  configurationMap
}
