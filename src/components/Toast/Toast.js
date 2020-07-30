import Vue from 'vue';
import toast from './Toast.vue'
let Toast = Vue.extend(toast)

function toasted(data) {
  let dom = new Toast({
    el: document.createElement('div') //将组件挂载到新创建的div上 
  })

  dom.text = data.text || ""
  dom.duration = data.duration || 1200
  dom.type = data.type || "success"

  document.body.appendChild(dom.$el) //把组件的dom添加到body里
  return dom
}


export default toasted