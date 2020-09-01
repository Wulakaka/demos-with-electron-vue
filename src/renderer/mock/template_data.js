export default {
  code: 200,
  success: true,
  data: [
    {
      border: {
        color: '#000000',
        position: [
          'top',
          'right',
          'bottom',
          'left'
        ],
        width: 1
      },
      dataSource: {
        className: 'patient_id',
        tableName: 'acis_ope_apply_info'
      },
      dictionarySource: {
        dictClassName: '',
        dictTableName: ''
      },
      font: {
        lineHeight: 30,
        size: 9,
        textAlign: 'left',
        weight: 'normal'
      },
      height: 30,
      id: 'e871bcfa-cac1-4a4f-b67c-d66ad6432a73',
      multiSelect: false,
      name: 'widget-input',
      placeholder: '占位内容',
      positionX: 0,
      positionY: 25,
      readonly: false,
      width: 100
    },
    {
      border: {
        color: '#000000',
        position: [
          'top',
          'right',
          'bottom',
          'left'
        ],
        width: 1
      },
      dataSource: {
        className: 'inpatient_ward',
        tableName: 'acis_ope_apply_info'
      },
      dictionarySource: {
        dictClassName: 'patient_id',
        dictTableName: 'acis_ope_apply_info'
      },
      font: {
        lineHeight: 30,
        size: 9,
        textAlign: 'left',
        weight: 'normal'
      },
      height: 30,
      id: 'bb7f8408-da1b-4e98-9aa0-cfa7ab42e163',
      multiSelect: false,
      name: 'widget-input',
      placeholder: '占位内容',
      positionX: 200,
      positionY: 25,
      readonly: false,
      width: 100
    },
    {
      border: {
        color: '#000000',
        position: [
          'top',
          'right',
          'bottom',
          'left'
        ],
        width: 1
      },
      eventTitle: {
        height: 40,
        lineHeight: 40,
        text: '事件标题'
      },
      height: 291,
      id: '7b82328b-2b05-4450-aa1b-e54c5be3c06e',
      leftPartWidthRate: 0.18,
      leftTitle: {
        lineHeight: 30,
        text: '左标题',
        width: 50
      },
      name: 'widget-physical-sign',
      positionX: 0,
      positionY: 116,
      rightPartWidthRate: 0.1,
      timeTitle: {
        height: 30,
        lineHeight: 30,
        text: '时间'
      },
      totalTitle: {
        text: '图例'
      },
      width: 792,
      xAxis: {
        endTime: '2018-01-01 12:00',
        lineInterval: 3,
        startTime: '2018-01-01 08:00',
        timeInterval: 15
      },
      yAxis: {
        lineInterval: 2,
        list: [
          {
            index: 0,
            label: 'Y轴1',
            values: [
              {
                label: '℃',
                value: 20
              },
              {
                label: 30,
                value: 30
              },
              {
                label: '到顶啦',
                value: 40
              }
            ]
          },
          {
            index: '1',
            label: 'Y坐标轴',
            values: [
              {
                label: '0',
                value: 0
              },
              {
                label: '200',
                value: '200'
              },
              {
                label: '400',
                value: '400'
              }
            ]
          }
        ]
      }
    },
    {
      border: {
        color: '#000000',
        position: [
          'top',
          'right',
          'bottom',
          'left'
        ],
        width: 1
      },
      column: 4,
      font: {
        lineHeight: 30,
        size: 9,
        textAlign: 'left',
        weight: 'normal'
      },
      height: 379,
      id: 'fc54b3cf-923f-4425-b88c-540c9a3f3ead',
      name: 'widget-news',
      positionX: 0,
      positionY: 406,
      width: 792
    }
  ]
}
