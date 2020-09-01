<template>
  <div>
    PageCustomConstructor
    <el-button
      @click="handleClick"
    >
      tooltip
    </el-button>
    <div
      class="content"
      @mousemove="showTooltip"
      @mouseleave="handleMouseleave"
      @click.right="handleRightClick($event, 1)"
    />
    <div
      class="content"
      @click.right="handleRightClick($event, 2)"
    />
  </div>
</template>

<script>
export default {
  name: 'PageCustomConstructor',
  methods: {
    handleClick () {

    },
    showTooltip (e) {
      this.$tooltip({
        message: 'a',
        positionX: e.pageX,
        positionY: e.pageY
      })
    },
    handleMouseleave () {
      this.$tooltip.remove()
    },
    handleRightClick (e, index) {
      this.$contextMenu({
        posX: e.pageX,
        posY: e.pageY,
        onSelectMenuItem: (item) => {
          console.log(item)
        }
      })
    }
  }
}

</script>
<style lang='scss' scoped>
.content{
  height: 200px;
  background: chocolate;
}
</style>
