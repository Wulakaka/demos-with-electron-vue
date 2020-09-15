<template>
  <div ref="chapter16" />
</template>

<script>
import { simpleLevelPlan, DOMDisplay, runGame } from '@/exercise/chapter16'
export default {
  name: 'Chapter16',
  mounted () {
    // const simpleLevel = new Level(simpleLevelPlan)
    // const display = new DOMDisplay(this.$refs.chapter16, simpleLevel)
    // display.syncState(State.start(simpleLevel))

    runGame([simpleLevelPlan], DOMDisplay)
  }
}
</script>
<style lang='scss'>
.background {
  background: rgb(52, 166, 251);
  table-layout: fixed;
  border-spacing: 0;
  td {
    padding: 0;
  }
}
.lava {
  background: rgb(255, 100, 100);
}
.wall {
  background: white;
}
.actor {
  position: absolute;
}
.coin {
  background: rgb(241, 229, 89);
}
.monster {
  background: aliceblue;
}
.player {
  background: rgb(64, 64, 64);
  .lost & {
    background: rgb(160, 64, 64);
  }
  .won & {
    box-shadow: -4px -7px 8px white, 4px -7px 8px white;
  }
}
.game {
  overflow: hidden;
  max-width: 600px;
  max-height: 450px;
  position: relative;
}
</style>
