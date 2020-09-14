<template>
  <div>
    <el-form-item label="字典表名">
      <el-select
        :value="value.dictTableName"
        placeholder="请选择"
        @change="onChangeTableName"
        clearable
      >
        <el-option
          v-for="item in tables"
          :key="item.tableName"
          :label="item.tableName"
          :value="item.tableName"
        >
          <span>
            {{ item.tableName }}
            <strong>（{{ item.tableExplain }}）</strong>
          </span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="字典字段名">
      <el-select
        :value="value.dictClassName"
        placeholder="请选择"
        @change="onChangeClassName"
        clearable
      >
        <el-option
          v-for="item in classes"
          :key="item.showClassName"
          :label="item.showClassName"
          :value="item.showClassName"
        >
          <span>
            {{ item.showClassName }}
            <strong>（{{ item.showClassNameExplain }}）</strong>
          </span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="字典关系名">
      <el-select
        :value="value.dictRelationName"
        placeholder="请选择"
        @change="onChangeRelationName"
        clearable
      >
        <el-option
          v-for="item in relations"
          :key="item.dictId"
          :label="item.dictId"
          :value="item.dictId"
        >
          <span>
            {{ item.dictId }}
            <strong>（{{ item.dictName }}）</strong>
          </span>
        </el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
import request from '@/utils/request'
import { getDictionaryTableData } from '@/api/medicalDocument'
export default {
  name: 'ConfigurationDictionarySource',
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
      tables: [],
      classes: [],
      relations: []
    }
  },
  async created () {
    await this.getDictionaryTableData()
    if (this.value.dictTableName) {
      const table = this.tables.find(
        item => item.tableName === this.value.dictTableName
      )
      if (table) {
        this.classes = table.tableInfos
      }
      if (this.value.dictClassName) {
        const dictClass = this.classes.find(
          item => item.showClassName === this.value.dictClassName
        )
        if (dictClass) {
          this.relations = dictClass.classNameValue
        }
      }
    }
  },
  methods: {
    onChangeTableName (currentValue, oldValue) {
      const table = this.tables.find(item => item.tableName === currentValue)
      if (table) {
        this.classes = table.tableInfos
      } else {
        this.classes = []
      }
      this.relations = []
      const configuration = Object.assign({}, this.value, {
        dictTableName: currentValue,
        conditionClassNameId: table ? table.conditionClassNameId : '',
        dictClassName: '',
        dictRelationName: ''
      })
      this.$emit('change', {
        dictionarySource: configuration
      })
    },
    onChangeClassName (currentValue, oldValue) {
      const dictClass = this.classes.find(
        item => item.showClassName === currentValue
      )
      if (dictClass) {
        this.relations = dictClass.classNameValue
      } else {
        this.relations = []
      }
      const configuration = Object.assign({}, this.value, {
        dictClassName: currentValue,
        dictRelationName: ''
      })
      this.$emit('change', {
        dictionarySource: configuration
      })
    },
    onChangeRelationName (currentValue, oldValue) {
      const configuration = Object.assign({}, this.value, {
        dictRelationName: currentValue
      })
      this.$emit('change', {
        dictionarySource: configuration
      })
    },
    getDictionaryTableData () {
      return request(getDictionaryTableData)
        .then(res => {
          this.tables = res.data.data
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
