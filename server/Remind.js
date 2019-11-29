/* 
	每分钟读取一次数据库的计划，筛选当前时间戳的计划进行提醒
	要求计划数据表中有一个存储下次计划时间戳的NextTime属性
	筛选计划 -> 将符合条件的计划循环发送提醒 -> 计算每个计划下次执行的时间并存储到NextTime属性中
*/
const schedule = require('node-schedule')
const rule = new schedule.RecurrenceRule()
const nodemailer = require('nodemailer')
var uuid = require('node-uuid');

function remind(app,db){
	schedule.scheduleJob('0 * * * * *',() => {//每分钟的0秒时执行一次
		/* 根据当前时间戳筛选计划, */
		const date = new Date()
		const now = Math.round(date.getTime() / 1000)//毫秒级时间戳，因为服务器会有点延迟，向前向后多筛选30s
		let sql = `select * from Plans where NextTime between ${now-30} and ${now+30}`
		db.query(sql,(err,res) => {
			if(err) throw err
			res.forEach(item => {
				let NextTime = computedDate(item) / 1000
				sql = `update Plans set NextTime=${NextTime} where PlanID='${item.PlanID}'`
				db.query(sql,(err1,res1) => {
					if(err1) throw err1
					sql = `select * from UserLoginInfo where phone=${item.phone}`
					db.query(sql,(err2,res2) => {
						if(err2) throw err2
						FindMedical(item,db)
							.then(res => {
								const medicines = res.medicines
								// SendMessage(res2[0].openid,res)
								const ID = SaveRecord(item.phone,res,db)
								SendEmail(res,ID,db)
							})
							.catch(err => console.log(err))
					})
				})
			})
		})
	})
	/* 发送推送消息 */
}
module.exports = remind
	
