const express =require('express')
const app=express()
const fs = require("fs");
const https = require("https");
const path = require("path");

const bodyParser=require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'records')))

//导入证书
const privateKey = fs.readFileSync(
  path.join(__dirname, "./Https/2_www.jinlongyuchitang.cn.key"),
  "utf8"
);
const certificate = fs.readFileSync(
  path.join(__dirname, "./Https/1_www.jinlongyuchitang.cn_bundle.crt"),
  "utf8"
);
const credentials = {
  key: privateKey,
  cert: certificate
};
app.get("/", (req, res) => {
  res.send("hello world");
});
const httpsServer = https.createServer(credentials, app);

/* 连接数据库 */
const db =require('./connect')

/* 登录 */
const login=require('./Login')
login(app,db)

/* 设备操作 */
const controlequipment=require('./EquipmentInfo')
controlequipment(app,db)

/* 计划设置 */
const plans=require('./Plans')
plans(app,db)

/* 记录操作 */
const record = require('./Record')
record(app,db)

/* 我的药柜 */
const MyMedical = require('./MyMedical')
MyMedical(app,db)

/* 定时发送提醒 */
const remind = require('./Remind')
remind(app,db)

/* 定时任务 */
const timeTask = require('./timeTask')
timeTask(app,db)

// 监听端口
app.listen(4000,() => {
	console.log('success listen at port:4000......')
})
