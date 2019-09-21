<template>
	<view class="set-medical" v-if="show">
		<view class="mask"></view>
		
		<view class="Popup">
			<image class="close" src="../../static/close.png" mode="widthFix" @click="CloseMask"/>
			<view class="Title">{{InitialInfo.EquipmentName}}储药情况</view>
			<view class="Title">药柜编号:{{InitialInfo.MedicalIndex+1}}</view>
			
			<!-- 药物信息 -->
			<view class="info">
				<text space="emsp">名 称:</text>
				<input class="content" type="text" placeholder-class="palaceholder" placeholder="药品名称"
					v-model="InitialInfo.MedicalInfo[InitialInfo.MedicalIndex].name"/>
			</view>
			<view class="info">
				<text space="emsp">数 量:</text>
				<input class="content" type="text" placeholder-class="palaceholder" placeholder="药品数量"
					v-model="InitialInfo.MedicalInfo[InitialInfo.MedicalIndex].amount"/>
			</view>
			
			<view class="remark">
				<text>备注</text>
				<textarea placeholder-class="palaceholder" placeholder="给设备写个备注"
					v-model="InitialInfo.MedicalInfo[InitialInfo.MedicalIndex].remark" cursor="5"/>
			</view>	
			
			<button class="sure-info" @click="SureInfo">确认信息</button>
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
				else if(NewInfo.amount!=StaticInfo.amount)
					change=true
				else if(NewInfo.remark!=StaticInfo.remark)
					change=true
				if(change){
					/* 只写了名称没写数量 */
					if(NewInfo.name!="" && NewInfo.amount=="")
						this.ShowToast('数量不能为空','../../static/error.png')
					else if(NewInfo.name=="" && NewInfo.amount!="")
						this.ShowToast('药名不能为空','../../static/error.png')
					else
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
	.close{
		width: 35px;
		position: absolute;
		margin-top: 5px;
		margin-left: 83%;
	}
	.Title{
		text-align: center;
	}
	/* 药品信息样式 */
	.info{
		width: 90%;
		height: 40px;
		margin: 10px auto;
		border: 1px solid #cbcdcf;
		border-radius: 20px;
		display: flex;
		align-items: center;
	}
	.info text{
		margin-left: 10px;
	}
	.info .content{
		color: #696767;
		width: 70%;
		margin-left: 15px;
	}
	.palaceholder{
		color: #858181;
		font-size: 17px;
	}
	.remark{
		width: 90%;
		margin: 10px auto;
	}
	.remark textarea{
		color: #696767;
		width: 93%;
		height: 100px;
		margin: 10px 0 0 0px;
		padding: 8px;
		border: 1px solid #cbcdcf;
		border-radius: 15px;
	}
	/* 药品信息样式 */
	/* 确认案件 */
	.sure-info{
		background:linear-gradient(-90deg,rgba(63,205,235,1),rgba(188,226,158,1));
		color: #FFFFFF;
		border-radius: 40px;
		width: 90%;
		margin: 5px auto;
	}
</style>
