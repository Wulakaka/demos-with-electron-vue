<template>
  <div>
    <el-form-item label="文本内容">
      <el-input
        :value="value"
        type="textarea"
        controls-position="right"
        placeholder="请输入占位内容"
        @input="onChangeText"
      />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'ConfigurationText',
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
        text: currentValue
      })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
