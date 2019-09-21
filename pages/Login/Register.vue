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
			<input type="text" :password="!showpassword" placeholder="请输入密码" maxlength="12" v-model="password" />
			<image class="right" :src="showpassword==true ? '../../static/login/show.png' : '../../static/login/hide.png'" 
					mode="widthFix" @click="showpassword=!showpassword"></image>
		</view>
		
		<view class="info">
			<image src="../../static/login/password.png" mode="widthFix"></image>
			<input type="text" :password="!showpassword" placeholder="请再次输入密码" maxlength="12" v-model="sure_password" />
			<div style="width: 25px;"></div>
		</view>
		
		<view class="info">
			<image  src="../../static/login/checkrand.png" mode="widthFix"></image>
			<input type="number" maxlength=6 placeholder="输入验证码" v-model="rand"/>
			<div style="width: 25px;"></div>
			<view class="getrand" :class="{ wait: second>0 }" @click="getrand">{{SendRand}}</view>
		</view>
		
		<button class="register-btn" open-type="getUserInfo" @getuserinfo="Register">注册</button>
	</view>
</template>

<script>
	var that,time
	export default{
		data(){
			return{
				showpassword:false,
				second:0,
				phone:'',
				password:'',
				sure_password:'',
				rand:''
			}
		},
		onLoad() {
			that=this
		},
		computed:{
			SendRand(){//判断获取验证码框的值，返回不同文本
				if(this.second==0)
					return '获取验证码'
				else
					if(this.second<10)
						return '重新获取0'+this.second
					else
						return '重新获取'+this.second
			}
		},
		methods:{
			getrand(){//获取验证码
				if(that.second==0)
				{
					if(that.phone=='')
						that.showtoast('手机号码为空')
					else if(!(/^1(3|4|5|7|8)\d{9}$/.test(that.phone))) 
					  that.showtoast('手机号码不正确')
					else{	//手机号正确，发送验证码并倒计时
						that.second =10;
						//后台发短信的代码
						time=setInterval(()=>{//setInterval可以重复计时,直到clearInterval
							that.second--;
							if(that.second==0){
								clearInterval(time)
							}
						},1000)
					}//else判断手机号结束	
				}
			},//getrand结束
			
			Register(e){//注册按键
				let userinfo=e.target.userInfo
				/* 判断输入内容是否有误 */
				if(that.phone=='')
					that.showtoast('手机号码不能为空')
				else if(!(/^1(3|4|5|7|8)\d{9}$/.test(that.phone))) 
				  that.showtoast('手机号码不正确')
				else if(this.password=='')
					that.showtoast('请输入密码')
				else if(this.sure_password=='')
					that.showtoast('请再次输入密码')
				else if(this.password.length<6)
					that.showtoast('密码长度至少6位')
				else if(this.password!=this.sure_password)
					that.showtoast('两次密码不一致')
				else if(this.rand=='')
					that.showtoast('请输入验证码')
				/* 判断输入内容是否有误 */
				
				else{//输入内容符合格式，请求服务器
					/* 发送验证码跟手机到后台代码 */
					if(1){//验证码正确
						uni.showLoading({title: '注册中'});
						let date=new Date().toLocaleDateString()+','+new Date().toLocaleTimeString('chinese', { hour12: false })
						let data={
								phone:that.phone,
								password:that.password,
								date:date
						}
						global.LoginRequest('/UserRegister',data,userinfo,that,'注册成功')
					}  
					else
						console.log('验证码错误')
				}//请求服务器结束
			},//Register函数结束
			
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
	.info:first-child{
		padding-top: 30px;
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
		padding-left: 10px;
		color: #737376;
	}
	.info .right{
		/* 显示和隐藏密码 */
		z-index: 9999;
		height: auto;
	}
	.getrand{
		/*获取验证码按键*/
		color: #FF7D13;
		font-size: 15px;
		width:35%;
		height:30px;
		border:1px solid rgba(255,168,0,0.8);
		border-radius: 20px;
		line-height: 30px;
		text-align: center;
		position: absolute; 
		right: 20px;
		z-index: 9999;
	}
	.wait{			
		/*等待重新获取*/
		color: #999999 !important;
		border:1px solid #999999;
	}
	.register-btn{       
		/*修改按键*/
		background:linear-gradient(left,rgba(63,205,235,1),rgba(16,48,233,1));
		color: #FFFFFF;
		border-radius: 40px;
		width: 80%;
		margin: auto;
		margin-top: 15px;
	}
</style>
