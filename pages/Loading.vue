<template>
	<view class="">
		
	</view>
</template>

<script>
	export default{
		onLoad() {
			uni.showLoading({title: '加载中'})
			let UserLoginInfo=global.UserLoginInfo
			if(UserLoginInfo=='')
				//先判断有没有存储登录信息
				uni.reLaunch({
					url:'Login/Login',
					success:()=>{this.showtoast('请先登录','none','../static/warn.png')},
				})
			else
				//通过手机号跟时间戳判断登录是否过期
				uni.request({
					url: 'http://49.232.38.113:4000/InspectLogin',
					method: 'POST',
					data: {
						phone:UserLoginInfo.phone,
						date:UserLoginInfo.date
					},
					success: res => {
						let text=res.data
						console.log(text)
						if(text=='登录信息已过期')
							uni.reLaunch({
								url:'Login/Login',
								success:()=>{this.showtoast(text,'none','../static/warn.png')}
							})
						else
							uni.reLaunch({
								url:'Home',
								success:()=>{this.showtoast(text,'success','')}
							})
					},
					fail: (err) => {console.log(err)}
				})
		},
		methods:{
			showtoast(text,icon,src){
				uni.showToast({
					title: text,
					icon:icon,
					image:src
				})
			}//showtoast结束
		}
	}
</script>

<style>
</style>
