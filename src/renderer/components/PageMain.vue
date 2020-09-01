<template>
  <div class="content">
    <div class="menuContent">
      <el-menu
        :default-active="defaultActive"
        @open="handleOpen"
        @close="handleClose"
        :collapse="true"
        router
      >
        <el-menu-item index="/landing">
          <i class="el-icon-menu" />
          <span slot="title">原始首页</span>
        </el-menu-item>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-document" />
            <span slot="title">模板</span>
          </template>
          <el-menu-item-group>
            <span slot="title">模板</span>
            <el-menu-item index="/templateDesigner">
              Designer
            </el-menu-item>
            <el-menu-item index="/templateDisplayer">
              Displayer
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-location" />
            <span slot="title">spriteJS</span>
          </template>
          <el-menu-item
            index="/spritejs"
          >
            sprite js
          </el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-setting" />
            <span slot="title">自定义</span>
          </template>
          <el-menu-item index="/customConstructor">
            自定义构造器
          </el-menu-item>
          <el-menu-item index="/emptyPage">
            空白页
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="viewContent">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageMain',
  data () {
    return {
      defaultActive: '/'
    }
  },
  methods: {
    handleOpen () {},
    handleClose () {}
  }
}

</script>
<style lang='scss' scoped>
.content {
  display: flex;
  flex-direction: row;
  .viewContent {
    width: calc(100vw - 64px);
  }
}
</style>
