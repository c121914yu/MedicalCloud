import {
	getAction,
	postAction,
	putAction,
	deleteAction
} from './manage.js'

// 用户关联
const getRandomCode = (phone) => getAction(`api/user/${phone}`, {})
const getEmail = (email) => getAction("api/user/getemail/" + email, {})
const getMe = () => getAction("api/user/me", {})
const setUser = (data) => postAction("api/user", data)
const updateEmail = (data) => putAction("api/user", data)
const login = (data) => postAction("api/user/login", data)


// 角色管理
const gettRoles = (data) => getAction("api/role", data)
const createRole = (data) => postAction("api/role", data)
const updateRole = (id, data) => putAction("api/role/" + id, data)
const deleteRole = (id) => deleteAction("api/role/" + id, {})

// 设备管理
const createEqument = (data) => postAction("api/equment", data)
const getEquments = () => getAction("api/equment", {})
const updateEqument = (id, data) => putAction("api/equment/" + id, data)
const deleteEqument = (id) => deleteAction("api/equment/" + id, {})
const updateMedicines = (id, data) => putAction("api/equment/updatemedicines/" + id, data)

export {
	getRandomCode,
	getEmail,
	setUser,
	login,
	getMe,
	updateEmail,

	gettRoles,
	createRole,
	updateRole,
	deleteRole,

	createEqument,
	getEquments,
	updateEqument,
	deleteEqument,
	updateMedicines
}