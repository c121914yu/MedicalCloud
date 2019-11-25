<template>
	<view class="AddPlan">
		<Picker v-if="Picker"  :type="type" :value="value" :EquipmentIndex="EquipmentIndex"
			:Items1="Items1" :Items2="Items2" :Items3="Items3" :UseMedicines="UseMedicines"
		 :InitialText="InitialText" @FinishPic="FinishPic" @Close="Close">
		</Picker>
		
		<view class="info">
			<view>使用设备：</view>
			<view class="content" @click="PickerEquipment">{{CurrentText[0]}}</view>
		</view>
		<image class="line" src="../../static/Plans/line.png"/>
		
		<view class="info">
			<view>开始日期：</view>
			<view class="content" @click="PickerDate">
				{{CurrentText[1]==Today ? '今天' : CurrentText[1]}}
			</view>
		</view>
		<image class="line" src="../../static/Plans/line.png"/>
		
		<view class="info">
			<view>计划频率：</view>
			<view class="content" @click="PickerFrequency">{{CurrentText[2]}}</view>
		</view>
		<image class="line" src="../../static/Plans/line.png"/>
		
		<view class="Time">
			<view>用药时间</view>
			<text>长按可以删除该时间</text>
		</view>
		
		<view class="UseTime" v-for="(usetime,index) in UseTimes" :key="index"
			@click="PickerTimes('Change',usetime,index)" @longpress="RemoveTime(index)">
			<view class="time">{{usetime.Hour+":"+usetime.Minute}}</view>
			
			<view v-if="EquipmentIndex[0] === 0" class="content">
				<view v-for="(medical,index1) in usetime.Medicines" :key="index1">
					<text style="color: #464646;">{{medical.name}} *{{medical.amount}}</text>
				</view>
			</view>
				
			<view v-else class="record">
				<view>
					<view 
						style="color: #7b7b7b;font-size: 17px;" 
						v-for="(medicalIndex,index2) in usetime.MedicalIndex" 
						:key="index2"
					>
						药柜{{medicalIndex + 1}}
					</view>
				</view>
				
				<view style="margin-left: 10px;display: flex;align-items: center;">
					<text style="margin-right: 6px;">提示音:</text>
					<text v-if="usetime.RecordUrl === ''" style="color: #7b7b7b;">默认</text>
					<image v-else-if="PlayRecord != index" src="../../static/Plans/PlayVoice.png" mode="widthFix" 
						@click.stop="PlayVoice(usetime.RecordUrl,index)"/>
					<image v-else src="../../static/Plans/pauseVoice.png" mode="widthFix" @click.stop="StopVoice"/>
				</view>
			</view>
		</view>
		
		<view>
			<image class="AddTime" src="../../static/Plans/AddTime.png" mode="widthFix"  @click="PickerTimes('Add')"/>
		</view>
		
		<image class="line" src="../../static/Plans/line.png"/>
		
		<view style="display: flex;justify-content: space-between;padding: 10px 0;">
			<button class="remove" v-show="ChangePlan" @click="Remove">删除</button>
			<button class="sure" @click="Sure">确认</button>
		</view>
	</view>
</template>

