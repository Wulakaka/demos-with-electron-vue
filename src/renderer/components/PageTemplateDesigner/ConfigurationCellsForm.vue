<template>
  <div>
    <el-form-item>
      <el-button
        size="mini"
        @click="$emit('merge-cells')"
      >
        合并
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button
        size="mini"
        @click="$emit('split-cells')"
      >
        拆分
      </el-button>
    </el-form-item>
    <el-form-item label="行数">
      <el-input-number
        :value="rows"
        size="mini"
        @change="(newRows, oldRows) => {$emit('change-rows',{newRows, oldRows})}"
        step-strictly
        :min="1"
      />
    </el-form-item>
    <el-form-item label="列数">
      <el-input-number
        :value="cols"
        size="mini"
        @change="(newCols, oldCols) => {$emit('change-cols',{newCols, oldCols})}"
        step-strictly
        :min="1"
      />
    </el-form-item>
    <el-form-item label="单元格宽">
      <el-input-number
        :value="cellConfiguration('width')"
        size="mini"
        @change="(val) => $emit('change-cell','width',val)"
        step-strictly
        :min="0"
      />
    </el-form-item>
    <el-form-item label="单元格高">
      <el-input-number
        :value="cellConfiguration('height')"
        size="mini"
        @change="(val) => $emit('change-cell','height',val)"
        step-strictly
        :min="20"
      />
    </el-form-item>
    <el-form-item label="单元格边框颜色">
      <el-color-picker
        :value="cellConfiguration('borderColor')"
        @change="(val) => $emit('change-cell','borderColor',val)"
      />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'ConfigurationCellsForm',
  props: {
    rows: {
      required: true,
      type: Number
    },
    cols: {
      required: true,
      type: Number
    },
    cellActiveConfiguration: {
      required: true,
      type: Object
    }
  },
  computed: {
    cellConfiguration () {
      return (name) => {
        return this.cellActiveConfiguration[name].length === 0
          ? ''
          : this.cellActiveConfiguration[name][0]
      }
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
