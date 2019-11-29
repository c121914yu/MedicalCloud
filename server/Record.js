function record(app,db){
	app.post('/Record/GetRecords',(req,res) => {
		let data = req.body
		const startdate = formatDate(Number(data.enddate) - 5*24*60*60*1000)
		const enddate = formatDate(Number(data.enddate)) //查询5天的记录
		let sql = `
							 select * from Records 
							 where phone='${data.phone}' 
							 and UNIX_TIMESTAMP(time)  >= UNIX_TIMESTAMP('${startdate}')
							 and UNIX_TIMESTAMP(time)  <= UNIX_TIMESTAMP('${enddate}')
							 order by time desc
							`
		
		db.query(sql,(err,result) => {
			console.log(result.length)
			let records = result.map(item => {//将时间格式化
				item.medicines = JSON.parse(item.medicines)
				item.date = `${item.time.getFullYear()}/${item.time.getMonth()+1}/${item.time.getDate()}`
				const hour = item.time.getHours() < 10 ? '0'+item.time.getHours() : item.time.getHours()
				const minute = item.time.getMinutes() < 10 ? '0'+item.time.getMinutes() : item.time.getMinutes()
				item.time = hour + ':' + minute
				return item
			})
			let Records = new Array

			for(let a=0;a<records.length;a++){//相同时间合并
				Records[a] = new Array
				Records[a].push(records[a])
				if(a != records.length-1)
					for(let b=a+1;b<records.length;b++){
						if(records[b].date === records[a].date){
							Records[a].push(records[b])
							records.splice(b,1)
							b--
						}
						else
							break
					}			
			}
			res.send(Records)
		})
	})
	
	app.post('/Record/readed',(req,res) => {
		let data = req.body
		let sql = `update Records set readed=1
							 where ID='${data.ID}'
							`
		db.query(sql,(err,result) => {
			res.send({
				code : 200,
				text : '已读'
			})
		})
	})
	
	app.get('/Record/:ID',(req,res) => {
		let sql = `select * from Records where ID='${req.params.ID}'`
		db.query(sql,(err,result) => {
			if(err) throw err
			const record = result[0]
			if(record.status === -1){
				const now = new Date()
				let IntervalTime = Math.floor((now - record.time) / 60000)
				/* 5分钟内认为正常服药,超过5分钟且小于20分钟认为是超时 */
				let text = ''
				if(IntervalTime <= 5){
					sql = `update Records set status=2 where ID='${req.params.ID}'`
					text = '已服药'
				}
				else if(IntervalTime > 5 && IntervalTime <= 20){
					sql = `update Records set status=1,timeout=${IntervalTime} where ID='${req.params.ID}'`
					text = `已服药,超时${IntervalTime}分钟,下次记得及时用药`
				}
				db.query(sql,(err1,result1) => {
					if(err1) throw err1
					res.send(text)
				})
			}
			else
				res.send('链接已过期')
		})
	})
}
module.exports = record

function formatDate(time){
	const date = new Date(time)
	const year = date.getFullYear()
	const month = date.getMonth()+1
	const day = date.getDate()
	const hour = date.getHours() < 10 ? '0'+date.getHours() : date.getHours()
	const minute = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()
	return year + '/' + month + '/' + day + ' ' + hour + ':' + minute
}