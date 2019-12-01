<script>
	global.UserLoginInfo = uni.getStorageSync('UserLoginInfo')
	global.ScreenWidth = uni.getSystemInfoSync().screenWidth
	global.EquipmentsInfo = []
	global.UserPlans = []
	global.UserMedical = []
	
	/* 登录全局函数,存储用户信息 */
	global.SetLoginIngo=(that,UserLoginInfo,text)=>{
		uni.setStorage({//成功，跳转主界面
			key:"UserLoginInfo",
			data:UserLoginInfo,
			success() {
				uni.hideLoading()
				uni.reLaunch({
					url:'../Home',
					success() {//成功存储数据后，将个人信息赋给全局变量，然后跳转
						global.UserLoginInfo=UserLoginInfo
						global.GetPlans(UserLoginInfo.phone)
						uni.showToast({title: text})}})}
		})//setstory结束
	}
	/* 找回密码/注册请求 */
	global.LoginRequest=(url,data,userinfo,that,text)=>{
		/* 找回密码跟注册的公用请求函数 */
		uni.request({
			url: 'https://jinlongyuchitang.cn:4000'+url,
			// url: 'http://localhost:4000'+url,
			method: 'POST',
			data:data,
			success: res => {
				if(res.data === '该用户不存在')
					that.showtoast('该用户不存在')
				else if(res.data === '用户已存在')
					that.showtoast('用户已存在')
				else{//无错误
					let UserLoginInfo={
						phone:data.phone,
						date:data.date,
						name:userinfo.nickName,
						avatar:userinfo.avatarUrl
					}//记录用户信息
					global.GetEquipments(that,UserLoginInfo,text)//获取用户所有设备信息
				}
			},
			fail: (err) => {console.log(err)},
		})//request结束
	}
	/* 获取设备信息 */
	global.GetEquipments=(that,UserLoginInfo,text='')=>{
		if(text!='')
			global.UserLoginInfo={phone:UserLoginInfo.phone}
		uni.request({
			url: 'https://jinlongyuchitang.cn:4000/GetEquipment',
			method: 'POST',
			data: {
				phone:global.UserLoginInfo.phone,
				ID:'*'
			}, 
			success: res => {
				global.EquipmentsInfo=res.data
				if(text!='')
					global.SetLoginIngo(that,UserLoginInfo,text)
			},
			fail: (err) => {console.log(err)}})
	}
	/* 获取计划信息 */
	global.GetPlans = (phone,back=false,text='') => {
		uni.request({
			url: 'https://jinlongyuchitang.cn:4000/GetPlans',
			method: 'POST',
			data: {phone:phone},
			success: res => {
				global.UserPlans=res.data
				if(back)
					uni.navigateBack({
						url:'../Plans',
						success(){uni.showToast({title: text})}
					})
			},
			fail: (err) => {console.log(err)},
		});
	}

	export default {
		onLaunch: function() {
			if(global.UserLoginInfo){
				global.GetEquipments()//获取用户所有设备信息
				global.GetPlans(global.UserLoginInfo.phone)//获取用户计划信息
				this.GetMedical(global.UserLoginInfo.phone)
			}
		},
		methods:{
			/* 获取药柜信息 */
			GetMedical(phone){
				uni.request({
					url:'https://jinlongyuchitang.cn:4000/MyMedical/GetMedical',
					method:"POST",
					data:{
						phone : phone
					},
					success: (res) => {
						res.data.forEach(item => {
							item.medical = JSON.parse(item.medical)
							global.UserMedical.push(item)
						})		
					},
					fail(err) {console.log(err)}})
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	*{
		box-sizing: border-box;
		font-family: ExtraLight,Microsoft Yahei;
	}
	image{
		height: auto;
	}
	/* 蒙层样式 */
	.mask{
		width:100%;
		height:100%;
		position:fixed;
		background-color:#b2b2b2;
		z-index:99;
		top:0;
		left:0;
		opacity:0.8;
	}
	/* 弹框样式 */
	.Popup{
		background: #FFFFFF;
		width: 90%;
		border-radius: 10px;
		margin-bottom: 10%;
		box-shadow:2px 2px 5px #7b7b7b;
		position: absolute;
		top: 10%;
		left: 5%;
		z-index: 999;
		animation: appear 0.5s ease-out;
	}
	@keyframes appear{
	  0%{
			opacity: 0;
			transform: scale(0);
		}
	  100%{
	  	opacity: 1;
	  	transform: scale(1);
	  }
	}
	/* 弹框样式 */
</style>
