import axios from "axios"
import showToast from "../../components/Toast/Toast.js"
import loading from "../../components/Loading/Loading.js"

let load, token

// 创建实例
const service = axios.create({
	baseURL: process.env.VUE_APP_BASEURL,
	timeout: 10000,
	withCredentials: true
})

// 请求拦截
service.interceptors.request.use(
	(req) => {
		load = loading()
		return req
	},
	(err) => {
		showToast({
			type: "error",
			text: "网络错误",
		})
		return Promise.reject(err)
	}
)

// 错误处理
const error = (err) => {
	if (err.response) {
		showToast({
			type: "error",
			text: err.response.data.error,
		})
	}
	load.close()
	return Promise.reject(err)
}

// 响应拦截
service.interceptors.response.use((res) => {
	load.close()
	return res
}, error)

export {
	service as axios
}