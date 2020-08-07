import {
	axios
} from './request.js'

//get
export function getAction(url, params) {
	return axios({
		url,
		method: "GET",
		params
	})
}

// post
export function postAction(url, data) {
	return axios({
		url,
		method: "POST",
		data
	})
}

// PUT
export function putAction(url, data) {
	return axios({
		url,
		method: "PUT",
		data
	})
}

// delete
export function deleteAction(url) {
	return axios({
		url,
		method: "DELETE"
	})
}