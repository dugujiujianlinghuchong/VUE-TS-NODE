const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const multer = require('multer');
const port = process.env.PORT || 5000;
const crypto = require('crypto');
const fs = require("fs");
const User = require("./models/User");
const Images = require("./models/Images");
// 返回token方法
const token = require("./utils/token");
// ID查找
const ObjectID = require('mongodb').ObjectID;
// 数据库地址
const db = require("./config/keys").mongoURI;
// 引入users.js
const users = require("./routes/api/users");
// 引入profile.js
const profile = require("./routes/api/profile");
// images.js
const images = require("./routes/api/images");
// 图片托管的本地磁盘路径
const diskStorageUrl = "C:/Users/yt116/Desktop/DEV/EXPRESS_STATIC/static"

// 使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// passport初始化
app.use(passport.initialize());
require("./config/passport")(passport);

// 使用中间件允许跨域
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Content-Type");
//   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//   next();
// })

// 用户上传头像
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, './static/usericon')
    cb(null, `${diskStorageUrl}/usericon`)
  },
  filename: function (req, file, cb) {
    cb(null, `${req.query.id}.jpg`);
  }
})
var upload = multer({ storage });
app.post('/api/uploadusericon', upload.single('avatar'), function (req, res, next) {
  User.findOneAndUpdate({ _id: ObjectID(req.query.id) }, { $set: { avatar: `${req.query.id}.jpg` } }, { new: true })
    .then(result => {
      let resBody = {
        id: result._id,
        name: result.name,
        email: result.email,
        avatar: result.avatar
      }

      // 返回登录口令
      token(resBody, token => res.json({ success: true, token: `Bearer ${token}` }))
    });
})

// 图片批量上传
var storage2 = multer.memoryStorage();
var upload2 = multer({ storage: storage2 })
app.post('/api/uploadimages', upload2.array('images', 20), function (req, res, next) {
  let fileList = req.files;
  let userID = req.query.id;

  fileList.forEach(file => {
    // 根据文件流生成哈希码
    let fsHash = crypto.createHash('md5');
    fsHash.update(file.buffer);
    let imgHashName = `${fsHash.digest('hex')}.${file.originalname.split(".")[1]}`;
    let imgOrgName = file.originalname;

    // 将文件信息录入数据库
    Images.findOne({ imgID: imgHashName })
      .then(result => {
        if (result) {
          console.log("这张图片已存在");
        } else {
          // 创建新纪录
          let newImg = new Images({
            user: userID,
            name: imgOrgName,
            imgID: imgHashName,
          })

          newImg.save().then(result => {
            console.log("图片上传成功")
          }).catch(err => console.log(err))
        }
      })

    // 写入图片
    fs.writeFile(`${diskStorageUrl}/share/${imgHashName}`, file.buffer, function (err) {
      if (err) { console.log(err) }
    });
  })

  res.json({
    success: true,
    msg: "图片上传成功"
  })
})

// 连接到数据库
mongoose.connect(db)
  .then(_ => {
    console.log("数据库已连接");
  })
  .catch(_ => {
    console.log("连接失败");
  })

// 使用routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/images", images);

app.listen(port, _ => {
  console.log(`Server is running on port ${port}`);
})