import Vue from 'vue'
import Main from './main.vue'
import { PopupManager } from 'element-ui/src/utils/popup'
import { isVNode } from 'element-ui/src/utils/vdom'

// 创建构造器
const TooltipConstructor = Vue.extend(Main)
// 存储当前实例
let instance

let timer

const Tooltip = function (options) {
  // 判断是否为服务端
  if (Vue.prototype.$isServer) return
  // 对options进行非空处理
  options = options || {}
  // 如果是字符串，处理成对象
  if (typeof options === 'string') {
    options = {
      message: options
    }
  }

  if (!instance) {
    instance = new TooltipConstructor({
      data: options
    })
    // 挂载
    instance.$mount()
    // 动态添加实例的dom
    document.body.appendChild(instance.$el)
    // 设置z-index
    instance.$el.style.zIndex = PopupManager.nextZIndex()
  } else {
    instance.message = options.message
  }
  instance.visible = true
  // 对传入的message进行判断
  if (isVNode(instance.message)) {
    // 如果是虚拟节点
    instance.$slots.default = [instance.message]
    instance.message = null
  }

  // 样式修改
  instance.positionX = options.positionX + 15
  instance.positionY = options.positionY + 20

  // 返回实例
  return instance
}

Tooltip.remove = function () {
  if (instance) {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      instance.visible = false
      // instance.$el.parentNode.removeChild(instance.$el)
      // instance.$destroy(true)
      // instance = null
    }, 100)
  }
}

export default Tooltip
