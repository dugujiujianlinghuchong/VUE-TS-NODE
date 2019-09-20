const nodemailer = require('nodemailer');

// 发送邮件
function sendMail(address, mailInfo) {
  // 发送邮箱配置
  let transporter = nodemailer.createTransport({
    service: 'qq',
    auth: {
      user: '1160108626@qq.com',
      pass: 'zbruvpimzejlichg'
    }
  });
  let mailOptions = {
    from: '1160108626@qq.com', // 发送者
    to: address, // 接受者,可以同时发送多个,以逗号隔开
    subject: mailInfo.subject, // 标题
    // text: mailInfo.text, // 文本
    html: `
    <h1>点击下面的链接确认修改密码:</h1>
    <h3 style="color:red">此链接时效为10分钟</h3>
    <a href="http://localhost:8080/confirmupdatepwd?userID=${mailInfo.userID}">重置密码</a>
    `
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
      return;
    }
  });
}

module.exports = sendMail;