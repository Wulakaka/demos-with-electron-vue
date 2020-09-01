<template>
  <div>
    <el-form-item label="纵坐标配置">
      <el-button @click="onClick">
        配置
      </el-button>
    </el-form-item>
    <el-form-item label="横线分隔">
      <el-input-number
        :value="value.lineInterval"
        :min="0"
        controls-position="right"
        @change="onChangeLineInterval"
      />
    </el-form-item>
    <dialog-collection-editor
      v-if="dialogCollectionEditorConfig.visible"
      :configuration="dialogCollectionEditorConfig"
      :value="value.list"
      @change="onChangeList"
    />
  </div>
</template>

<script>
import DialogCollectionEditor from './DialogCollectionEditor'
export default {
  name: 'ConfigurationYAxis',
  components: {
    DialogCollectionEditor
  },
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
      dialogCollectionEditorConfig: {}
    }
  },
  created () {
    this.dialogCollectionEditorConfig = {
      visible: false,
      title: '纵坐标配置',
      field: [
        {
          name: 'label',
          default: 'Y坐标轴',
          description: '坐标轴名',
          config: null
        },
        {
          name: 'index',
          default: 0,
          description: '坐标轴索引',
          config: null
        },
        {
          name: 'values',
          default: [],
          description: '值',
          config: {
            visible: false,
            title: '单个纵坐标配置',
            field: [
              {
                name: 'label',
                default: '新项目',
                description: '显示文字',
                config: null
              },
              {
                name: 'value',
                default: 0,
                description: '值',
                config: null
              }
            ]
          }
        }
      ]
    }
  },
  methods: {
    onChangeLineInterval (currentValue, oldValue) {
      const configuration = Object.assign({}, this.value, {
        lineInterval: currentValue
      })
      this.$emit('change', {
        yAxis: configuration
      })
    },
    onChangeList (currentValue) {
      const configuration = Object.assign({}, this.value, {
        list: currentValue
      })
      this.$emit('change', {
        yAxis: configuration
      })
    },
    onClick () {
      this.dialogCollectionEditorConfig.visible = true
    }
  }
}
</script>
<style lang='scss' scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
