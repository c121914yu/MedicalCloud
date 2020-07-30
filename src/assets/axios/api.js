import {
	getAction,
	postAction
} from './manage.js'

const getActivity = (params) => getAction("api/getActivity", params)

const login = (data) => postAction("api/login", data)

export {
	getActivity,
	login,
}