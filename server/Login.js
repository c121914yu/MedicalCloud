/* 用户登录/注册/找回密码 */
const axios = require('axios')
const AppID = 'wxafd522b076e38be0'
const AppSecret = '92b17881f908a5396994349316b06cc5'

function login(app,db){
  app.post('/InspectLogin',(req,res)=>{//检测用户登录是否过期
    let data=req.body
    let sql=`SELECT * FROM UserLoginInfo WHERE phone='${data.phone}'`
    db.query(sql,(err,result)=>{
      if(err) throw err
      let date=result[0].date
      let text=''
      if(data.date === date)
        text='登录成功'
       else
        text='登录信息已过期'
      res.send(text)
    })
  })

  app.post('/GetLoginInfo',(req,res)=>{//检测用户登录，读取登录数据，判断登录是否正确
    let data=req.body
    let sql=`SELECT * FROM UserLoginInfo WHERE phone='${data.phone}'`
    db.query(sql,(err,result)=>{
      if(err) throw err
      let UserLoginInfo=result[0]
      let text=''
      if(UserLoginInfo==undefined)
        text="用户不存在"
      else if(UserLoginInfo.password!=data.password)
        text="密码不正确"
      else
        text={phone:UserLoginInfo.phone,date:UserLoginInfo.date}
      res.send(text)
    })
  })

  app.post('/FindPassword',(req,res)=>{//找回密码
    let data=req.body
    let sql=`select * from UserLoginInfo where phone='${data.phone}'`
    db.query(sql,(err1,result1)=>{
      if(err1) throw err1
      //先判断用户是否存在，不存在即undefine,返回前端提示不存在用户
      if(result1[0]==undefined){
        res.send('该用户不存在')
      }
      //存在该用户，修改密码
      else{
        sql=`UPDATE UserLoginInfo SET password = '${data.password}',date='${data.date}'
          WHERE phone='${data.phone}'`
        db.query(sql,(err2,result2)=>{
          if(err2) throw err2
          console.log(data.phone + ' 修改密码成功')
          res.send(result2)
        })
      }
    })//查询数据库函数结束
  })

  app.post('/UserRegister',(req,res)=>{//用户注册
    let data=req.body
		
		axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${AppID}&secret=${AppSecret}&js_code=${data.openid}&grant_type=authorization_code`)
			.then(ressult => {//获取openid
				data.openid = ressult.data.openid
				
				let sql=`select * from UserLoginInfo where phone='${data.phone}'`
				db.query(sql,(err1,result1)=>{
				  if(err1) throw err1
				  //先判断用户是否存在，不存在即undefine,创建新用户
				  if(result1[0]==undefined){
				    sql='INSERT INTO UserLoginInfo SET ?'
				    db.query(sql,data,(err2,result2)=>{
				      if(err2) throw err2
				      console.log(data.phone + ' 注册成功')
				      res.send(result2)
				    })
				  }
				  //已存在，反馈前端
				  else
				    res.send('用户已存在')
				})//查询数据库函数结束
			})
  })
}
module.exports=login