function SendMessage(openid,MedicalInfo){//发送提醒
	const axios = require('axios')
	const AppID = 'wxafd522b076e38be0'
	const AppSecret = '92b17881f908a5396994349316b06cc5'
	
	axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${AppID}&secret=${AppSecret}`)
		.then(res => {//获取access_token
			let access_token = res.data.access_token
			
			/*请求模板*/
			axios.post(`https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${access_token}`,{
				"touser": openid,
				"template_id": "NZuGule3MSGcW4xLeYT2ucpCho5J1cgQ9O5tmTFLIYs",
				"page": "pages/Plans",
				"data": {
						"thing1": {
							"value":"阿莫西林"
						},
						"time2": {
							"value":MedicalInfo.time
						},
						"thing3": {
							"value":"5粒"
						}
				}
			})
				.then(res1 => {
					console.log(res1.data.errcode)
				})
		})
}

function SendEmail(MedicalInfo,ID,db){//发送邮件
	let  medicines = ''
	MedicalInfo.medicines.forEach(item => {
		item.forEach(medical => {
			if(medical.remark != '')
				medicines += `<li>${medical.name}*${medical.amount}<br><span style="color: #cc03fb;">注意:${medical.remark}</span></li>`
			else
				medicines += `<li>${medical.name}*${medical.amount}</li>`
		})
	})
	let transporter = nodemailer.createTransport({
	  host:'smtp.qq.com',
	  //开启安全连接
	  secure:false,
	  auth:{
	    user:'2979223533@qq.com',
	    pass:'hlrfpzawvuzadcfe'
	  }
	})
	
	let mailOptions = {
	  from:'2979223533@qq.com',
	  to:'545436317@qq.com',
	  subject:'医云助手-用药提醒',
	  html:`
					<div style="font-size: 17px;text-align: center;display: flex;flex-direction: column;align-items: center;">
						<h2 style="margin: 5px 0;">${MedicalInfo.time}到了,请记得按时用药</h2>
						<h3 style="margin: 5px 0;">需要服用的药：</h3>
						<ul style="list-style: none;padding: 0;">
							${medicines}
						</ul>
						<a href="http://localhost:4000/Record/${ID}" style="text-decoration: none;color: #4DC71F;">确认已服药</a>
					</div>
				`
	}
	
	transporter.sendMail(mailOptions,(error,info) => {
	  if(error)	throw console.log(error)
		console.log('发送成功')

		setTimeout(() => {//20分钟后仍未确认则认为是未完成
			let sql = `select * from Records where ID='${ID}'`
			db.query(sql,(err,res) => {
				if(err) throw err
				if(res[0].status === -1){
					sql = `update Records set status=0,readed=0
							   where ID='${ID}'
							  `
					db.query(sql,(err1,res1) => {
						if(err1) throw err1
					})
				}
			})
		}, 60000*20)
	})
}

function SaveRecord(phone,res,db){//存储用药信息
		const time = res.date + ' ' + res.time
		let  medicines = new Array()
		res.medicines.forEach(item => {
			item.forEach(medical => {
				medicines.push(medical)
			})
		})
		medicines = JSON.stringify(medicines)
		
		const ID = uuid.v1()
		let sql = `insert into Records set?`
		let data = {
			phone : phone,
			ID : ID,
			time,
			medicines
		}
		db.query(sql,data,(err,result) => {
			if (err) throw err
			console.log(phone + ' 添加一条用药记录 ' + time)
		})
		return ID
}

async function FindMedical(info,db){
	return new Promise(function(resolve, reject){
			/* 获取日期 */
			let date = new Date()
			const year = date.getFullYear() 
			const month = date.getMonth() + 1
			const day = date.getDate()
			date = `${year}/${month}/${day}`
		
			var time = ''
			/* 根据时间判断是哪个药物下标 */
			const index = (info) => {		
				const PlanTime = new Date(info.NextTime * 1000)
				let Hour = PlanTime.getHours()
				if(Hour < 10)
					Hour = '0' + Hour
				let Minute = PlanTime.getMinutes()
				if(Minute < 10)
					Minute = '0' + Minute
				time = Hour + ':' + Minute
			
				const UseTimes = JSON.parse(info.UseTimes)
				let index = UseTimes.find(item => {
					const thisTime = item.Hour + ':' + item.Minute
					return time == thisTime
				})

				if(info.EquipmentID === '不使用设备')
					return index.Medicines
				else
					return index.MedicalIndex
			}
			const UseIndex = index(info)
			
			/* 找药 */
			let medicines = []
			if(info.EquipmentID === '不使用设备'){
				console.log('不使用设备')
			}
			else{//使用设备，根据下标查找用药
				let sql = `select * from UserEquipment where ID='${info.EquipmentID}'`
				db.query(sql,(err,res) => {
					const MedicalInfo = JSON.parse(res[0].MedicalInfo) 
					UseIndex.forEach(index => {
						medicines.push(MedicalInfo[index])
					})
					resolve({
						medicines,
						time,
						date
					})
				})
			}
	 })
}
	
function computedDate(data){//计算最近开始的计划，返回时间戳
	let BeginDate = JSON.parse(data.date)
	let UseTimes = JSON.parse(data.UseTimes)
	const EndTime = UseTimes[UseTimes.length-1]
	const Frequency = data.Frequency
	
	const date = new Date()
	const now = date.getTime()
	
	BeginDate = new Date(`${BeginDate.year}-${BeginDate.month}-${BeginDate.day} ${EndTime.Hour}:${EndTime.Minute}`).getTime()
	
	/* 查询最近开始的日期 */
	while((BeginDate - now) < 0){
		BeginDate += Frequency * 24*60*60*1000 //向后推迟一次频率，直到开始日期在现在日期后
	}
	BeginDate = new Date(BeginDate)
	BeginDate = `${BeginDate.getFullYear()}-${BeginDate.getMonth()+1}-${BeginDate.getDate()} `
	
	/* 查询时间大于当前时间且最近的一个时间 */
	let BeginTime = UseTimes.find((time,index) => {
		let begin = new Date(BeginDate + time.Hour + ':' + time.Minute)
		return begin - now > 0	
	})
	BeginTime = new Date(BeginDate + BeginTime.Hour + ':' + BeginTime.Minute).getTime()
	
	return BeginTime
}