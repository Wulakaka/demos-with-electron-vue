<template>
  <div>
    <el-form-item label="只读">
      <el-select
        :value="value"
        placeholder="请选择"
        @change="onChange"
      >
        <el-option
          v-for="item in options"
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
  name: 'ConfigurationReadonly',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      options: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        }
      ]
    }
  },
  methods: {
    onChange (currentValue, oldValue) {
      this.$emit('change', {
        readonly: currentValue
      })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
