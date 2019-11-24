<template>
	<view>
		<!-- 药物主体 -->
		<view 
			class="medical"
			v-for="(medical,index) in Medicines"
			:key="index"
		>
			<view class="set">
				<view class="change" @click="SetMedical(index)">编辑</view>
				<view class="remove" @click="remove(index)">删除</view>
			</view>
			
			<view>
				<text class="lable">药名：</text>
				<text class="content">{{medical.medical.name}}</text>
			</view>
			<view>
				<text class="lable">用量：</text>
				<text class="content">{{medical.medical.amount}}</text>
			</view>
			<view>
				<text class="lable">备注：</text>
				<text class="content">{{medical.medical.remark}}</text>
			</view>
		</view>
		
		<!-- 添加药物弹窗 -->
		<view 
			class="Popup"
			v-if="AddMedical"
		>
		<view class="AddMedical">
			<view class="info">
				<text>药名：</text>
				<input type="text" v-model="name" placeholder="输入药物名称"/>
			</view>
			<image class="line" src="../../static/Plans/line.png"/>
				
			<view class="info">
				<text>数量：</text>
				<input type="number" v-model="amount" placeholder="输入用药数量"/>
			</view>
			<image class="line" src="../../static/Plans/line.png"/>
			
			<h2>备注:</h2>
			<textarea 
				placeholder="可以备注些注意事项噢" 
				v-model="remark"/>
			<view class="Btn">
				<view style="color: #cd2d2d;" @click="ClosePop">取消</view>
				<text style="color: rgba(174,174,174,0.6);">|</text>
				<view style="color: #088573;" @click="SureAdd">确认</view>
			</view>
		</view>
		</view>
		
		<view class="mask" v-if="AddMedical"></view>
		
		<image
			class="Add" 
			src="../../static/Plans/AddPlan.png" 
			mode="widthFix"
			@click="AddMedical=true"
		/>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				AddMedical : false,
				url : 'AddMedical',
				index : 0,
				ID : '',
				
				Medicines : global.UserMedical,
				
				name : '',
				amount : '',
				remark : ''
			}
		},
		methods: {
			GetMedical(){
				this.Medicines = global.UserMedical
			},
			SetMedical(index){//编辑药柜
				const medical = this.Medicines[index]
				this.name = medical.medical.name
				this.amount = medical.medical.amount
				this.remark = medical.medical.remark
				this.AddMedical = true
				this.url = 'ChangeMedical'
				this.index = index
				this.ID = medical.ID
			},
			remove(index){//删除药柜
				uni.showModal({
					title: '提示',
					content: '确认删除该药物?',
					success: res => {
						if(res.confirm){
							uni.showLoading({title: '删除中...'})
							const ID = this.Medicines[index].ID
							uni.request({
								url:'https://jinlongyuchitang.cn:4000/MyMedical/Remove',
								method:"POST",
								data:{
									ID : ID
								},
								success: (res) => {
									if(res.statusCode === 200){
										global.UserMedical.splice(index,1)
										this.GetMedical()
										this.ShowToast('删除药物成功')
									}
									else
										this.ShowToast('删除失败','../../static/error.png')
								},
								fail(err) {console.log(err)},
								complete() {uni.hideLoading()}
							})
						}
					}
				})
			},
			SureAdd(){//确认添加
				if(this.name === '')
					this.ShowToast('药名不能为空','../../static/error.png')
				else if(this.amount === '')
					this.ShowToast('数量不能为空','../../static/error.png')
				else{
					uni.showLoading({title: '稍等片刻...'})
					const medicalInfo = {
						name : this.name,
						amount : this.amount,
						remark : this.remark
					}
					//网络请求
					uni.request({
						url:'https://jinlongyuchitang.cn:4000/MyMedical/'+this.url,
						method:"POST",
						data:{
							phone : global.UserLoginInfo.phone,
							medical : JSON.stringify(medicalInfo),
							ID : this.ID
						},
						success: (res) => {
							if(res.statusCode === 200){
								if(res.data === '修改成功'){
									global.UserMedical[this.index].medical = medicalInfo
									this.GetMedical()
									this.ShowToast('修改成功...')
								}
								else{
									global.UserMedical.push({
										medical : medicalInfo,
										ID : res.data
									})
									this.GetMedical()
									this.ShowToast('添加成功...')
								}	
							}
							else
								this.ShowToast('添加失败','../../static/error.png')
						},
						fail(err) {console.log(err)},
						complete:() => {
							uni.hideLoading()
							this.AddMedical = false
							this.url = 'AddMedical'
							this.name = ''
							this.amount = ''
							this.remark = ''
						}
					})	
				}
			},
			ClosePop(){
				this.name = ''
				this.amount = ''
				this.remark = ''
				this.url = 'AddMedical'
				this.AddMedical = false
			},
			ShowToast(text,url=''){//提示错误信息
				uni.showToast({
					title:text,
					image:url})
			}
		},//methods结束
	}
</script>

<style scoped>
	body{
		background: rgba(225,225,225,0.8);
		font-size: 17px;
	}
	/* 药物信息 */
	.medical{
		width: 90%;
		min-height: 50px;
		background: #088573;
		box-shadow: 2px 2px 2px #b1b1b1;
		border-radius: 5px;
		margin: 10px auto;
		padding: 10px;
	}
	.medical .lable{
		color: #f3f3f3;
	}
	.medical .content{
		color: #fdd930;
	}
	.medical view{
		width: 80%;
	}
	.medical .set{
		font-size: 20px;
		position: absolute;
		margin-top: -5px;
		margin-left: 80%;
		line-height: 2;
	}
	.medical .set .change{
		color: #fdd930;
	}
	.medical .set .remove{
		color: #e64340;
		position: relative;
		bottom: 0;
	}
	
	.Add{
		width: 50px;
		position: fixed;
		right: 2%;
		bottom: 5%;
		z-index: 999;
	}
	
	/* 分割线样式 */
	.line{
		width: 90%;
		height: 1px;
		position: absolute;
	}
	
	/* 添加药物样式 */
	.AddMedical{
		font-size: 17px;
		width: 90%;
		margin: 5px auto;
	}
	.AddMedical .info{
		height: 40px;
		display: flex;
		align-items: center;
	}
	.AddMedical .info input{
		flex: 1;
	}
	.AddMedical h2{
		line-height: 1.8;
	}
	.AddMedical textarea{
		color: #696767;
		height: 60px;
		width: 95%;
		padding: 5px;
		border: 1px solid #088573;
		border-radius: 10px;
	}
	.AddMedical .Btn{
		margin: 20px 0 10px 0;
		display: flex;
	}
	.AddMedical .Btn view{
		width: 50%;
		text-align: center;
	}
</style>
