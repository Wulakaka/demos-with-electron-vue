<template>
  <transition
    name="fade"
  >
    <div
      class="tooltip"
      v-show="visible"
      :style="positionStyle"
    >
      <slot>
        <p
          v-if="!dangerouslyUseHTMLString"
        >
          {{ message }}
        </p>
        <p
          v-else
          v-html="message"
        />
      </slot>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'Tooltip',
  data () {
    return {
      visible: false,
      message: '',
      dangerouslyUseHTMLString: false,
      positionX: 0,
      positionY: 0
    }
  },
  computed: {
    positionStyle () {
      return {
        left: `${this.positionX}px`,
        top: `${this.positionY}px`
      }
    }
  }
}

</script>
<style lang='scss' scoped>
.tooltip{
  position: absolute;
  padding: 10px;
  border-radius: 4px;
  background: rgba(0,0,0,0.8);
}
.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
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
