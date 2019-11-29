var nodemailer = require('nodemailer')

SendEmail()

function SendEmail(){
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
						<h2>17:00到了,请记得按时用药</h2>
						<h3>需要服用的药：</h3>
						<ul style="list-style: none;padding: 0;">
							<li>小菜胡颗粒*2</li><li>小菜胡颗粒*2</li><li>小菜胡颗粒*2</li>
						</ul>
						<a href="#" style="text-decoration: none;color: #4DC71F;">确认已服药</a>
					</div>
				`
	}
	
	transporter.sendMail(mailOptions,(error,info) => {
	  if(error)
	    return console.log(error);
	   console.log('发送成功');
	});
}