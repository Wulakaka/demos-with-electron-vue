<template>
  <div>
    <el-form-item label="底标题文字">
      <el-input
        :value="value.text"
        controls-position="right"
        placeholder="请输入底标题"
        @input="onChangeText"
      />
    </el-form-item>
    <el-form-item label="底标题高">
      <el-input-number
        :value="value.height"
        :min="0"
        controls-position="right"
        @change="onChangeHeight"
      />
    </el-form-item>
    <el-form-item label="底标题行高">
      <el-input-number
        :value="value.lineHeight"
        :min="0"
        controls-position="right"
        @change="onChangeLineHeight"
      />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'ConfigurationEventTitle',
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
        eventTitle: configuration
      })
    },
    onChangeHeight (currentValue, oldValue) {
      const configuration = Object.assign({}, this.value, {
        height: currentValue
      })
      this.$emit('change', {
        eventTitle: configuration
      })
    },
    onChangeLineHeight (currentValue, oldValue) {
      const configuration = Object.assign({}, this.value, {
        lineHeight: currentValue
      })
      this.$emit('change', {
        eventTitle: configuration
      })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
