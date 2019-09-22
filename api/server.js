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

// 静态资源目录
app.use(express.static('static'));

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
    cb(null, './static/usericon')
  },
  filename: function (req, file, cb) {
    const newIconName = `${req.query.id}.jpg`;
    // 删除旧头像
    // User.findOne({ _id: ObjectID(req.query.id) })
    //   .then(response => {
    //     console.log(response.avatar, "??????????");
    //     if (response.avatar !== "default.jpg") {
    //       fs.unlinkSync(`./static/usericon/${response.avatar}`);
    //     }
    //   });
    cb(null, newIconName);
  }
})
var upload = multer({ storage: storage });
app.post('/api/uploadusericon', upload.single('avatar'), function (req, res, next) {
  const newIconName = `${req.query.id}.jpg`;
  User.findOneAndUpdate({ _id: ObjectID(req.query.id) }, { $set: { avatar: newIconName } }, { new: true })
    .then(response => {
      const rule = {
        id: response._id,
        name: response.name,
        email: response.email,
        avatar: response.avatar
      }

      // 返回登录口令
      token(rule, token => res.json({ success: true, token: `Bearer ${token}` }))
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
    const fsHash = crypto.createHash('md5');
    fsHash.update(file.buffer);
    let imgHashName = `${fsHash.digest('hex')}.${file.originalname.split(".")[1]}`;
    let imgOrgName = file.originalname;

    // 将文件信息录入数据库
    Images.findOne({ imgID: imgHashName })
      .then(img => {
        if (img) {
          console.log("这张图片已存在");
        } else {
          // 创建新纪录
          const newImg = new Images({
            user: userID,
            name: imgOrgName,
            imgID: imgHashName,
          })

          newImg.save().then(response => {
            console.log("图片上传成功")
          }).catch(err => console.log(err))
        }
      })

    // 写入图片
    fs.writeFile(`./static/share/${imgHashName}`, file.buffer, function (err) {
      if (err) { console.log(err) }
    });
  })

  res.json({
    success: true,
    msg: "图片上传成功"
  })
  // const newIconName = `${req.query.id}-${req.query.date}.${req.file.originalname.split(".")[1]}`;
  // User.findOneAndUpdate({ _id: ObjectID(req.query.id) }, { $set: { avatar: newIconName } }, { new: true })
  //   .then(response => {
  //     const rule = {
  //       id: response._id,
  //       name: response.name,
  //       email: response.email,
  //       avatar: response.avatar
  //     }

  //     // 返回登录口令
  //     token(rule, token => res.json({ success: true, token: `Bearer ${token}` }))
  //   });
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