<script>
	import Picker from './Picker'//引入选择自定义组件
	
	var plan = {}
	var Equipments,UseEquipments=["不使用设备"]
	var DateList=[],Today,DayList=[]
	var FrequencyList=[]
	var TimesList=[],TimeIndex
	
	var innerAudioContext = uni.createInnerAudioContext()
	innerAudioContext.volume = 1
	export default{
		data(){			
			return{
				ChangePlan:false,
				PlayRecord : -1,
				
				EquipmentInfo:{},
				Today:'',
				UseTimes:[],
				/* 选择器参数 */
				Picker:false,
				type:'',
				InitialText:'',
				CurrentText:[UseEquipments[0],'今天','每天执行'],
				
				UseMedicines:{},
				value:[],//下标的值
				Items1:[],//发送给选择题的数组内容
				Items2:[],
				Items3:[],
				
				EquipmentIndex:[0],//设备的下标
				DateIndex:[0,0,0],//日期下标
				FrequencyIndex:[0]//频率下标
				/* 选择器参数 */
			}
		},
		onLoad(e) {
			this.SetUseEquipments()
			this.SetDateList()
			this.SetFrequency()
			this.SetTimes()
			/* 如果是修改界面来,初始化数据 */
			if(e.PlanIndex != "false")
				this.SetChangeData(e.PlanIndex)
		},
		methods:{
			PickerEquipment(){//选择设备
				this.type='选择设备'
				this.Items1=UseEquipments
				this.Items2=[]
				this.Items3=[]
				this.InitialText=this.CurrentText[0]
				this.value=this.EquipmentIndex
				this.Picker=true
			},
			PickerDate(){//选择日期
				this.type="选择日期"
				this.Items1=DateList[0]
				this.Items2=DateList[1]
				this.Items3=DayList
				this.InitialText=this.CurrentText[1]
				this.value=this.DateIndex
				this.Picker=true
			},
			PickerFrequency(){//选择频率
				this.type="选择频率"
				this.Items1=FrequencyList
				this.Items2=[]
				this.Items3=[]
				this.InitialText=this.CurrentText[2]
				this.value=this.FrequencyIndex
				this.Picker=true
			},
			PickerTimes(type,usetime={},i){//选择用药时间
				this.Items1=TimesList[0]
				this.Items2=TimesList[1]
				this.Items3=[]
				/* 如果是修改的,把已经选中的时间传过去 */
				if(type === "Change"){
					TimeIndex = i
					/* 计算时间下标 */
					let Hour,Minute
					TimesList[0].find((e,index)=>{
						Hour = index
						return e === usetime.Hour
					})
					TimesList[1].find((e,index)=>{
						Minute = index
						return e === usetime.Minute
					})
					/* 计算时间下标 */		
					this.type = "修改时间"
					this.InitialText = usetime.Hour + ":" + usetime.Minute
					this.UseMedicines = usetime
					this.value = [Hour,Minute]
				}
				else{//新增时间
					let UseMedicines = {}
					let InitialText = "07:30"
					let Hour = 7
					if(this.UseTimes.length > 0){
						const LastTime = this.UseTimes[this.UseTimes.length-1]
						TimesList[0].find((e,index)=>{
							Hour = index
							return e === LastTime.Hour
						})
						UseMedicines = {
							Hour : Hour,
							RecordUrl : LastTime.RecordUrl,
							MedicalIndex : LastTime.MedicalIndex,
							Medicines : LastTime.Medicines
						}
						InitialText = Hour + ":30"
					}		
					else
						UseMedicines = {
							RecordUrl : '',
							MedicalIndex : [],
							Medicines : [{
								name : '',
								amount : '',
								remark : '',
							}]
						}
					this.type = "添加时间"
					this.InitialText = InitialText
					this.UseMedicines = UseMedicines
					this.value = [Hour,30]
				}
				this.Picker = true
			},
			RemoveTime(index){
				this.UseTimes.splice(index,1)
			},
			PlayVoice(src,index){//播放录音
				console.log(src)
				this.PlayRecord = index
				innerAudioContext.stop()
				innerAudioContext.src = src
				innerAudioContext.play()
				innerAudioContext.onEnded(e => {
					this.PlayRecord = -1
				})
			},
			StopVoice(){
				innerAudioContext.stop()
				this.PlayRecord = -1
			},
			
			/* 确认添加计划按键 */
			Sure(){
				/* 请求订阅权限 */
				uni.requestSubscribeMessage({
					tmplIds: ['NZuGule3MSGcW4xLeYT2ucpCho5J1cgQ9O5tmTFLIYs'],
					success(res){console.log(res)},
					faie(err){console.log(err)}
				})
				/* 获取选择的设备 */
				let EquipmentID
				if(this.EquipmentIndex[0]==0)
					EquipmentID="不使用设备"
				else
					EquipmentID=Equipments[this.EquipmentIndex-1].ID
				/* 获取日期 */
				let date=JSON.stringify({
					year:DateList[0][this.DateIndex[0]],
					month:DateList[1][this.DateIndex[1]],
					day:DateList[2][this.DateIndex[2]]
				}) 
				/* 获取使用频率 */
				let Frequency = FrequencyList[this.FrequencyIndex[0]]
				/* 获取录音列表 */
				let RecordUrls = []
				this.UseTimes.forEach((item,index) => {
					if(item.RecordUrl.indexOf("https") === -1 && item.RecordUrl != '')//代表url不是以https开头，即如果是临时路径则保存
					 RecordUrls.push({
						 url : item.RecordUrl,
						 index : index
					 })
				})
				console.log(RecordUrls)
				
				/* 判断有没有重复的时间 */
				for(let a = 0;a<this.UseTimes.length-1;a++)
					for(let b = a+1;b<this.UseTimes.length;b++)
						if(this.UseTimes[a].Hour === this.UseTimes[b].Hour && this.UseTimes[a].Minute === this.UseTimes[b].Minute){
							this.showtoast('有重复时间')
							return
						}
				
				/* 判断填写内容是否有误 */
				if(this.UseTimes.length === 0)
					this.showtoast("请选择时间")					
				else{
					uni.showModal({
						title: '提示',
						content: this.ChangePlan ? '确认修改计划?' : '确认添加计划?',
						success: res => {
							if(res.confirm){
								uni.showLoading({title:'请求中...'})
								/* 发送数据给服务器 */
								let request = (url,text) => {
									const data={
										phone:global.UserLoginInfo.phone,
										EquipmentID:EquipmentID,
										date:date,
										Frequency:Frequency,
										UseTimes:JSON.stringify(this.UseTimes),
										PlanID : plan.PlanID
									}
									uni.request({
										url: 'https://jinlongyuchitang.cn:4000' + url,
										// url: 'http://localhost:4000' + url,
										method:'POST',
										data:data,
										success:res => {
											if(res.statusCode === 200)
												global.GetPlans(global.UserLoginInfo.phone,true,text)
											else
												uni.showToast({title:'网络错误'})
										},
										fail: (err) => {console.log(err)}
									})
								}//request函数
								/* 存储录音 */
								let time = 0
								let upRecord = (item) => {
									uni.uploadFile({
										url: 'https://jinlongyuchitang.cn:4000/upRecord',
										// url: 'http://localhost:4000/upRecord',
										filePath: item.url,
										name: 'audio',
										success: (res) => {
											if(res.statusCode === 200){
												this.UseTimes[item.index].RecordUrl = res.data
												time++
												if(time === RecordUrls.length){
													if(this.ChangePlan)
														request('/ChangePlan','修改计划成功')
													else
														request('/AddPlan','添加计划成功')
												}
											}
											else
												uni.showToast({title:'网络错误'})
										},
										fail: (err) => {console.log(err)},
									})
								}//upRecord函数
								/* 判断是否需要上传录音 */
								if(RecordUrls.length === 0){
									if(this.ChangePlan)
										request('/ChangePlan','修改计划成功')
									else
										request('/AddPlan','添加计划成功')
								}
								else
									RecordUrls.forEach(item => {
											upRecord(item)
									})
							}}})//model结束	
				}//request结束
			},
			/* 删除计划 */
			Remove(){
				uni.showModal({
					title: '提示',
					content: '确认删除计划?',
					success: res => {
						if(res.confirm){
							uni.showLoading({title:'删除中...'})
							uni.request({
								url: 'https://jinlongyuchitang.cn:4000/RemovePlan',
								method: 'POST',
								data:{PlanID:plan.PlanID},
								success: res => {
									global.GetPlans(global.UserLoginInfo.phone,true,'删除计划成功')
								},
								fail: (err) => {console.log(err)},
								complete() {uni.hideLoading()}})}
					}
				})
			},
					
			/* 完成Picker选择,重置界面数据*/
			FinishPic(e){
				let data=e.detail.__args__[0]
				let SetUseTimes=(type)=>{
					let Hour = TimesList[0][data.value[0]]
					let Minute = TimesList[1][data.value[1]]
					let UseMedicines = {//初始化对象
						Hour : Hour,
						Minute : Minute,
						Medicines : data.Medicines,
						MedicalIndex : data.MedicalIndex,
						RecordUrl : data.RecordUrl,
					}
					if(type === '添加时间')
						this.UseTimes.push(UseMedicines)
					else
						this.UseTimes[TimeIndex] = UseMedicines
					/* 对数组排序 */
					this.UseTimes.sort(function(a,b){
						if(a.Hour === b. Hour)
							return a.Minute - b.Minute
						return a.Hour - b.Hour
					})
				}
				switch(data.type){
					case '选择设备':this.EquipmentIndex=data.value; this.CurrentText[0]=data.CurrentText; this.UseTimes=[]; break;
					case '选择日期':this.DateIndex=data.value;this.CurrentText[1]=data.CurrentText;break
					case '选择频率':this.FrequencyIndex=data.value;this.CurrentText[2]=data.CurrentText;break
					case '添加时间':SetUseTimes('添加时间');break
					case '修改时间':SetUseTimes('修改时间');break
				}
				this.Picker=false
			},
			/* 完成弹窗内容,关闭弹窗并返回参数 */
			Close(){
				this.Picker=false
			},
			
			/* 初始化数据方法: */
			SetUseEquipments(){//生成设备信息数组
				/* 如果用户有设备，把设备名组成数组给UseEquipments */
				Equipments = global.EquipmentsInfo
				this.EquipmentInfo = Equipments

				UseEquipments=["不使用设备"]
				if(Equipments.length)
					UseEquipments = UseEquipments.concat(Equipments.map(item=>{
						return item.name
					}))
			},
			SetDateList(){//生成日期数组
				const date = new Date()
				let year = date.getFullYear()
				let month = date.getMonth() + 1
				let day = date.getDate()
				/* 根据今天日期传给数组对应下标 */
				Today={year:year,month:month,day:day},
				this.Today=year+'年'+month+'月'+day+'日'
				this.DateIndex=[0,Today.month-1,Today.day-1]
				/* 生成日期数组 */
				let YeatList=[],MonthList=[]
				for(let i=year;i<year+10;i++)
					YeatList.push(i)
				for(let i=1;i<13;i++)
					MonthList.push(i)
				for(let i=1;i<32;i++)
					DayList.push(i)
	
				DateList.push(YeatList)
				DateList.push(MonthList)
				DateList.push(DayList)
				
				/* 判断该月有多少天 */
				DayList=[]
				let MaxDay=31
				if(month==4||month==6||month==9||month==11)
					MaxDay=30
				else if(month==2 && year%4==0 && year%100!=0 || year%400==0)
					MaxDay=28
				else if(month==2)
					MaxDay=29
				for(let i=1;i<MaxDay+1;i++)
					DayList.push(i)	
			},//SetDate结束
			SetFrequency(){//生成频率信息数组
				FrequencyList = []
				for(let i=1;i<31;i++)
					FrequencyList.push(i)
			},
			SetTimes(){//生成时间数组
				let Hour=[],Minute=[]
				for(let i=0;i<24;i++)
					if(i<10)
						Hour.push("0"+i)
					else
						Hour.push(i)
				for(let i=0;i<60;i++)
					if(i<10)
						Minute.push("0"+i)
					else
						Minute.push(i)
				TimesList.push(Hour)
				TimesList.push(Minute)
			},
			
			/* 修改界面的初始数据 */
			SetChangeData(PlanIndex){
				plan = global.UserPlans[PlanIndex]
				/* 修改设备情况 */
				if(plan.EquipmentID != "不使用设备"){
					let Equipment = Equipments.find((item,index)=>{
						if(item.ID === plan.EquipmentID){
							this.EquipmentIndex[0] = index+1
							this.CurrentText[0] = item.name
						}
						return item.ID === plan.EquipmentID
					})
				}
				/* 修改日期 */
				let date=JSON.parse(plan.date)
				this.CurrentText[1]=date.year+'年'+date.month+'月'+date.day+'日'
				this.DateIndex=[new Date().getFullYear()-date.year,date.month-1,date.day-1]
				/* 修改频率 */
				this.FrequencyIndex[0]=plan.Frequency-1
				if(plan.Frequency>1)
					this.CurrentText[2]='每'+plan.Frequency+'天执行'
				/* 修改时间 */
				this.UseTimes=JSON.parse(plan.UseTimes)
				this.ChangePlan=true
			},
			/* 错误提醒 */
			showtoast(text){
				uni.showToast({
					title:text,
					image:"../../static/error.png",
					duration:1000})
			}
		},//methods结束
	
		components:{
			Picker
		}
	}
