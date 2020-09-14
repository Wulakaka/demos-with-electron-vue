<template>
  <div>
    <el-form-item label="合计标题文字">
      <el-input
        :value="value.text"
        controls-position="right"
        placeholder="请输入合计标题"
        @input="onChangeText"
      />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'ConfigurationTotalTitle',
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
  methods: {
    onChangeText (currentValue, oldValue) {
      const configuration = Object.assign({}, this.value, {
        text: currentValue
      })
      this.$emit('change', {
        totalTitle: configuration
      })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
