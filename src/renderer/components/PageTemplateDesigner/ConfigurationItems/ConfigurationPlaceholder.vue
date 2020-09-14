<template>
  <div>
    <el-form-item label="占位内容">
      <el-input
        :value="value"
        controls-position="right"
        placeholder="请输入占位内容"
        @input="onChangeText"
      />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'ConfigurationPlaceholder',
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
  methods: {
    onChangeText (currentValue, oldValue) {
      this.$emit('change', {
        placeholder: currentValue
      })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
