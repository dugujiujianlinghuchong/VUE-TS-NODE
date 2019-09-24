const express = require("express");
const router = express.Router();
const passport = require("passport");
const Images = require("../../models/Images");
const fs = require("fs");
// ID查找
const ObjectID = require('mongodb').ObjectID;
// 图片托管的本地磁盘路径
const diskStorageUrl = "C:/Users/yt116/Desktop/DEV/EXPRESS_STATIC/static"


/* 
* $route  POST api/updateimagelist
* @desc   记录上传图片
* @access Private
*/
router.post("/updateimagelist", passport.authenticate("jwt", { session: false }), (req, res) => {
  Images.findOne({ user: req.user.id, imgID: req.body.imgID }).then(result => {
    if (!result) {
      new Images({ name: req.body.name, imgID: req.body.imgID, user: req.user.id }).save()
        .then(result => res.json(result));
    }
  })
})


/* 
* $route  GET api/getimages
* @desc   返回图片列表
* @access Private
*/
router.get("/getimages", passport.authenticate("jwt", { session: false }), (req, res) => {
  let listType = req.query.listType

  Images.find({}).populate("user", ["name"]).sort({ uploadTime: -1 }).then(result => {
    let imgList = [];
    let filtedImages = [];

    if (listType === "myupload") {
      filtedImages = result.filter(image => {
        return image.user._id.toString() === req.user.id
      });
    } else if (listType === "mycollection") {
      filtedImages = result.filter(image => image.collectors.includes(req.user.id))
    } else {
      filtedImages = result;
    }

    filtedImages.forEach(image => {
      let { imgID, name, user, uploadTime } = image;
      let temp = { imgID, name, user, uploadTime, collected: false };

      if (image.collectors.includes(req.query.id)) {
        temp.collected = true;
      }

      imgList.push(temp);
    })
    res.json(imgList);
  })
})


/* 
* $route  GET api/newlog
* @desc   收藏/取消收藏 图片
* @access Private
*/
router.get("/collectimage", (req, res) => {
  Images.findOne({ imgID: req.query.imgID }).then(result => {
    let collectorList = result.collectors;
    let collectStatus = true;

    if (collectorList.includes(req.query.userID)) { // 取消收藏
      collectorList = collectorList.filter(id => id !== req.query.userID);
      collectStatus = false;
    } else { // 收藏
      collectorList.push(req.query.userID);
    }

    Images.findOneAndUpdate({ imgID: req.query.imgID }, { $set: { collectors: collectorList } }, { new: true }).then(result => {
      if (collectStatus) {
        res.json({
          collectStatus,
          msg: "收藏图片成功"
        })
      } else {
        res.json({
          collectStatus,
          msg: "移出收藏成功"
        })
      }
    })
  })
})


/* 
* $route  POST api/getlog
* @desc   查询图片上传记录
* @access Private
*/
router.get("/getuploadlog", passport.authenticate("jwt", { session: false }), (req, res) => {
  let { pageIndex, pageSize, imgName } = req.query;
  let query = Images.find({ user: ObjectID(req.user.id) }).sort({ uploadTime: -1 });
  query.skip((pageIndex - 1) * pageSize);
  query.limit(parseInt(pageSize));
  if (imgName) {
    query.where('name', { $regex: new RegExp(imgName, 'i') });
  }
  //计算分页数据
  query.exec((err, rs) => {
    if (err) {
      console.log(err, "错误信息")
    } else {
      //计算数据总数
      Images.find({ user: ObjectID(req.user.id) }, (err, result) => {
        jsonArray = { rows: rs, total: result.length };
        res.json(jsonArray);
      });
    }
  });
})


/* 
* $route  POST api/getlog
* @desc   删除图片
* @access Private
*/
router.delete("/deleteimg", passport.authenticate("jwt", { session: false }), (req, res) => {
  let userID = req.user.id;
  let imgID = req.query.imgID;

  Images.findOneAndRemove({ user: ObjectID(userID), imgID })
    .then(_ => {
      // 注意路径
      fs.unlinkSync(`${diskStorageUrl}/share/${imgID}`);
    })

  res.json({
    success: true,
    msg: "删除成功"
  })
})

module.exports = router