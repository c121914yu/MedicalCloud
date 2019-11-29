/* 个人药柜 */
var uuid = require('node-uuid');

function MyMedical(app,db){
	app.post('/MyMedical/GetMedical',(req,res) => {
		let data = req.body
		let sql = `select * from UserMedical where phone='${data.phone}'`
		db.query(sql,(err,result) => {
			if(err) throw err
			res.send(result)
		})
	})
	
	app.post('/MyMedical/AddMedical',(req,res) => {
		let data = req.body
		data.ID = uuid.v1()
		let sql = 'insert into UserMedical set?'
		db.query(sql,data,(err,result) => {
			if(err)	throw err
			res.send(data.ID)
		})
	})
	
	app.post('/MyMedical/ChangeMedical',(req,res) => {
		let data = req.body
		let sql = `update UserMedical set medical='${data.medical}' where ID='${data.ID}'`
		db.query(sql,data,(err,result) => {
			if(err)	throw err
			res.send('修改成功')
		})
	})
	
	app.post('/MyMedical/Remove',(req,res) => {
		let data = req.body
		let sql = `delete from UserMedical where ID='${data.ID}'`
		db.query(sql,data,(err,result) => {
			if(err)	throw err
			res.send('删除成功')
		})
	})
}

module.exports  = MyMedical