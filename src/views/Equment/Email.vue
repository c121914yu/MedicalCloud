<template>
	<div class="email">
		<i class="iconfont icon-email"></i>
		<p class="center remark"><small>该邮箱将被用于接受用药通知</small></p>
		<form @submit="changeEmail">
			<input type="tel" placeholder="邮箱地址" required v-model="email" />
			<button class="submit" type="submit">更新</button>
		</form>
	</div>
</template>

<script>
import { getEmail } from "../../assets/axios/api"
const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
export default {
	data() {
		return {
			email: "",
		}
	},
	methods: {
		changeEmail(e) {
			e.preventDefault()
			if (!reg.test(this.email))
				this.$showToast({
					type: "warn",
					text: "邮箱格式错误",
				})
			else {
				getEmail(this.email).then((res) => {
					console.log(res.data)
					this.$store.commit("updateEmail", this.email)
					this.$showToast({
						text: "请注意查收",
					})
				})
			}
		},
	},
	created() {
		if (this.$store.getters.getUser.hasOwnProperty("email"))
			this.email = this.$store.getters.getUser.email
	},
}
</script>

<style lang="stylus" scoped>
.email
  padding 0 5%
  padding-top 60px
  display flex
  flex-direction column
  align-items center
  i
    width 70px
    height 70px
    line-height 70px
    text-align center
    font-size 2.4em
    color var(--yellow)
    border var(--border1)
    border-color var(--yellow)
    border-radius 50%
  input
    margin 10px 0
    width 100%
  .random
    display flex
    align-items center
    button
      margin 0 0 0 5px
      padding 5px 10px
      height 36px
      width 150px
      border-radius 5px
      &.ban
        background-color var(--gray)
        &:active
          transform scale(1)
  .submit
    margin 5px 0
</style>
