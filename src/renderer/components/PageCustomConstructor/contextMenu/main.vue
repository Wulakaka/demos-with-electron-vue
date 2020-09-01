<template>
  <transition name="fade">
    <div
      class="mask"
      v-show="visible"
      @click.self="close"
    >
      <div
        class="contextMenu"
        :style="positionStyle"
      >
        <div
          v-for="(item, index) in list"
          :key="index"
          @click="selectMenuItem(item)"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data () {
    return {
      list: [
        {
          label: '菜单一',
          value: 1
        }, {
          label: '菜单二',
          value: 2
        }, {
          label: '菜单三',
          value: 3
        }
      ],
      posX: 0,
      posY: 0,
      visible: false
    }
  },
  computed: {
    positionStyle () {
      return {
        left: this.posX + 'px',
        top: this.posY + 'px'
      }
    }
  },
  beforeDestroy () {
    this.$el.parentNode.removeChild(this.$el)
  },
  methods: {
    selectMenuItem (item) {
      this.onSelectMenuItem(item)
    },
    close () {
      this.onClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0);
}
.contextMenu {
  position: relative;
  border: 1px solid #999;
  background: white;
  border-radius: 4px;
  overflow: hidden;
  width: 100px;
  & > div {
    border-bottom: 1px solid #999;
    padding: 10px;
    cursor: pointer;
    &:hover {
      background: aliceblue;
    }
    &:last-child {
      border: none;
    }
  }
}
.fade-enter-active {
  animation: fade .3s;
}
.fade-leave-active {
  animation: fade .3s reverse;
}
@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }

}
</style>
