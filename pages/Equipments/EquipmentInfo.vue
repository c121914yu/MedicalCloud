<!-- 设备的基本信息(标识码，图片，名称，备注) -->
<template>
	<view>
		<view class="info">
			<text space="emsp">类 型:</text>
			<picker class="content palaceholder" mode="selector" v-model="kind"
				:range="kinds" :value="index" @change="ChooseKind" :disabled="info.change">
				<view>{{kinds[index]}}</view>
			</picker>
		</view>
		
		<view class="info">
			<text>标识码:</text>
			<input class="content" type="text" placeholder-class="palaceholder" placeholder="请输入设备标识码"
				v-model="info.EquipmentInfo.ID"  :disabled="info.change"/>
		</view>
		
		<view class="info">
			<text space="emsp">名 称:</text>
			<input class="content" type="text" placeholder-class="palaceholder" placeholder="请给设备取个名称"
				v-model="info.EquipmentInfo.name" maxlength="10"/>
		</view>
		
		<view class="remark">
			<text style="margin-left: 5px;">备注</text>
			<textarea placeholder-class="palaceholder" placeholder="给设备写个备注"
				v-model="info.EquipmentInfo.remark" auto-height="true"/>
		</view>
		
		<button @click="ClickButton">{{info.BtnText}}</button>
	</view>
</template>

<!-- 由于异步问题不方便使用生命周期，直接绑定父级传来的值，异步完成后自动会修改
	-->
<script>
	var parent,Equipment
	export default{
		data(){
			return{
				kinds:['药盒','手环'],
				index:0,
			}
		},
		methods:{
			ChooseKind(e){
				this.index=e.detail.value
			},
			ClickButton(){
				uni.showLoading({title: parent.LoadingText})
				/* Equipment等于界面中设备信息 */
				Equipment=this.info.EquipmentInfo
				let Info
				/* 判断是新建还是修改，创建不同post数据 */
				if(parent.change)//修改界面的
					Info={
						name:Equipment.name,
						remark:Equipment.remark,
						ID:Equipment.ID
					}
				else//新增界面的
					Info={
						phone:global.UserLoginInfo.phone,
						ID:Equipment.ID,
						name:Equipment.name,
						kind:this.kinds[this.index],
						remark:Equipment.remark,
						condition:"正常",
						MedicalInfo:this.MedicalInfo()
					}
				/* 判断是否有未填写内容 */
				if(!Equipment.ID)
					this.showtoast('请输入设备标识码')
				else if(!Equipment.name)
					this.showtoast('请给设备取个名字')
				else{
					uni.request({
						url:parent.PostSrc,
						method:"POST",
						data:Info,
						success:res => {
							if(res.data=='标识码错误')
								this.showtoast(res.data)
							else if(res.data=='修改成功'){
								let index=this.info.index
								this.showtoast(parent.SuccessText,'')
								global.EquipmentsInfo[index].name=Info.name
								global.EquipmentsInfo[index].remark=Info.remark
							}						
							else if(res.data=="添加设备成功"){
								global.EquipmentsInfo.push(Info)
								uni.navigateBack({
									delta: 1,
									success:res=>{this.showtoast(parent.SuccessText,'')}})
							}	
						},//request请求成功结束
						fail: (err) => {console.log(err)}})
				}
			},//clickBtn结束
			/* 添加设备时生成初始药物信息 */
			MedicalInfo(){
				let MedicalInfo=new Array
				for(let i=0;i<4;i++)
					MedicalInfo.push([{
						name:'',
						amount:'',
						remark:''
					}])
				return JSON.stringify(MedicalInfo)
			},
			/* 提示错误信息 */
			showtoast(alert,src='../../static/error.png'){
				uni.hideLoading()
				uni.showToast({
					title: alert,
					icon:'success',
					image:src
				});
			}
		},
		beforeMount(){
			parent=this.info
		},
		props:{
			info:Object,
		}
	}
</script>

<style scoped>
	/* 设备信息样式 */
	.info{	
		width: 94%;
		height: 40px;
		margin: 10px auto;
		border: 1px solid #cbcdcf;
		border-radius: 10px;
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
		font-size: 15px;
	}
	.remark{
		width: 94%;
		margin: 10px auto;
	}
	.remark textarea{
		color: #696767;
		width: 97%;
		min-height: 30px;
		margin-top: 5px;
		padding: 5px 0 5px 5px;
		border: 1px solid #cbcdcf;
		border-radius: 10px;
	}
	/* 设备信息样式 */
	button{
		background:linear-gradient(-90deg,rgba(63,205,235,1),rgba(188,226,158,1));
		color: #FFFFFF;
		border-radius: 40px;
		width: 90%;
		margin: 5px auto;
	}
</style>
