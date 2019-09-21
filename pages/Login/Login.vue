<template>
	<view>
		<view class="logo">
			<image src="../../static/logo.png" mode="widthFix"></image>
		</view>
		
		<view class="info">
			<image src="../../static/login/phone.png" mode="widthFix"></image>
			<input type="number" placeholder="请输入手机号" v-model="phone" />
			<div style="width: 25px;"></div>
		</view>
		
		<view class="info">
			<image src="../../static/login/password.png" mode="widthFix"></image>
			<input type="text" :password="!showpassword" placeholder="请输入密码" v-model="password" />
			<image class="right" :src="showpassword==true ? '../../static/login/show.png' : '../../static/login/hide.png'" 
					mode="widthFix" @click="showpassword=!showpassword"></image>
		</view>
		
		<button class="login-btn" open-type="getUserInfo" @getuserinfo="Login">登录</button>
		
		<view class="problem">
			<text @click="ForgetPassword">忘记密码</text>
			<text>|</text>
			<text @click="Register">注册用户</text>
		</view>
	</view>
</template>

<script>
	var that
	export default{
		data(){
			return{
				showpassword:false
			}
		},
		onLoad() {
			that=this
		},
		methods:{
			Login(e){
				let userinfo=e.target.userInfo
				
				/* 判断输入内容是否有误 */
				uni.showLoading({title: '登录中'})
				if(/[~#^$@%&!?%*\\/]/gi.test(that.phone))
					that.showtoast('手机号不能含特殊字符')
				else if(/[~#^$@%&!?%*\\/]/gi.test(that.password))
					that.showtoast('密码不能含特殊字符')
				/* 判断输入内容是否有误 */

				else{//输入格式正确再请求服务器，防止端口因特殊字符炸掉
					uni.request({
						url: 'http://49.232.38.113:4000/GetLoginInfo',
						method: 'POST',
						data: {
							phone:that.phone,
							password:that.password
						},
						success: res => {
							let UserLoginInfo=res.data
							if(UserLoginInfo=='用户不存在')
								that.showtoast(UserLoginInfo)
							else if(UserLoginInfo=='密码不正确')
								that.showtoast(UserLoginInfo)
							else{
								UserLoginInfo={...UserLoginInfo,name:userinfo.nickName,avatar:userinfo.avatarUrl}
								global.GetEquipments(that,UserLoginInfo,'登录成功')
							}
						},
						fail: (err) => {console.log(err)}
					});
				}
			},//login结束
			ForgetPassword(){
				uni.navigateTo({
					url: 'FindPassword'})
			},
			Register(){
				uni.navigateTo({
					url:'Register'})
			},
			showtoast(alert){//提示错误信息
				uni.hideLoading()
				uni.showToast({
					title: alert,
					image:'../../static/error.png'
				});
			}
		}//methods结束
	}
</script>

<style>
	body{
		box-sizing: border-box;
	}
	.logo{	
		/* logo样式 */
		padding-top: 10%;
		margin-bottom: 10px;
		display: flex;
		justify-content: center;
	}
	.logo image{
		width: 25%;
		height: auto;
		border-radius: 50%;
	}
	.info{
		/* 输入框样式 */
		width: 85%;
		height: 50px;
		border-bottom: 1px solid rgba(230,230,230,1);
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.info image{
		width: 25px;
		height: auto;
	}
	.info input{
		width: 75%;
		color: #737376;
	}
	.info .right{
		/* 显示和隐藏密码 */
		z-index: 9999;
		height: auto;
	}
	.login-btn{       
		/*登录按键*/
		/* background:linear-gradient(-90deg,rgba(63,205,235,1),rgba(188,226,158,1)); */
		background:linear-gradient(left,rgba(63,205,235,1),rgba(16,48,233,1));
		color: #FFFFFF;
		border-radius: 40px;
		width: 80%;
		margin: auto;
		margin-top: 15px;
	}
	.problem{
		/* 忘记密码/注册用户 */
		color: #FFA800;
		width: 45%;
		font-size: 17px;
		margin: 15px auto;
		text-align: center;
		display: flex;
		justify-content: space-between;
	}
</style>
