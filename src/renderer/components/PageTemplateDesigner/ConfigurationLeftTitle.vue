<template>
  <div>
    <el-form-item label="左标题文字">
      <el-input
        :value="value.text"
        controls-position="right"
        placeholder="请输入左标题"
        @input="onChangeText"
      />
    </el-form-item>
    <el-form-item label="左标题宽">
      <el-input-number
        :value="value.width"
        :min="0"
        controls-position="right"
        @change="onChangeWidth"
      />
    </el-form-item>
    <el-form-item label="左标题行高">
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
  name: 'ConfigurationTeftTitle',
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
        leftTitle: configuration
      })
    },
    onChangeWidth (currentValue, oldValue) {
      const configuration = Object.assign({}, this.value, {
        width: currentValue
      })
      this.$emit('change', {
        leftTitle: configuration
      })
    },
    onChangeLineHeight (currentValue, oldValue) {
      const configuration = Object.assign({}, this.value, {
        lineHeight: currentValue
      })
      this.$emit('change', {
        leftTitle: configuration
      })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
