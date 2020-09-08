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
    <el-form-item label="单元格内容">
      <el-input
        :value="cellConfiguration('text')"
        size="mini"
        @input="(val) => {
          $emit('change-cell','text',val)
        }"
        clearable
      />
    </el-form-item>
    <el-form-item label="对齐方式">
      <el-select
        clearable
        :value="cellConfiguration('textAlign')"
        @change="(val) => $emit('change-cell','textAlign',val)"
        placeholder="请选择"
      >
        <el-option
          v-for="item in [
            {value: 'left', label:'左对齐'},
            {value: 'center', label:'居中对齐'},
            {value: 'right', label:'右对齐'},
          ]"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="缩进">
      <el-input-number
        clearable
        :value="cellConfiguration('textIndent')"
        size="mini"
        @change="(val) => $emit('change-cell','textIndent',val)"
        step-strictly
        :min="0"
      />
    </el-form-item>
    <el-form-item label="字号">
      <el-input-number
        clearable
        :value="cellConfiguration('fontSize')"
        size="mini"
        @change="(val) => $emit('change-cell','fontSize',val)"
        step-strictly
        :min="0"
      />
    </el-form-item>
    <el-form-item label="文字加粗">
      <el-select
        clearable
        :value="cellConfiguration('fontWeight')"
        @change="(val) => $emit('change-cell','fontWeight',val)"
        placeholder="请选择"
      >
        <el-option
          v-for="item in [
            {value: 'normal', label:'正常'},
            {value: 'bold', label:'加粗'},
          ]"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
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
    <el-form-item label="文字颜色">
      <el-color-picker
        clearable
        :value="cellConfiguration('color')"
        @change="(val) => $emit('change-cell','color',val)"
      />
    </el-form-item>
    <el-form-item label="单元格边框颜色">
      <el-color-picker
        clearable
        :value="cellConfiguration('borderColor')"
        @change="(val) => $emit('change-cell','borderColor',val)"
      />
    </el-form-item>
    <el-form-item label="源数据表名">
      <el-select
        clearable
        :value="cellConfiguration('tableName')"
        @change="(val) => $emit('change-cell','tableName',val)"
        placeholder="请选择"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="源数据字段名">
      <el-select
        clearable
        :value="cellConfiguration('className')"
        @change="(val) => $emit('change-cell','className',val)"
        placeholder="请选择"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="开启编辑">
      <el-switch
        :value="editable"
        @change="$emit('switch-editable')"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'ConfigurationCellsForm',
  data () {
    return {
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }]
    }
  },
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
    },
    editable: {
      required: true,
      type: Boolean
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
