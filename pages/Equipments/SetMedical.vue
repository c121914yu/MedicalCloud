<template>
	<view>
		<view class="mask"></view>
		
		<view class="Popup">
			<view class="Title">
				<text>药柜编号:{{InitialInfo.MedicalIndex+1}}</text>
			</view>
			<view v-if="InitialInfo.active === true" class="remark">该药柜含计划,修改后请注意核对</view>
			<view v-else-if="InitialInfo.active === 'plan'" class="remark">该药柜可能含其他计划,修改后请注意核对</view>
			
			<!-- 药物信息 -->
			<view class="medical">
				<view class="info">
					<text>药名：</text>
					<input type="text" v-model="medicines[page].name" placeholder="输入药物名称"/>
				</view>
				<image class="line" src="../../static/Plans/line.png"/>
				
				<view class="info">
					<text>数量：</text>
					<input type="number" v-model="medicines[page].amount" placeholder="输入用药数量"/>
				</view>
				<image class="line" src="../../static/Plans/line.png"/>
				
				<h2>备注:</h2>
				<textarea 
					placeholder="可以备注些注意事项噢" 
					v-model="medicines[page].remark"/>
			</view>
			
			<view style="text-align: center;">药物{{page+1}}</view>
			
			<view class="icon">
				<uni-icons type="back" size="30" :color="'#088573'" @click="last"></uni-icons>
				<uni-icons type="trash" size="30" :color="'#929191'" @click="RemoveName"></uni-icons>
				<uni-icons v-if="page === medicines.length-1" type="plusempty" size="30" :color="'#088573'" @click="AddName"></uni-icons>
				<uni-icons v-else type="forward" size="30" :color="'#088573'" @click="page++"></uni-icons>
			</view>
			
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
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	
	export default{
		data(){
			let medicines = this.InitialInfo.MedicalInfo[this.InitialInfo.MedicalIndex]
			return{
				page : 0,
				medicines : medicines
			}
		},
		methods:{
			last(){
				if(this.page > 0)
					this.page--
			},
			AddName(){//添加药
				this.medicines.push({
					name : '',
					amount : '',
					remark : ''
				})
				this.page++
			},
			RemoveName(){
				this.medicines.splice(this.page,1)
				if(this.medicines.length === 0)
					this.medicines = [{
						name : '',
						amount : '',
						remark : ''
					}]	
				if(this.page != 0)
					this.page--
				else	
					this.page = 0
			},
			SureInfo(){//确认按键	
				let error = false
				/*  对names去掉空的项,且至少保留一项*/
				let NewInfo = []
				NewInfo=this.medicines.filter((item,index) => {
					if(item.name != '' && item.amount ===''){
						error = true
						this.ShowToast('数量不能为空','../../static/error.png')
						this.page = index
					}
					else if((item.name ==='' && item.amount != '') || (item.name ==='' && item.remark != '')){
						error = true
						this.ShowToast('药名不能为空','../../static/error.png')
						this.page = index
					}
					return item.name != ''
				})
				
				if(NewInfo.length === 0)
					NewInfo = [{
						name : '',
						amount : '',
						remark : ''
					}]
				
				if(!error)//输入信息无误				
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
		},
		components:{
			uniIcons
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
		position: relative;
	}
	
	.remark{
		color: #da1a1a;
		font-size: 12px;
		text-align: center;
	}
	/* 分割线样式 */
	.line{
		width: 90%;
		height: 1px;
		position: absolute;
	}
	/* 药品信息样式 */
	.medical{
		font-size: 17px;
		width: 90%;
		margin: 5px auto;
	}
	.medical .info{
		height: 40px;
		display: flex;
		align-items: center;
	}
	.medical .info input{
		flex: 1;
	}
	.medical h2{
		line-height: 1.8;
	}
	.medical textarea{
		color: #696767;
		height: 60px;
		width: 95%;
		padding: 5px;
		border: 1px solid #088573;
		border-radius: 10px;
	}
	/* 药品信息样式 */
	/* 图标样式 */
	.icon{
		width: 40%;
		margin: 5px auto;
		display: flex;
		justify-content: space-between;
	}
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
