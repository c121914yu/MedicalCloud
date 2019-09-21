<template>
	<view class="set-medical" v-if="show">
		<view class="mask"></view>
		
		<view class="Popup">
			<view class="Title">药柜编号:{{InitialInfo.MedicalIndex+1}}</view>
			<view class="remark">
				点击加号可以添加更多药物,长按药物可以删除。
			</view>
			
			<!-- 药物信息 -->
			<!-- <view class="info">
				<view style="color: #088573;">药&emsp;名:</view>
				<textarea placeholder-class="palaceholder" placeholder="输入小药盒中药物名称" auto-height="true"
					v-model="InitialInfo.MedicalInfo[InitialInfo.MedicalIndex].names"/>
			</view>	 -->
			<view class="info" v-for="(name,index) in names" :key="index" @longpress="RemoveName(index)">
				<text>药物{{index+1}}：</text>
				<input type="text" placeholder-class="palaceholder" placeholder="请输入药名" 
					v-model="names[index]"/>
			</view>
			<image class="Add" @click="AddName"
				src="../../static/Plans/AddTime.png" mode="widthFix"/>
			
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
		data(){
			return{
				names:['']
			}
		},
		methods:{
			AddName(){//添加药
				this.names.push('')
			},
			RemoveName(index){
				if(this.names.length>1)
					this.names.splice(index,1)
			},
			SureInfo(){//确认按键	
				let change=false
				let NewInfo=this.InitialInfo.MedicalInfo[this.InitialInfo.MedicalIndex]
				let StaticInfo=this.StaticInfo
				
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
	body{
		font-size: 17px;
	}
	.Title{
		color: #343434;
		text-align: center;
	}
	.remark{
		color: #929191;
		text-align: center;
		font-size: 13px;
	}
	/* 药品信息样式 */
	.info{
		color: #343434;
		background: #fdd930;
		width: 90%;
		border-radius: 5px;
		margin: 5px auto;
		padding: 10px 0 10px 5px;
		display: flex;
		align-items: center;
	}
	.palaceholder{
		font-size: 15px;
	}
	.Add{
		width: 12%;
		margin-left: 5%;
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
