<!-- 弹窗选择 -->
<template>
	<view class="Picker">
		<view class="mask"></view>
		
		<view class="Popup">
			<!-- 选中的提示文字 -->
			<view class="CurrentText">
				{{CurrentText=='' ? InitialText:CurrentText}}
			</view>
			
			<picker-view :value="value" @change="PickerChange">
				<picker-view-column>
					<view v-for="(item,index) in Items1" :key="index">
						{{item}}
					</view>
				</picker-view-column>
				<picker-view-column v-if="Items2.length">
					<view v-for="(item,index) in Items2" :key="index">
						{{item}}
					</view>
				</picker-view-column>
				<picker-view-column v-if="Items3.length">
					<view v-for="(item,index) in DayList.length>0? DayList:Items3" :key="index">
						{{item}}
					</view>
				</picker-view-column>
			</picker-view>
						
			<!-- 不需要设备时设置用药时间特有输入框 -->
			<view class="UseTime" v-if="(type=='添加时间' || type=='修改时间') && EquipmentIndex[0] === 0">
				<view>
					<view class="info">
						<text>药名{{page+1}}：</text>
						<input class="content" type="text" v-model="Medicines[page].name" placeholder="药物名称" />
					</view>
					<image class="line" src="../../static/Plans/line.png"/>
					
					<view class="info">
						<text space="ensp">数 量：</text>
						<input type="number" v-model="Medicines[page].amount" placeholder="服用药物数量"/>
					</view>
					<image class="line" src="../../static/Plans/line.png"/>
					
					<h2>备注:</h2>
					<textarea placeholder="可以备注些注意事项噢"
						v-model="Medicines[page].remark"/>
				</view>		
				
				<view class="selcet-from-medical" @click="selectMedical=true">从药柜中选择</view>
				<selcet-from-medical v-if="selectMedical" @close="ClosePop" @finishSelect="finishSelect"></selcet-from-medical>

				<view class="icon">
					<uni-icons type="back" size="30" :color="'#088573'" @click="last"></uni-icons>
					<uni-icons type="trash" size="30" :color="'#929191'" @click="RemoveMedical"></uni-icons>
					<uni-icons v-if="page === Medicines.length-1" type="plusempty" size="30" :color="'#088573'" @click="AddMedical"></uni-icons>
					<uni-icons v-else type="forward" size="30" :color="'#088573'" @click="page++"></uni-icons>
				</view>
			</view>
			
			<!-- 使用设备时设置用药时间特有输入框 -->
			<view class="record" v-else-if="(type === '添加时间' || type === '修改时间') && EquipmentIndex[0] != 0">		
				<view class="Remark">点击可选择需要使用的药柜,长按可配置药柜信息</view>
				<view class="medicines">
					<view
						class="medical"
						:class="Active(index1) ? 'active' : ''"
						v-for="(medicines,index1) in MedicalInfo" 
						:key="index1" 
						@click="PitchMedical(medicines,index1)"
						@longpress="SetMedicineInfo(index1)" 
						@touchstart="LongTap=false"
					>
						<view>药柜编号:{{index1+1}}</view>
						
						<block v-for="(medical,index2) in medicines" :key="index2">
							<view v-if="medical.name == ''">暂无存药</view>
							<view class="name" v-else>
								{{medical.name}}
							</view>
						</block>
					</view>
				</view>
				
				<SetMedical v-if="SetMedical" @CloseSet="ClosePop" :InitialInfo="InitialInfo">
				</SetMedical>
				
				<view class="remark">按住录音作为计划执行的提示音</view>
				<view class="box"  @touchstart="StartRecord" @touchend="StopRecord"  @click="listen">
					<image :hidden="RecordUrl" class="start_play" src="../../static/Plans/StartRecord.png"
						mode="widthFix"/>
					<image :hidden="!RecordUrl" class="start_play" src="../../static/Plans/PlayVoice.png" 
						mode="widthFix"/>
					<!-- 动画效果 -->
					<view :class="animationStatus ? 'rippleAnimation1 ripple' : 'ripple'"></view>
					<view :class="animationStatus ? 'rippleAnimation2 ripple' : ''"></view>
					<view :class="animationStatus ? 'rippleAnimation3 ripple' : ''"></view>
				</view>
				
				<image class="delete" src="../../static/Plans/delete.png" mode="widthFix"
					@click="RemoveUrl"/>
			</view>
			
			<!-- 确认，取消键 -->
			<view class="Btn">
				<view style="color: #cd2d2d;" @click="Close">取消</view>
				<text>|</text>
				<view style="color: #088573;" @click="FinishPic">确认</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import SetMedical from "../Equipments/SetMedical.vue"//设置药柜组件
	import Medical from './SelectMedical'//查看用户个人药柜
	
	var CurrentText
	var recorderManager = uni.getRecorderManager()
	var innerAudioContext = uni.createInnerAudioContext()
	innerAudioContext.volume = 1
	
	export default{
		data(){
			const Medicines = this.UseMedicines.Medicines
			const RecordUrl = this.UseMedicines.RecordUrl
			return{
				page : 0,
				Medicines : Medicines,
				LongTap : false,
				SetMedical : false,
				selectMedical : false,
				InitialInfo : {},
				RecordUrl : RecordUrl,
				
				CurrentText : '',
				DayList : [],
				animationStatus: false
			}
		},
		created() {
			uni.authorize({
				scope: 'scope.record',
				success() {
						uni.getRecorderManager()
				}
			})
		},
		methods:{
			PickerChange(e){
				let value=e.detail.value
				if(this.type=='选择设备')
					CurrentText=this.Items1[value[0]]
					
				else if(this.type=='选择日期'){
					let year=this.Items1[value[0]]
					let month=this.Items2[value[1]]
					
					if(value[0]!=this.value[0] || value[1]!=this.value[1])
						this.SetDayList(year,month)
					
					let day=this.Items3[value[2]]
					CurrentText=
						year+'年'+month+'月'+day+'日'
				}	
				
				else if(this.type=="选择频率"){
					if(this.Items1[value[0]]==1)
						CurrentText="每天执行"
					else
						CurrentText="每"+this.Items1[value[0]]+"天执行"
				}
				
				else{//选择时间
					CurrentText = this.Items1[value[0]]+":"+this.Items2[value[1]]
				}
				
				this.value=e.detail.value
				this.CurrentText=CurrentText
			},
			
			FinishPic(){//完成选择
				let error = false
				if((this.type === "添加时间" || this.type === "修改时间") && this.EquipmentIndex[0] === 0){//不使用设备，对输入信息处理
					/*  对names去掉空的项,且至少保留一项*/
					let NewInfo = this.Medicines.filter((item,index) => {
						if(item.name != '' && item.amount ===''){
							error = true
							this.ShowToast('数量不能为空','../../static/error.png')
							this.page = index
						}
						else if((item.name ==='' && item.amount != '') || (item.name ==='' && item.remark != '')){
							error = false
							this.ShowToast('药名不能为空','../../static/error.png')
							this.page = index
						}
						return item.name != ''
					})
					
					if(NewInfo.length === 0){
						NewInfo = [{
							name : '',
							amount : '',
							remark : ''
						}]
						error = true
						this.ShowToast('请输入药物信息','../../static/error.png')
					}	
				}	
				else if((this.type === "添加时间" || this.type === "修改时间") && this.EquipmentIndex[0] != 0){//使用了设备，查询设备药物信息
					if(this.UseMedicines.MedicalIndex.length === 0){
						error = true
						this.ShowToast('请选择药柜','../../static/error.png')
					}
				}
				if(!error){//输入信息无误
					let data={
						type : this.type,
						Medicines : this.Medicines,
						RecordUrl : this.RecordUrl,
						MedicalIndex : this.UseMedicines.MedicalIndex,
						value : this.value,
						CurrentText : this.CurrentText === '' ? this.InitialText : this.CurrentText
					}
					this.CurrentText=''
					this.$emit('FinishPic',data)
				}
			},
			Close(){//关闭时间选择弹窗
				this.CurrentText=''
				this.$emit('Close',false)
			},
			
			/* 错误提醒 */
			ShowToast(text){
				uni.showToast({
					title:text,
					image:"../../static/error.png",
					duration:1000})
			},
			
			/* 重新更新每个月的天数 */
			SetDayList(year,month){
				let MaxDay=this.Items3.length
				let DayList=[]
				if(month==4||month==6||month==9||month==11)
					MaxDay=30
				else if(month==2 && year%4==0 && year%100!=0 || year%400==0)
					MaxDay=28
				else if(month==2)
					MaxDay=29
				else
					MaxDay=31
				for(let i=1;i<MaxDay+1;i++)
					DayList.push(i)
					
				this.Items3=DayList
				this.DayList=DayList
			},
			/* 重新更新每个月的天数 */
			
			/* 添加/切换/减少药物 */
			last(){
				if(this.page > 0)
					this.page--
			},
			AddMedical(){//添加药
				this.Medicines.push({
					name : '',
					amount : '',
					remark : '',
				})
				this.page++
			},
			RemoveMedical(){
				this.Medicines.splice(this.page,1)
				if(this.Medicines.length === 0)
					this.Medicines.push({
						name : '',
						amount : '',
						remark : '',
					})
				if(this.page != 0)
					this.page--
				else	
					this.page = 0
			},
			/* 添加/切换/减少药物 */
			
			finishSelect(e){//完成选择
				if(this.Medicines[this.Medicines.length-1].name === '')
					this.Medicines.splice(this.Medicines.length-1,1)
				this.Medicines = this.Medicines.concat(e)
				uni.showToast({
					title:'已更新药物',
					duration:1000
				})
				this.selectMedical = false
			},
			
			/* 选中的药柜 */
			Active(index){
				let active = false
				if(this.type === "添加时间" || this.type === "修改时间")
					this.UseMedicines.MedicalIndex.find(item => {
						if(item === index)
							active = true
						return item === index
					})
				return active
			},
			/* 短按选中药柜 */
			PitchMedical(medicines,index){
				if(!this.LongTap){
					if(medicines[0].name === '')
						uni.showToast({
							title: '药柜无存药',
							image:'../../static/error.png',
							duration:1000
						})
					else{//已填写过配药，点击则选中药柜
						let FindIndex = (i) => { //查询药柜编号是否在选中的药柜中
							let active = false
							this.UseMedicines.MedicalIndex.forEach(item => {
								if(i === item)
									active = true
							})
							return active
						}
						
						if(FindIndex(index) != true)
							this.UseMedicines.MedicalIndex.push(index)
						else//active != true时
							this.UseMedicines.MedicalIndex.forEach((item,i) => {
								if(item === index)
									this.UseMedicines.MedicalIndex.splice(i,1)
							})
					}
				}
			},
			/* 长按配置药柜信息 */
			SetMedicineInfo(index){
				this.LongTap = true
				/* 去掉需要配置药柜的active状态 */
				this.UseMedicines.MedicalIndex.forEach((item,i) => {
					if(item === index)
						this.UseMedicines.MedicalIndex.splice(i,1)		
				})
				
				const EquipmentInfo = global.EquipmentsInfo[this.EquipmentIndex[0]-1]
				const MedicalInfo = JSON.parse(EquipmentInfo.MedicalInfo)
				
				let InitialInfo={
					MedicalIndex : index,
					EquipmentID : EquipmentInfo.ID,
					MedicalInfo : MedicalInfo,
					EquipIndex : this.EquipmentIndex[0]-1,
					active : 'plan',
				}
				this.InitialInfo=InitialInfo
				this.SetMedical=true
			},
			/* 关闭设置药柜 */
			ClosePop(){
				this.SetMedical = false
				this.selectMedical = false
			},
			
			/* 录音 */
			StartRecord(){
				if(!this.RecordUrl){
					this.animationStatus = true
					recorderManager.start({
						format : 'mp3'
					})
				}
			},
			StopRecord(){
				if(!this.RecordUrl){
					this.animationStatus = false
					recorderManager.stop()
					recorderManager.onStop(res => {
						if(res.duration > 500)
							this.RecordUrl = res.tempFilePath
					})
				}
			},
			listen(){
				if(this.RecordUrl){
					console.log(this.RecordUrl)
					innerAudioContext.src = this.RecordUrl
					innerAudioContext.play()
				}
			},
			RemoveUrl(){
				this.RecordUrl = ''
			},
			/* 录音 */
		},//methods结束
		computed:{
			MedicalInfo(){
				if(this.EquipmentIndex[0] != 0){
					const EquipmentInfo = global.EquipmentsInfo[this.EquipmentIndex[0]-1]
					const MedicalInfo = JSON.parse(EquipmentInfo.MedicalInfo)
					return MedicalInfo
				}
				return ''
			}
		},
		props:{
			type:String,
			EquipmentIndex:Array,
			InitialText:{
				type:String,
				value:''
			},
			UseMedicines:Object,
			value:Array,
			Items1:{
				type:Array,
				value:[]
			},
			Items2:{
				type:Array,
				value:[]
			},
			Items3:{
				type:Array,
				value:[]
			},
		},
		components:{
			uniIcons,
			SetMedical,
			'selcet-from-medical' : Medical
		}
	}
