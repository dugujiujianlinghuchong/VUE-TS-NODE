const express = require("express");
const router = express.Router();
const multer = require('multer');
const fs = require("fs");
const crypto = require('crypto');
const ObjectID = require('mongodb').ObjectID;
const User = require("../../models/User");
const Images = require("../../models/Images");
// 返回token方法
const token = require("../../utils/token");
// 图片托管的本地磁盘路径
const diskStorageUrl = "C:/Users/yt116/Desktop/DEV/EXPRESS_STATIC/static"

/**
 * @route  POST api/uploadusericon
 * @desc   用户头像上传
 * @access Private
 */
var diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${diskStorageUrl}/usericon`)
  },
  filename: function (req, file, cb) {
    cb(null, `${req.query.id}.jpg`);
  }
})
var upload = multer({ storage: diskStorage });
router.post('/uploadusericon', upload.single('avatar'), function (req, res, next) {
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


/**
 * @route  POST api/uploadimages
 * @desc   图片批量上传
 * @access Private
 */
var memoryStorage = multer.memoryStorage();
var upload2 = multer({ storage: memoryStorage })
router.post('/uploadimages', upload2.array('images', 20), function (req, res, next) {
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

module.exports = router