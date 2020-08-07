import Vue from "vue"
import VueRouter from "vue-router"
Vue.use(VueRouter)

import PageLogin from "../views/Login/Page_Login.vue"
import Login from "../views/Login/Login.vue"
import SetNumber from "../views/Login/SetNumber.vue"

import PageRemind from "../views/Remind/PageRemind.vue"
import Remind from "../views/Remind/Remind.vue"
import EditRemind from "../views/Remind/EditRemind.vue"

import PageEqument from "../views/Equment/PageEqument.vue"
import Equment from "../views/Equment/Equment.vue"
import AddEqument from "../views/Equment/AddEqument.vue"
import Phone from "../views/Equment/Phone.vue"
import Email from "../views/Equment/Email.vue"
import MedicalBox from "../views/Equment/Box.vue"

import Record from "../views/Record/Record.vue"

import PageUser from "../views/User/Page_User.vue"
import User from "../views/User/User.vue"
import SetRole from "../views/User/SetRole.vue"
import Case from "../views/User/Case.vue"
import Report from "../views/User/Report.vue"
import Introduction from "../views/User/Introduction.vue"
import UsingHelp from "../views/User/UsingHelp.vue"

const routes = [{
		path: "/",
		component: PageLogin,
		children: [{
				path: "",
				name: "Login",
				component: Login,
				meta: {
					protect: false
				},
			},
			{
				path: "SetNumber",
				name: "SetNumber",
				component: SetNumber,
				meta: {
					protect: false
				},
			}
		],
	},
	{
		path: "/Remind",
		component: PageRemind,
		children: [{
				path: "",
				name: "Remind",
				component: Remind,
				meta: {
					protect: true
				},
			},
			{
				path: "EditRemind",
				name: "EditRemind",
				component: EditRemind,
				meta: {
					protect: true
				},
			},
		],
	},
	{
		path: "/Equment",
		component: PageEqument,
		children: [{
				path: "",
				name: "Equment",
				component: Equment,
				meta: {
					protect: true
				},
			},
			{
				path: "Add",
				name: "AddEqument",
				component: AddEqument,
				meta: {
					protect: true
				},
			},
			{
				path: "Phone",
				name: "Phone",
				component: Phone,
				meta: {
					protect: true
				},
			},
			{
				path: "Email",
				name: "Email",
				component: Email,
				meta: {
					protect: true
				},
			},
			{
				path: "Box",
				name: "MedicalBox",
				component: MedicalBox,
				meta: {
					protect: true
				},
			},
		],
	},
	{
		path: "/Record",
		name: "Record",
		component: Record,
		meta: {
			protect: true
		},
	},
	{
		path: "/User",
		component: PageUser,
		children: [{
				path: "",
				name: "User",
				component: User,
				meta: {
					protect: true
				},
			},
			{
				path: "SetRole",
				name: "SetRole",
				component: SetRole,
				meta: {
					protect: true
				},
			},
			{
				path: "Case",
				name: "Case",
				component: Case,
				meta: {
					protect: true
				},
			},
			{
				path: "Report",
				name: "Report",
				component: Report,
				meta: {
					protect: true
				},
			},
			{
				path: "Introduction",
				name: "Introduction",
				component: Introduction,
				meta: {
					protect: true
				},
			},
			{
				path: "UsingHelp",
				name: "UsingHelp",
				component: UsingHelp,
				meta: {
					protect: true
				},
			},
		],
	},
	{
		path: "/*",
		redirect: "/",
	},
]

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
})

import store from '../store/index'
import showToast from "../components/Toast/Toast.js"
// 路由守卫
router.beforeEach((to, from, next) => {
	const protect = to.meta.protect
	// 判断是否为需要守卫的路由
	if (protect && !store.getters.matchUser) {
		showToast({
			text: "请先登录",
			type: "warn"
		})
		next("/")
	} else if (!protect && store.getters.matchUser) {
		showToast({
			text: "自动登录",
		})
		next("/User")
	}
	next()
})

export default router