</script>

<style scoped>
	.Popup{
		width: 95%;
		left: 2.5%;
	}
	/* 选中的文字提醒 */
	.CurrentText{
		font-size: 18px;
		margin: 10px 10%;
	}
	
	picker-view{
		text-align: center;
		width: 90%; 
		height: 130px;
		margin: 10px auto;
	}
	
	/* 分割线样式 */
	.line{
		width: 90%;
		height: 1px;
		position: absolute;
	}
	
	/* 时间设置特有内容样式 */
	.UseTime{
		font-size: 17px;
		width: 90%;
		margin: 20px auto;
	}
	.UseTime .info{
		height: 40px;
		display: flex;
		align-items: center;
	}
	.UseTime .info input{
		flex: 1;
	}
	.UseTime h2{
		line-height: 1.8;
	}
	.UseTime textarea{
		color: #696767;
		width: 94%;
		height: 40px;
		padding: 5px;
		border: 1px solid #088573;
		border-radius: 10px;
	}
	.UseTime .selcet-from-medical{
		color: #088573;
		position: absolute;
		top: 5px;
		right: 10px;
	}
	/* 图标样式 */
	.UseTime .icon{
		width: 40%;
		margin: 5px auto;
		display: flex;
		justify-content: space-between;
	}
	/* 时间设置特有内容样式 */
	
	/* 选择药柜样式 */
	.record .Remark{
		text-align: center;
		font-size: 12px;
		color: #7b7b7b;
		line-height: 1.8;
	}
	
	/* 储药情况样式 */
	.record .medicines{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	.record .medicines .medical{
		box-sizing: border-box;
		font-size: 15px;
		width: 50%;
		text-align: center;
		line-height: 1.7;
		padding: 5px 0;
	}
	.record .medicines .medical .name{
		width: 98%;
		margin: 0 auto;
		white-space: nowrap;
		overflow: hidden;
	}
	.record .medicines .medical:nth-child(1){
		border-top: 1px solid #088573;
		border-right: 1px solid #088573;
		border-bottom: 1px solid #088573;
	}
	.record .medicines .medical:nth-child(2){
		border-top: 1px solid #088573;
		border-bottom: 1px solid #088573;
	}
	.record .medicines .medical:nth-child(3){
		border-right: 1px solid #088573;
		border-bottom: 1px solid #088573;
	}
	.record .medicines .medical:nth-child(4){
		border-bottom: 1px solid #088573;
	}
	
	/* 选中药柜背景加深 */
	.record .medicines .active{
		background: rgba(8,133,115,0.4);
	}
	
	/* 录音样式 */
	.record{
		margin: 10px 0;
	}
	.record .remark{
		color: #b3b3b3;
		font-size: 12px;
		text-align: center;
		margin-bottom: 5px;
	}
	.record .box{
		width: 60px;
		height: 60px;
		border-radius: 50%;
		display: inline-block;
		position: relative;
		margin-left: 40%;
	}
	.record .start_play{
		width: 50px;
		margin-left: 5px;
		margin-top: 5px;
		z-index: 2;
	}
	/* 动画 */
	.record .ripple{
		position: absolute;
		top:0;
		left:0;
		right:0;
		bottom:0;
		border-radius: 50%;
		border:2px solid #088573;
		z-index: 1;
	}
	.rippleAnimation1{
	  animation: ripple 1.5s infinite linear;
	} 
	.rippleAnimation2{
	  animation: ripple 1.5s infinite linear;
	  animation-delay:0.5s;
	} 
	.rippleAnimation3{
	  animation: ripple 1.5s infinite linear;
	  animation-delay:1s;
	} 
	@keyframes ripple{
	  from{
	    opacity: 1;
	    transform: scale(1,1)
	  }
	  to{
	    opacity: 0;
	    transform: scale(3,3)
	  }
	}
	.record .delete{
		width: 25px;
		height: auto;
		margin-left: 30px;
		margin-bottom: 15px;
		z-index: 2;
	}
	/* 录音样式 */
	
	.Btn{
		margin: 10px 0;
		display: flex;
	}
	.Btn view{
		width: 50%;
		text-align: center;
	}
	.Btn text{
		color: rgba(174,174,174,0.6);
	}
</style>
