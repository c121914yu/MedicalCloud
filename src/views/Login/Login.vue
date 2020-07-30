<template>
	<div class="login">
		<form @submit="login">
			<div class="input">
				<i class="iconfont icon-phone"></i>
				<input
					type="number"
					placeholder="请输入手机号"
					required
					autocomplete="off"
					v-model="phone"
				/>
			</div>
			<div class="input">
				<i class="iconfont icon-password"></i>
				<input
					type="password"
					placeholder="请输入密码"
					minlength="6"
					required
					autocomplete="off"
					v-model="password"
				/>
			</div>
			<button type="submit">登录</button>
		</form>
		<div class="info">
			<router-link to="/FindPsw">忘记密码?</router-link>
			<router-link to="/Register" style="color:var(--green)"
				>立即注册</router-link
			>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			phone: "",
			password: "",
		}
	},
	methods: {
		login(e) {
			e.preventDefault()
			const reg = /^1[3456789]\d{9}$/
			if (!reg.test(this.phone))
				this.$showToast({
					type: "warn",
					text: "手机格式错误",
				})
			else {
				const id = "264212fadsf"
				localStorage.setItem("userID", id)
				this.$router.push({ name: "User" })
				this.$showToast({
					text: "登录成功",
				})
			}
		},
	},
	beforeRouteEnter(to, from, next) {
		next((vm) => {
			let params = vm.$route.params
			vm.phone = params.phone || ""
		})
	},
}
</script>

<style lang="stylus"></style>
