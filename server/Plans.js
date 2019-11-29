var fs = require('fs');
var formidable = require("formidable");
var path = require("path")
var uuid = require('uuid')

function plans(app,db){
	var sql
  app.post('/GetPlans',(req,res)=>{
    let data=req.body
    sql=`select * from Plans where phone='${data.phone}'`
    db.query(sql,(err,result)=>{
      if(err) throw err
      res.send(result)
    })
  })

  app.post('/upRecord',(req,res)=>{//上传录音
		var form = new formidable.IncomingForm()
		let uploadDir = path.join(__dirname, "records");
		form.uploadDir = uploadDir;//本地文件夹目录路径
		
		form.parse(req, (err, data, files) => {
		  let oldPath = files.audio.path
			const newname = uuid.v1() + '.mp3'
		  let newPath = path.join(path.dirname(oldPath),newname)

			fs.rename(oldPath, newPath,()=>{})
		  var downUrl = "http://localhost:4000/records/" + newname
			console.log(downUrl)
			res.send(downUrl)
		 })
	})
	
	app.post('/AddPlan',(req,res) => {
		let data=req.body
		const ID = uuid.v1()
		sql='insert into Plans set?'
		//计算最近一次计划执行的时间戳
		data.NextTime = computedDate(data)/1000 
		data.PlanID = ID
		db.query(sql,data,(err,result)=>{
			if(err) throw err
			console.log(data.phone+' 添加计划成功')
			res.send(ID)
		})
	})

  app.post('/ChangePlan',(req,res)=>{
    let data=req.body
		let NextTime = computedDate(data) / 1000
    sql=`update Plans set EquipmentID='${data.EquipmentID}',NextTime=${NextTime},
         date='${data.date}',UseTimes='${data.UseTimes}',Frequency=${data.Frequency}
         where PlanID='${data.PlanID}'`
    db.query(sql,(err,result)=>{
      if(err) throw err
      res.send('更新数据成功')
    })
  })

  app.post('/RemovePlan',(req,res)=>{
    let data=req.body
    sql=`delete from Plans where PlanID='${data.PlanID}'`
    db.query(sql,(err,result)=>{
      if(err) throw err
      res.send(data.PlanID+' 删除成功')
    })
  })
	
	app.get('/records/:name', function (req, res, next) {//检测音频
	  var options = {
	    root: __dirname + '/records/',
	    dotfiles: 'deny',
	    headers: {
	        'x-timestamp': Date.now(),
	        'x-sent': true
	    }
	  };
	  var fileName = req.params.name;
	  res.sendFile(fileName, options, function (err) {
	    if (err) 
	      console.log(err)
	    else 
	      console.log('播放录音')
	  })
	})
}
module.exports=plans

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