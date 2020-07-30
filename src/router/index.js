import Vue from "vue"
import VueRouter from "vue-router"
Vue.use(VueRouter)

import PageLogin from "../views/Login/Page_Login.vue"
import Login from "../views/Login/Login.vue"
import Register from "../views/Login/Register.vue"
import FindPsw from "../views/Login/FindPsw.vue"

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
import SetUser from "../views/User/SetUser.vue"
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
			},
			{
				path: "Register",
				name: "Register",
				component: Register,
			},
			{
				path: "FindPsw",
				name: "FindPsw",
				component: FindPsw,
			},
		],
	},
	{
		path: "/Remind",
		component: PageRemind,
		children: [{
				path: "",
				name: "Remind",
				component: Remind,
			},
			{
				path: "EditRemind",
				name: "EditRemind",
				component: EditRemind,
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
			},
			{
				path: "Add",
				name: "AddEqument",
				component: AddEqument,
			},
			{
				path: "Phone",
				name: "Phone",
				component: Phone,
			},
			{
				path: "Email",
				name: "Email",
				component: Email,
			},
			{
				path: "Box",
				name: "MedicalBox",
				component: MedicalBox,
			},
		],
	},
	{
		path: "/Record",
		name: "Record",
		component: Record,
	},
	{
		path: "/User",
		component: PageUser,
		children: [{
				path: "",
				name: "User",
				component: User,
			},
			{
				path: "SetUser",
				name: "SetUser",
				component: SetUser,
			},
			{
				path: "Case",
				name: "Case",
				component: Case,
			},
			{
				path: "Report",
				name: "Report",
				component: Report,
			},
			{
				path: "Introduction",
				name: "Introduction",
				component: Introduction,
			},
			{
				path: "UsingHelp",
				name: "UsingHelp",
				component: UsingHelp,
			},
		],
	},
	{
		path: "/*",
		redirect: "/Remind",
	},
]

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
})

export default router