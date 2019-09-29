<template>
	<view>
		<view class="mask"></view>
		
		<view class="Popup">
			<view class="Title">药柜编号:{{InitialInfo.MedicalIndex+1}}</view>
			<view class="remark">
				点击加号可以添加更多药物,长按药物可以删除。
			</view>
			
			<!-- 药物信息 -->
			<view class="info" v-for="(info,index) in medicines" :key="index" @longpress="RemoveName(index)">
				<text>药物{{index+1}}：</text>
				<input type="text" placeholder-class="palaceholder" placeholder="请输入药名" 
					v-model="info.name"/>
			</view>
			<image class="Add" @click="AddName"
				src="../../static/Plans/AddTime.png" mode="widthFix"/>
			
			<!-- 药物信息 -->
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
			let medicines = this.InitialInfo.MedicalInfo[this.InitialInfo.MedicalIndex]
			return{
				medicines : medicines
			}
		},
		methods:{
			AddName(){//添加药
				this.medicines.push({
					name : '',
					amount : '',
					remark : ''
				})
			},
			RemoveName(index){
				if(this.medicines.length>1)
					this.medicines.splice(index,1)
			},
			SureInfo(){//确认按键	
				/*  对names去掉空的项,且至少保留一项*/
				let NewInfo = []
				NewInfo=this.medicines.filter(item => {
						return item.name != ''
				})
				if(NewInfo.length == 0)
					NewInfo = [{
						name : '',
						amount : '',
						remark : ''
					}]
									
				uni.showModal({
					title: '提示',
					content: '确定保存信息?',
					success: res => {
						if(res.confirm){	
							uni.showLoading({title:'正在保存信息'})
							/* 修改MedicalInfo，整体返回给数据库 */
							this.InitialInfo.MedicalInfo[this.InitialInfo.MedicalIndex] = NewInfo
							let MedicalInfo=JSON.stringify(this.InitialInfo.MedicalInfo) 
							
							uni.request({
								url: 'http://49.232.38.113:4000/SetMedicalInfo',
								method: 'POST',
								data: {
									MedicalInfo,
									ID:this.InitialInfo.EquipmentID
								},
								success: res => {
									global.EquipmentsInfo[this.InitialInfo.EquipIndex].MedicalInfo = MedicalInfo
									this.$emit('UpdateMedicals',this.InitialInfo.MedicalInfo)//更新设备详细的药柜信息
									uni.hideLoading()
									this.ShowToast('修改成功')
									this.CloseMask()//关闭弹窗
								},
								fail: (err) => {console.log(err)}})				
						}//confirm结束
					}
				})//showmodal结束
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
			InitialInfo:Object,
		}
	}
</script>

<style scoped>
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
	.info input{
		/* 让input填充剩余位置 */
		padding-right: 5px;
		flex-grow: 1;
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
