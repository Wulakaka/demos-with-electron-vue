import Vue from 'vue'
import Main from './main.vue'
import { PopupManager } from 'element-ui/src/utils/popup'
import { isVNode } from 'element-ui/src/utils/vdom'

// 创建构造器
const TooltipConstructor = Vue.extend(Main)

// const Tooltip = function (options) {
//   if (Vue.prototype.$isServer) return
// }
// new TooltipConstructor().$mount('#app')
// 存储当前实例
let instance
// 存储所有实例
const instances = []
// 存储id变量
let seed = 1

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
  // 获取用户定义的关闭回调
  const userOnClose = options.onClose
  // 给每个弹框id
  const id = 'tooltip_' + seed++
  // 重新定义关闭的方法
  options.onClose = function () {
    // 将用户定义的回调传入本身的关闭方法内
    Tooltip.close(id, userOnClose)
  }
  // 生成实例，将options作为data传入组件
  instance = new TooltipConstructor({
    data: options
  })
  // 赋值id
  instance.id = id
  // 对传入的message进行判断
  if (isVNode(instance.message)) {
    // 如果是虚拟节点
    instance.$slots.default = [instance.message]
    instance.message = null
  }
  // 挂载
  instance.$mount()
  // 动态添加实例的dom
  document.body.appendChild(instance.$el)
  // 样式修改
  // 获取纵向偏移位置（默认为20）
  let verticalOffset = options.offset || 20
  // 累加已经有的实例偏移
  instances.forEach(item => {
    verticalOffset += item.$el.offsetHeight + 16
  })
  // 赋值纵向偏移量
  instance.verticalOffset = verticalOffset
  // 设为可见
  instance.visible = true
  // 设置z-index
  instance.$el.style.zIndex = PopupManager.nextZIndex()
  // 将实例添加到数组中
  instances.push(instance)
  // 返回实例
  return instance
};
// 增加显示方法的快捷方式
['success', 'warning', 'info', 'error'].forEach(type => {
  Tooltip[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    options.type = type
    return Tooltip(options)
  }
})

Tooltip.close = function (id, userOnClose) {
  // 所有实例的个数
  const len = instances.length
  // 用于存储当前实例在数组中的索引
  let index = -1
  // 用于存储待关闭的弹框的纵向偏移量
  let removedHeight
  for (let i = 0; i < len; i++) {
    // 获取待关闭的弹框
    if (id === instances[i].id) {
      removedHeight = instances[i].$el.offsetHeight
      index = i
      if (typeof userOnClose === 'function') {
        userOnClose(instances[i])
      }
      // 从数组中移除
      instances.splice(i, 1)
      break
    }
  }
  // 如果未找到当前实例，则终止
  if (len <= 1 || index === -1 || index > instances.length - 1) return
  for (let i = index; i < len - 1; i++) {
    const dom = instances[i].$el
    dom.style.top =
    parseInt(dom.style.top, 10) - removedHeight - 16 + 'px'
  }
}

export default Tooltip
