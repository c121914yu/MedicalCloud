const fs = require('fs')
const schedule = require('node-schedule')
const rule = new schedule.RecurrenceRule()

function timeTask(app,db){
	schedule.scheduleJob('0 0 3 * * *',() => {//每天3点执行一次
		clearRecords(app,db)
	})
}

module.exports = timeTask

function clearRecords(app,db){
	console.log('正在清理无用录音')
	var files = fs.readdirSync('./records')
	let sql = 'select * from Plans'
	db.query(sql,(err,res) => {
		let RecordUrls = []
		res.forEach(item => {
			UseTimes = JSON.parse(item.UseTimes)
			UseTimes.forEach(time => {
				if(time.RecordUrl != ''){
					const url = time.RecordUrl.replace('https://www.jinlongyuchitang.cn:4000/records/','')
					RecordUrls.push(url)
				}
			})
		})
		
		files.forEach(item => {
			let i = 0
			for(i;i<RecordUrls.length;i++)
				if(RecordUrls[i] === item)
					break;
			if(i === RecordUrls.length)
				fs.unlinkSync('./records/' + item)
		})
	})
}