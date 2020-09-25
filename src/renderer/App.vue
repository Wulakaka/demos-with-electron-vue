<template>
  <div id="app">
    <router-view />
    <button @click="createNewWindow">
      new window Template Designer
    </button>
  </div>
</template>

<script>
import '@/mock/mockData'
import '@/model/Rule'
import '@/model/chapter12'
export default {
  name: 'EVHelloWorld',
  methods: {
    createNewWindow () {
      this.$electron.ipcRenderer.send('open-new-window', 'templateDesigner')
    }
  },
  mounted () {
    this.$electron.ipcRenderer.on('route', (e, locationName) => {
      if (locationName) {
        this.$router.push(locationName)
      }
    })
  }
}
</script>
<style>
/* CSS */
</style>
