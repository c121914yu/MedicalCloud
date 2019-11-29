/* 设备操作 */
function control(app,db){
  var sql
	/* 获取设备信息 */
	app.post('/GetEquipment',(req,res)=>{
		let data=req.body
    if(data.ID=='*')//查询所有设备
      sql=`select * from UserEquipment where phone='${data.phone}'`
    else//查询单个设备
      sql=`select * from UserEquipment where ID='${data.ID}'`
    db.query(sql,(err,result)=>{
      if(err) throw err
      res.send(result)
    })
	})
	/* 获取设备信息 */

  /* 修改设备信息*/
  app.post('/AmendInfo',(req,res)=>{
    let data=req.body
    sql=`update UserEquipment set name='${data.name}',remark='${data.remark}'
      where ID='${data.ID}'`
    db.query(sql,(err,result)=>{
      if(err) throw err
      res.send('修改成功')
    })
  })
  /* 修改设备信息*/

  /* 修改设备储药情况*/
  app.post('/SetMedicalInfo',(req,res)=>{
    let data=req.body
    sql=`update UserEquipment set MedicalInfo='${data.MedicalInfo}' where ID='${data.ID}'`
    db.query(sql,(err,result)=>{
      if(err) throw err
      res.send('修改储药情况成功')
    })
  })
  /* 修改设备储药情况*/

	/* 添加新设备 */
  app.post('/AddEquipment',(req,res)=>{
    let data=req.body
    /* 判断设备标识码是否正确,从设备数据库中查找
       标识码不存在,返回前端提示用户
    */
    if(!data.ID)
      res.send("标识码错误")
    else{
      sql='INSERT INTO UserEquipment SET ?'
      db.query(sql,data,(err,result)=>{
        if(err) throw err
        console.log(data.phone + " 添加设备成功")
        res.send("添加设备成功")
      })
    }
  })
	/* 添加新设备 */

  /* 删除设备*/
  app.post('/RemoveEquipment',(req,res)=>{
    let data=req.body
    sql=`delete from UserEquipment where ID='${data.ID}'`
    db.query(sql,(err,result)=>{
      if(err) throw err
      res.send('删除成功')
    })
  })
  /* 删除设备*/
}
module.exports=control
