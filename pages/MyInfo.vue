<template>
	<view class="MyInfo">
		<view class="wxInfo">
			<view class="avatar">
				<image :src="UserAvatar" mode="widthFix"></image>
			</view>
			<text style="color: #088573;">{{UserName}}</text>
		</view>
		
		<navigator class="info" url="Plans/Record" hover-class="none">
			<text>用药记录</text>
			<image src="../static/to_right.png" mode="widthFix"></image>
		</navigator>
		
		<navigator class="info" url="MyPage/searchMedical" hover-class="none">
			<text>药物查询</text>
			<image src="../static/to_right.png" mode="widthFix"></image>
		</navigator>
		
		<navigator class="info" url="Plans/MyPlans" hover-class="none">
			<text space="emsp">我的计划</text>
			<text class="amount">{{PlanAmount}}</text>
			<image src="../static/to_right.png" mode="widthFix"></image>
		</navigator>
		
		<navigator class="info" url="MyPage/MyMedicines" hover-class="none">
			<text space="emsp">我的药柜</text>
			<text class="amount">{{MedicalAmount}}</text>
			<image src="../static/to_right.png" mode="widthFix"></image>
		</navigator>
		
		<view class="info">
			<text>我的设备</text>
			<text class="amount">{{EquipmentAmount}}</text>
		</view>
		
		<button class="LogOut" @click="LogOut">退出登录</button>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				UserAvatar:global.UserLoginInfo.avatar,
				UserName : global.UserLoginInfo.name,
				PlanAmount : 0,
				MedicalAmount : 0,
				EquipmentAmount : 0,
			}
		},
		onShow() {
			uni.showLoading({title:'加载中...'})
			this.PlanAmount = global.UserPlans.length
			this.MedicalAmount = global.UserMedical.length
			this.EquipmentAmount = global.EquipmentsInfo.length
			uni.hideLoading()
		},
		methods:{
			LogOut(){//退出登录
				uni.showModal({
					title: '提示',
					content: '确定退出登录?',
					success: res => {
						if(res.confirm)
							uni.removeStorage({
								key:"UserLoginInfo",
								success: () => {
									uni.reLaunch({
										url:'Login/Login',
										success:()=>{this.showtoast('请重新登录','none','../static/warn.png')},
									})}
							})}
				})
			},//LogOut结束
			/*提示*/
			showtoast(text,icon,src){
				uni.showToast({
					title: text,
					icon:icon,
					image:src})
			},
		}//methods结束
	}
</script>

<style>
	.MyInfo{
		background: #FFFFFF;
		width: 90%;
		border-radius: 10px;
		box-shadow:2px 2px 5px #7b7b7b;
		margin: 20px auto;
		padding-bottom: 10px;
	}
	.wxInfo{
		display: flex;
		align-items: center;
	}
	.wxInfo .avatar{
		width: 80px;
		height: 80px;
		margin: 10px 20px 10px 10px;
	}
	.wxInfo .avatar image{
		width: 100%;
		border-radius: 50%;
	}
	
	.info{
		color: #b3b3b3;
		width: 90%;
		margin: 0 auto;
		padding: 7px 5px;
		border-top: 1px dotted #c8c8c8;
		position: relative;
	}
	.info:active{
		background: rgba(212,212,212,0.4);
	}
	.info .amount{
		color: #088573;
		margin-left: 10px;
	}
	.info image{
		width: 17px;
		position: absolute;
		right: 10px;
	}
	
	.LogOut{
		background:linear-gradient(-90deg,rgba(63,205,235,1),rgba(188,226,158,1));
		color: #FFFFFF;
		border-radius: 40px;
		width: 90%;
		border: none;
		margin: 10px auto;
	}
</style>
