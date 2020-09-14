<template>
  <div>
    <el-form-item label="边框位置">
      <el-select
        :value="value.position"
        placeholder="请选择"
        multiple
        @change="onChangeBorderPosition"
      >
        <el-option
          v-for="item in borderPositionOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="边框颜色">
      <el-color-picker
        :value="value.color"
        size="mini"
        @change="onChangeBorderColor"
      />
    </el-form-item>
    <el-form-item label="边框宽">
      <el-input-number
        :value="value.width"
        :min="0"
        controls-position="right"
        @change="onChangeBorderWidth"
      />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'ConfigurationBorder',
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
      borderPositionOptions: [{
        value: 'top',
        label: '上边框'
      }, {
        value: 'bottom',
        label: '下边框'
      }, {
        value: 'left',
        label: '左边框'
      }, {
        value: 'right',
        label: '右边框'
      }]
    }
  },
  methods: {
    onChangeBorderPosition (currentValue, oldValue) {
      const configuration = Object.assign({}, this.value, {
        position: currentValue
      })
      this.$emit('change', {
        border: configuration
      })
    },
    onChangeBorderColor (currentValue, oldValue) {
      currentValue = currentValue || 'transparent'
      const configuration = Object.assign({}, this.value, {
        color: currentValue
      })
      this.$emit('change', {
        border: configuration
      })
    },
    onChangeBorderWidth (currentValue, oldValue) {
      const configuration = Object.assign({}, this.value, {
        width: currentValue
      })
      this.$emit('change', {
        border: configuration
      })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
