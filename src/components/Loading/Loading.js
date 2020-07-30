import Vue from 'vue';
import load from './Loading.vue'
let Loading = Vue.extend(load)

function loading(data) {
	let dom = new Loading({
		el: document.createElement('div') //将组件挂载到新创建的div上 
	})
	document.body.appendChild(dom.$el) //把组件的dom添加到body里

	dom.close = function () {
		document.body.removeChild(dom.$el)
	}

	return dom
}


export default loading