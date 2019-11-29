const mysql =require('mysql')

const db=mysql.createConnection({
  host:'49.232.38.113',
  // 数据库连接时的 主机名或ID地址 内容
  user: 'yujinlong',
  password: '121914yu', // root 密码
  database: 'medical_cloud', // 数据库名
  port:3306
})

db.connect((err)=>{
	if(err) throw err
	console.log("数据库连接成功--")
})

module.exports = db
