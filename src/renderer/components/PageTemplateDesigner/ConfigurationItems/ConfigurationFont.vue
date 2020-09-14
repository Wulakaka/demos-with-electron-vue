<template>
  <div>
    <el-form-item label="文字样式">
      <el-select
        :value="value.weight"
        placeholder="请选择"
        @change="onChangeFontWeight"
      >
        <el-option
          v-for="item in fontWeightOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="文字尺寸(pt)">
      <el-input-number
        :value="value.size"
        :min="0"
        controls-position="right"
        @change="onChangeFontSize"
      />
    </el-form-item>
    <el-form-item label="文字行高">
      <el-input-number
        :value="value.lineHeight"
        :min="0"
        controls-position="right"
        @change="onChangeLineHeight"
      />
    </el-form-item>
    <el-form-item label="对齐方式">
      <el-select
        :value="value.textAlign"
        placeholder="请选择"
        @change="onChangeTextAlign"
      >
        <el-option
          v-for="item in textAlignOptions"
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
  name: 'ConfigurationFont',
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
      fontWeightOptions: [{
        value: 'normal',
        label: '普通'
      }, {
        value: 'bold',
        label: '加粗'
      }],
      textAlignOptions: [{
        value: 'left',
        label: '左对齐'
      }, {
        value: 'center',
        label: '居中'
      }, {
        value: 'right',
        label: '右对齐'
      }]
    }
  },
  methods: {
    onChangeFontWeight (currentValue, oldValue) {
      const configuration = Object.assign({}, this.value, {
        weight: currentValue
      })
      this.$emit('change', {
        font: configuration
      })
    },
    onChangeFontSize (currentValue, oldValue) {
      const configuration = Object.assign({}, this.value, {
        size: currentValue
      })
      this.$emit('change', {
        font: configuration
      })
    },
    onChangeLineHeight (currentValue, oldValue) {
      const configuration = Object.assign({}, this.value, {
        lineHeight: currentValue
      })
      this.$emit('change', {
        font: configuration
      })
    },
    onChangeTextAlign (currentValue, oldValue) {
      const configuration = Object.assign({}, this.value, {
        textAlign: currentValue
      })
      this.$emit('change', {
        font: configuration
      })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
