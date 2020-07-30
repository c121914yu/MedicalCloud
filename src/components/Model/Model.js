import Vue from 'vue';
import model from './Model.vue'
let Model = Vue.extend(model)

function modeled(data) {
  let dom = new Model({
    el: document.createElement('div') //将组件挂载到新创建的div上 
  })

  dom.head = data.head || "提示"
  dom.text = data.text || ""
  dom.confirmText = data.confirmText || "确认"
  dom.cancelText = data.cancelText || ""
  dom.confirmColor = data.confirmColor || "var(--green)"
  dom.success = data.success || null

  document.body.appendChild(dom.$el) //把组件的dom添加到body里

  return dom
}


export default modeled