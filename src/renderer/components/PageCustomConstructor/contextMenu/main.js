import Main from './main.vue'
import Vue from 'vue'
import { PopupManager } from 'element-ui/src/utils/popup'
const ContextMenuConstructor = Vue.extend(Main)

let instance
let timer
const ContextMenu = function (options = {}) {
  if (timer) {
    clearTimeout(timer)
  }
  const userOnClose = options.onClose
  options.onClose = function () {
    ContextMenu.close(userOnClose)
  }
  const userOnSelectMenuItem = options.onSelectMenuItem
  options.onSelectMenuItem = function (item) {
    ContextMenu.onSelectMenuItem(userOnSelectMenuItem, item)
  }
  if (instance) {
    instance = Object.assign(instance, options)
  } else {
    instance = new ContextMenuConstructor({
      data: options
    })
    instance.$mount()
    document.body.appendChild(instance.$el)
    // 设置z-index
    instance.$el.style.zIndex = PopupManager.nextZIndex()
  }
  Vue.nextTick(() => {
    instance.visible = true
  })

  return instance
}

ContextMenu.close = function (userOnClose) {
  if (typeof userOnClose === 'function') {
    userOnClose()
  }
  instance.visible = false
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    Vue.nextTick(() => {
      instance.$destroy()
      instance = null
    })
  }, 3000)
}

ContextMenu.onSelectMenuItem = function (userOnSelectMenuItem, item) {
  if (typeof userOnSelectMenuItem === 'function') {
    userOnSelectMenuItem(item)
  }
  ContextMenu.close()
}

export default ContextMenu
