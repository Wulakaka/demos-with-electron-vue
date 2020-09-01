<template>
  <div
    class="widgetNews"
    :style="widgetStyle"
  >
    <div class="lineContent">
      <div
        v-for="(col,index) in configuration.column"
        class="col"
        :style="colStyle(index)"
        :key="index"
      />
    </div>
    <div class="newsContent">
      <div
        class="news"
        v-for="news in newsList"
        :key="news.order"
        :style="{width: colWidth}"
      >
        <div class="order">
          {{ news.order }}
        </div>
        <div>
          {{ news.startTime }}
          <span v-if="news.endTime">>{{ news.endTime }}</span>
          {{ news.name }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import io from 'socket.io-client'
import moment from 'moment'
import { getSocketData, getEventData } from '@/api/medicalDocument'
import request from '@/utils/request'
export default {
  name: 'WidgetText',
  props: {
    configuration: {
      type: Object,
      required: true
    },
    editMode: {
      type: Boolean,
      default: true
    },
    startTime: {
      type: String,
      default: ''
    },
    endTime: {
      type: String,
      default: ''
    }
  },
  watch: {
    configuration: {
      deep: true,
      handler: function (val) {
        this.setStyle()
      }
    },
    startTime: {
      handler: function (val) {
        if (val) {
          if (!this.editMode) {
            this.getData()
          }
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      widgetStyle: {},
      newsList: []
    }
  },
  computed: {
    colStyle () {
      return index => {
        return {
          width: 100 / this.configuration.column + '%',
          'border-right':
            index !== this.configuration.column - 1
              ? this.configuration.border.width +
                'px solid' +
                this.configuration.border.color
              : 'none'
        }
      }
    },
    colWidth () {
      return 100 / this.configuration.column + '%'
    }
  },
  created () {
    this.setStyle()
  },
  methods: {
    setStyle () {
      const { font, border } = this.configuration
      let widgetStyle = {
        fontSize: font.size + 'pt',
        fontWeight: font.weight,
        lineHeight: font.lineHeight + 'px',
        textAlign: font.textAlign
      }
      const borderObj = border.position.reduce((obj, item) => {
        obj['border-' + item] = border.width + 'px solid ' + border.color
        return obj
      }, {})

      widgetStyle = { ...widgetStyle, ...borderObj }
      this.widgetStyle = widgetStyle
    },
    async getData () {
      await this.getEventData()
      this.getDataFromSocketIO()
    },
    getEventData () {
      return request({
        method: 'POST',
        url: getEventData,
        data: {}
      }).then(
        res => {
          this.newsList = this.convertEventData(res.data.data)
        }
      )
    },
    convertEventData (eventData) {
      if (!Array.isArray(eventData)) {
        return []
      }
      const startMoment = +moment(this.startTime)
      const endMoment = +moment(this.endTime)
      let order = 0
      const list = eventData.reduce((arr, item) => {
        const eventArr = []
        const {
          eventCode,
          detailCode,
          detailName: name,
          drawIcon: label,
          iconColor,
          eventStartTime,
          eventEndTime
        } = item
        if (eventStartTime) {
          const eventStartMoment = +moment(eventStartTime, 'YYYY-MM-DD HH:mm:ss')
          if (eventStartMoment >= startMoment && eventStartMoment <= endMoment) {
            eventArr.push({
              eventId: eventCode + '' + detailCode,
              order: ++order,
              name,
              label,
              color: iconColor ? '#' + iconColor : 'black',
              time: eventStartTime,
              startTime: eventStartTime,
              endTime: eventEndTime
            })
          }
        }
        if (eventEndTime) {
          const eventEndMoment = +moment(eventEndTime, 'YYYY-MM-DD HH:mm:ss')
          if (eventEndMoment >= startMoment && eventEndMoment <= endMoment) {
            eventArr.push({
              eventId: eventCode + '' + detailCode,
              order: ++order,
              name,
              label,
              color: iconColor ? '#' + iconColor : 'black',
              time: eventEndTime,
              startTime: eventStartTime,
              endTime: eventEndTime
            })
          }
        }
        return arr.concat(eventArr)
      }, [])
      return list
    },
    getDataFromSocketIO () {
      if (!this.endTime) {
        return
      }
      // 与当前时间对比，如果结束时间为当前时间之前，则不需要建立连接
      if (+moment(this.endTime) < new Date()) {
        return
      }
      this.socket = io(getSocketData)
      this.socket.on('connect', () => {
        console.log('socket.io connected')
      })
      this.socket.on('disconnect', () => {
        console.log('socket.io disconnect')
      })

      // 术中事件
      this.socket.on('operation event', res => {
        this.newsList.push(res)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.widgetNews {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  .lineContent {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    .col {
      border-right: 1px solid black;
      width: 100%;
    }
    .col:last-child {
      border-right: none;
    }
  }
  .newsContent {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap:wrap;
    align-content: flex-start;
    .news {
      display: flex;
      .order {
        flex: 0 0 20px;
        text-align: center;
      }
    }
  }
}
</style>
