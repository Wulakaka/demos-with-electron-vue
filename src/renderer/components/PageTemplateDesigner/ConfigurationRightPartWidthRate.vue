<template>
  <div>
    <el-form-item label="右侧宽">
      <el-input-number
        :value="value"
        :min="0"
        :max="1"
        :precision="2"
        :step="0.02"
        controls-position="right"
        @change="onChange"
      />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'ConfigurationRightPartWidthRate',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  methods: {
    onChange (currentValue, oldValue) {
      this.$emit('change', {
        rightPartWidthRate: currentValue
      })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
