import {
	getAction,
	postAction,
	putAction,
	deleteAction
} from './manage.js'

// 用户关联
const getRandomCode = (phone) => getAction(`api/user/${phone}`, {})
const getMe = () => getAction("api/user/me", {})
const setUser = (data) => postAction("api/user", data)
const login = (data) => postAction("api/user/login", data)

// 角色管理
const gettRoles = (data) => getAction("api/role", data)
const createRole = (data) => postAction("api/role", data)
const deleteRole = (id) => deleteAction("api/role/" + id, {})


export {
	getRandomCode,
	setUser,
	login,
	getMe,

	gettRoles,
	createRole,
	deleteRole
}