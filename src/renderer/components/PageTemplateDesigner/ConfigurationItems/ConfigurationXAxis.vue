<template>
  <div>
    <el-form-item label="开始时间">
      <el-time-select
        placeholder="起始时间"
        v-model="startTime"
        :picker-options="{
          start: '08:00',
          step: '00:15',
          end: '20:00'
        }"
      />
    </el-form-item>
    <el-form-item label="开始时间">
      <el-time-select
        placeholder="结束时间"
        v-model="endTime"
        :picker-options="{
          start: '08:30',
          step: '00:15',
          end: '24:00',
          minTime: startTime
        }"
      />
    </el-form-item>
    <el-form-item label="主线时间间隔">
      <el-input-number
        :value="value.timeInterval"
        :min="0"
        controls-position="right"
        @change="onChangeTimeInterval"
      />
    </el-form-item>
    <el-form-item label="纵线分隔">
      <el-input-number
        :value="value.lineInterval"
        :min="0"
        controls-position="right"
        @change="onChangeLineInterval"
      />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'ConfigurationXAxis',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      // startTime: '',
      // endTime: ''
    }
  },
  computed: {
    startTime: {
      get: function () {
        return this.value.startTime.split(' ')[1]
      },
      set: function (currentValue) {
        const configuration = Object.assign({}, this.value, {
          startTime: '2018-01-01 ' + currentValue
        })
        this.$emit('change', {
          xAxis: configuration
        })
      }
    },
    endTime: {
      get: function () {
        return this.value.endTime.split(' ')[1]
      },
      set: function (currentValue) {
        const configuration = Object.assign({}, this.value, {
          endTime: '2018-01-01 ' + currentValue
        })
        this.$emit('change', {
          xAxis: configuration
        })
      }
    }
  },
  methods: {
    onChangeTimeInterval (currentValue, oldValue) {
      const configuration = Object.assign({}, this.value, {
        timeInterval: currentValue
      })
      this.$emit('change', {
        xAxis: configuration
      })
    },
    onChangeLineInterval (currentValue, oldValue) {
      const configuration = Object.assign({}, this.value, {
        lineInterval: currentValue
      })
      this.$emit('change', {
        xAxis: configuration
      })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
