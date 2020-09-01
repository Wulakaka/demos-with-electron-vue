<template>
  <div class="widgetInput">
    <input
      class="input"
      type="text"
      :style="widgetStyle"
      :placeholder="configuration.placeholder"
      :readonly="configuration.readonly"
      :value="configuration.value"
      @[showSelectEvent]="showSelect"
    >
    <el-select
      v-if="selectVisible"
      ref="select"
      class="select"
      :value="selectValue"
      @change="onSelectChange"
      size="mini"
      filterable
      collapse-tags
      :placeholder="configuration.placeholder"
      @visible-change="onOptionVisibleChange"
      :multiple="configuration.multiSelect"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.value"
        :value="item.value"
      />
    </el-select>
  </div>
</template>
<script>
import { getDictionaryData } from '@/api/medicalDocument'
import request from '@/utils/request'
export default {
  name: 'WidgetInput',
  props: {
    configuration: {
      type: Object,
      required: true
    },
    editMode: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    configuration: {
      deep: true,
      handler: function (val) {
        this.setStyle()
      }
    }
  },
  data () {
    return {
      widgetStyle: {},
      showSelectEvent: 'click',
      selectVisible: false,
      options: []
    }
  },
  computed: {
    selectValue () {
      if (this.configuration.multiSelect) {
        if (this.configuration.value === '') {
          return []
        }
        return this.configuration.value.split(',')
      } else {
        return this.configuration.value
      }
    }
  },
  created () {
    this.setStyle()
  },
  methods: {
    setStyle () {
      const { font, border } = this.configuration
      let styleObj = {
        fontSize: font.size + 'pt',
        fontWeight: font.weight,
        lineHeight: font.lineHeight + 'px',
        textAlign: font.textAlign
      }
      const borderObj = border.position.reduce((obj, item) => {
        obj['border-' + item] = border.width + 'px solid ' + border.color
        return obj
      }, {})

      styleObj = { ...styleObj, ...borderObj }
      this.widgetStyle = styleObj
    },
    async showSelect (e) {
      if (this.editMode) {
        return
      }
      const {
        dictTableName,
        dictClassName
      } = this.configuration.dictionarySource
      if (dictTableName && dictClassName) {
        await this.getDictionaryData(dictTableName, dictClassName)
        this.selectVisible = true
        setTimeout(() => {
          this.$refs.select.focus()
        })
      }
    },
    onOptionVisibleChange (visible) {
      if (!visible) {
        this.selectVisible = false
      }
    },
    getDictionaryData (dictTableName, dictClassName) {
      return request({
        method: 'POST',
        url: getDictionaryData,
        data: {
          dictTableName,
          dictClassName
        }
      }).then(res => {
        this.options = res.data.data
      })
    },
    onSelectChange (val) {
      if (this.configuration.multiSelect) {
        this.configuration.value = val.join(',')
      } else {
        this.configuration.value = val
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.widgetInput {
  width: 100%;
  height: 100%;
  position: relative;
  .input {
    position: absolute;
    width: 100%;
    height: 100%;
    background: transparent;
    outline: none;
    border: none;
  }
  .select {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .select ::v-deep .el-input{
    height: 100%;
  }
  .select ::v-deep .el-input__inner{
    height: 100%;
  }
}
</style>
