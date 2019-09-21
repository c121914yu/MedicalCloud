<template>
	<view class="set-medical" v-if="show">
		<view class="mask"></view>
		
		<view class="Popup">
			<view class="Title">药柜编号:{{InitialInfo.MedicalIndex+1}}</view>
			
			<!-- 药物信息 -->
			<view class="info">
				<view style="color: #088573;">药&emsp;名:</view>
				<textarea placeholder-class="palaceholder" placeholder="输入小药盒中药物名称" auto-height="true"
					v-model="InitialInfo.MedicalInfo[InitialInfo.MedicalIndex].name"/>
			</view>	
			
			<view class="info">
				<view style="color: #088573;">备&emsp;注:</view>
				<textarea placeholder-class="palaceholder" placeholder="给设备写个备注" auto-height="true"
					v-model="InitialInfo.MedicalInfo[InitialInfo.MedicalIndex].remark"/>
			</view>	

			<view class="Btn">
				<view style="color: #cd2d2d;" @click="CloseMask">取消</view>
				<text style="color: rgba(174,174,174,0.6);">|</text>
				<view style="color: #088573;" @click="SureInfo">确认</view>
			</view>
			
		</view>	
	</view>
</template>

<script>
	export default{
		methods:{
			SureInfo(){//确认按键	
				let change=false
				let NewInfo=this.InitialInfo.MedicalInfo[this.InitialInfo.MedicalIndex]
				let StaticInfo=this.StaticInfo
				if(NewInfo.name!=StaticInfo.name)
					change=true
				else if(NewInfo.remark!=StaticInfo.remark)
					change=true
				if(change){
					uni.showModal({
						title: '提示',
						content: '您修改了药物信息',
						success: res => {
							if(res.confirm){
								uni.showLoading({title:'修改药柜内容中'})		
								let MedicalInfo=JSON.stringify(this.InitialInfo.MedicalInfo) 
								uni.request({
									url: 'http://49.232.38.113:4000/SetMedicalInfo',
									method: 'POST',
									data: {
										MedicalInfo,
										ID:this.InitialInfo.EquipmentID
									},
									success: res => {
										global.EquipmentsInfo[this.InitialInfo.EquipIndex].MedicalInfo=MedicalInfo
										this.CloseMask()
										this.$emit('UpdateMedicals',this.InitialInfo.MedicalInfo)
										uni.hideLoading()
										this.ShowToast('修改成功')
									},
									fail: (err) => {console.log(err)}})				
							}//confirm结束
						}
					})//showmodal结束
				}	
				else
					this.CloseMask()
			},
			CloseMask(){//关闭蒙层
				this.$emit('CloseSet',false);
			},
			ShowToast(text,url=''){//提示错误信息
				uni.showToast({
					title:text,
					image:url})
			}
		},
		props:{
			show:Boolean,
			InitialInfo:Object,
			StaticInfo:Object,
		}
	}
</script>

<style>
	.Title{
		color: #929191;
		text-align: center;
	}
	/* 药品信息样式 */
	.info{
		width: 95%;
		margin: 10px auto;
	}
	.info textarea{
		color: #696767;
		margin-top: 5px;
		padding: 8px 0 8px 8px;
		border: 1px solid #088573;
		border-radius: 10px;
	}
	.palaceholder{
		color: #858181;
		font-size: 17px;
	}
	/* 药品信息样式 */
	/* 确认/取消按键 */
	.Btn{
		margin: 20px 0 10px 0;
		display: flex;
	}
	.Btn view{
		width: 50%;
		text-align: center;
	}
</style>
