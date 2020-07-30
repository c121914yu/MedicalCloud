import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
Vue.config.productionTip = false

// 引入组件
import loading from "./components/Loading/Loading.js"
Vue.prototype.$loading = loading
import model from "./components/Model/Model.js"
Vue.prototype.$showModel = model
import toast from "./components/Toast/Toast.js"
Vue.prototype.$showToast = toast

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')