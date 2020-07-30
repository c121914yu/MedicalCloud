<template>
	<div class="User">
		<HeadPortrait></HeadPortrait>
		<Grid class="grid"></Grid>
		<button @click="loginOut">退出登录</button>
	</div>
</template>

<script>
import HeadPortrait from "./components/HeadPortrait"
import Grid from "./components/Grid"
export default {
	components: {
		HeadPortrait,
		Grid,
	},
	methods: {
		loginOut() {
			this.$showModel({
				text: "确认退出登录?",
				cancelText: "取消",
				success: () => {
					localStorage.removeItem("userID")
					this.$router.push({ name: "Login" })
					this.$showToast({
						type: "warn",
						text: "已退出登录",
					})
				},
			})
		},
	},
}
</script>

<style lang="stylus" scope>
.User
  width 100vw
  min-height 100vh
  background-color var(--bg-gray)
  padding-top 0
  button
    margin 15px auto
    padding 10px
    display block
    width 90%
    border-radius 20px
</style>