</script>

<style scoped>
	body{
		font-size: 17px;
	}
	.AddPlan{
		background: #FFFFFF;
		width: 90%;
		border-radius: 10px;
		box-shadow:2px 2px 5px #7b7b7b;
		margin: 20px auto;
	}
	/* 分割线样式 */
	.line{
		width: 90%;
		height: 1px;
		margin: 0 auto;
		position: absolute;
	}
	/* 主体信息 */
	.info:first-child{
		padding-top: 10px;
	}
	.info{
		width: 90%;
		min-height: 40px;
		margin: 0 auto;
		display: flex;
		align-items: center;
	}
	.info .content{
		flex: 1;
	}
	
	/* 配置药柜样式 */
	.Medicines{
		color: #858181;
		font-size: 17px;
		max-width: 65%;
		margin-left: 5px;
		display: flex;
		flex-wrap: wrap;
	}
	.Medicines view{
		margin-right: 5px;
	}
	
	.Time{
		width: 90%;
		margin: 0 auto;
		padding-top: 5px;
		display: flex;
		align-items: flex-end;
	}
	.Time text{
		color: #b3b3b3;
		font-size: 13px;
		margin-left: 5px;
	}
	/* 用药时间列表样式 */
	.UseTime{
		background: #fdd930;
		width: 90%;
		border-radius: 5px;
		margin: 5px auto;
		display: flex;
		align-items: center;
	}
	.time{
		background: #fff;
		height: 40px;
		width: 20%;
		border-radius: 5px;
		margin: 7px 10px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.UseTime .content{
		font-size: 15px;
	}
	
	/* 录音 */
	.record{
		display: flex;
		align-items: center;
	}
	.record text{
		color: ;
		font-size: 17px;
		padding: 0;
	}
	.record image{
		width: 30px;
		z-index: 99;
	}
	
	/* 添加用药时间照片 */
	.AddTime{
		width: 12%;
		margin-left: 5%;
	}
	

	/* 确认按键 */
	.sure{
		color: #FFFFFF;
		background: #088573;
		width: 25%;
		line-height: 2.3;
		border-radius: 10px;
	}
	/* 删除按键 */
	.remove{
		color: #FFFFFF;
		background: #f14d4d;
		width: 25%;
		line-height: 2.3;
		border-radius: 10px;
	}
</style>
