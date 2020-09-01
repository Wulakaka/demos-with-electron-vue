<template>
  <el-dialog
    center
    :title="configuration.title"
    :visible.sync="configuration.visible"
    :append-to-body="appendToBody"
  >
    <div class="content">
      <div>
        <el-button
          @click="add"
          size="mini"
        >
          新增
        </el-button>
        <el-button
          @click="remove"
          size="mini"
        >
          删除
        </el-button>
        <el-table
          :data="list"
          style="width: 100%"
          highlight-current-row
          @current-change="onCurrentChange"
        >
          <el-table-column
            prop="label"
            label="集合"
          />
        </el-table>
      </div>
      <div>
        <el-form
          label-width="100px"
          size="mini"
        >
          <el-form-item
            v-for="(rowValue, rowKey) in currentRow"
            :key="rowKey"
            :label="configField(rowKey).description"
          >
            <span v-if="isArray(rowValue)">
              <el-button @click="onClickConfiguration(configField(rowKey).config)">配置</el-button>
              <DialogCollectionEditor
                v-if="configField(rowKey).config.visible"
                :configuration="configField(rowKey).config"
                :value="rowValue"
                @change="onChangeValue($event,rowKey)"
                append-to-body
              />
            </span>
            <el-input
              v-else
              v-model="currentRow[rowKey]"
              :placeholder="'请输入'+ configField(rowKey).description"
              size="mini"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <span slot="footer">
      <el-button
        size="mini"
        @click="configuration.visible = false"
      >取 消</el-button>
      <el-button
        type="primary"
        size="mini"
        @click="onClickConfirm"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import isArray from 'lodash/isArray'
import isNumber from 'lodash/isNumber'
export default {
  name: 'DialogCollectionEditor',
  props: {
    configuration: {
      type: Object,
      required: true
    },
    value: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      list: [],
      currentRow: null
    }
  },
  computed: {
    appendToBody () {
      return this.$attrs['append-to-body']
    },
    configField () {
      return name => {
        const field = this.configuration.field.filter(
          item => item.name === name
        )
        if (field.length) {
          return field[0]
        }
        return {}
      }
    }
  },
  created () {
    this.isArray = isArray
    this.list = JSON.parse(JSON.stringify(this.value))
  },
  methods: {
    add () {
      const item = this.configuration.field.reduce((obj, field) => {
        obj[field.name] = field.default
        return obj
      }, {})
      this.list.push(item)
    },
    remove () {
      let currentIndex
      this.list.forEach((item, index) => {
        if (item === this.currentRow) {
          currentIndex = index
        }
      })
      if (isNumber(currentIndex)) {
        this.list.splice(currentIndex, 1)
      }
    },
    onCurrentChange (currentRow, oldCurrentRow) {
      this.currentRow = currentRow
    },
    onClickConfiguration (config) {
      config.visible = true
    },
    onClickConfirm () {
      this.$emit('change', this.list)
      this.configuration.visible = false
    },
    onChangeValue (e, fieldName) {
      this.currentRow[fieldName] = e
    }
  }
}
</script>
<style lang='scss' scoped>
.content {
  display: flex;
  & > div {
    width: 50%;
    margin: 10px;
    // border: 1px solid #666;
  }
}
</style>
