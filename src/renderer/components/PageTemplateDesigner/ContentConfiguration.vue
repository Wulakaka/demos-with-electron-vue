<template>
  <div class="contentConfiguration">
    <el-form
      ref="form"
      :model="properties"
      label-width="100px"
      size="mini"
    >
      <div
        v-for="(group, groupName) of configurationGroups"
        :key="groupName"
      >
        <h1 v-show="Object.keys(group).length">
          {{ groupName }}
        </h1>
        <component
          v-for="(property,key) of group"
          :key="key"
          :is="configurationComponent(key)"
          :value="group[key]"
          @change="onChange"
        />
      </div>
    </el-form>
    <!-- <code>{{ configurationGroups }}</code> -->
  </div>
</template>
<script>
import ConfigurationItems from './configurationItems'
import { configurationMap } from './WidgetConfigurationItems'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters, mapState } = createNamespacedHelpers(
  'Designer'
)
export default {
  name: 'ContentConfiguration',
  components: {
    ...ConfigurationItems
  },
  watch: {
    activeWidget: {
      handler: function (val, oldVal) {
        if (val) {
          const { id, name, ...properties } = val
          this.id = id
          this.properties = properties
        } else {
          this.properties = null
        }
      },
      deep: true
    }
  },
  data () {
    return {
      properties: null,
      id: null,
      name: null,
      configurationItemNames: []
    }
  },
  created () {},
  computed: {
    ...mapGetters(['activeWidget']),
    ...mapState(['activeWidgetId']),
    configurationGroups () {
      const groups = {
        layout: {},
        position: {},
        custom: {},
        data: {}
      }
      let key
      for (key in this.properties) {
        if (Object.keys(configurationMap).includes(key)) {
          groups[configurationMap[key].parent][key] = this.properties[key]
        } else {
          groups.custom[key] = this.properties[key]
        }
      }

      return groups
    }
  },
  methods: {
    ...mapActions(['setWidgetMap']),
    onChange (properties) {
      this.setWidgetMap({
        id: this.id,
        ...properties
      })
    },
    configurationComponent (name) {
      return 'Configuration' + name.slice(0, 1).toUpperCase() + name.slice(1)
    }
  }
}
</script>
<style lang="scss" scoped>
.contentConfiguration {
  height: 100%;
  flex: 0 1 270px;
  background: blanchedalmond;
  padding: 20px;
  overflow-y: auto;
}
</style>
