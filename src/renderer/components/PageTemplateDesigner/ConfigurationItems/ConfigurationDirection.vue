<template>
  <div>
    <el-form-item label="方向">
      <el-select
        :value="value"
        placeholder="请选择"
        @change="onChangeDirection"
      >
        <el-option
          v-for="item in directionOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'ConfigurationDirection',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      directionOptions: [{
        value: 'horizontal',
        label: '横'
      }, {
        value: 'vertical',
        label: '竖'
      }]
    }
  },
  methods: {
    onChangeDirection (currentValue, oldValue) {
      this.$emit('change', {
        direction: currentValue
      })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
