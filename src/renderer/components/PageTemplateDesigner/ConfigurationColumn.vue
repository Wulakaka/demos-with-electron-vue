<template>
  <div>
    <el-form-item label="列数">
      <el-input-number
        :value="value"
        :min="0"
        controls-position="right"
        @change="onChange"
      />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'ConfigurationColumn',
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
        column: currentValue
      })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
