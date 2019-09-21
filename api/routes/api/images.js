const express = require("express");
const router = express.Router();
const passport = require("passport");
const Images = require("../../models/Images");
const fs = require("fs");
// ID查找
const ObjectID = require('mongodb').ObjectID;


/* 
* $route  POST api/updateimagelist
* @desc   记录上传图片
* @access Private
*/
router.post("/updateimagelist", passport.authenticate("jwt", { session: false }), (req, res) => {
  Images.findOne({ user: req.user.id, imgID: req.body.imgID }).then(image => {
    if (!image) {
      new Images({ name: req.body.name, imgID: req.body.imgID, user: req.user.id }).save()
        .then(profile => res.json(profile));
    }
  })
})


/* 
* $route  GET api/getimages
* @desc   返回图片列表
* @access Private
*/
router.get("/getimages", (req, res) => {
  Images.find({}).then(images => {
    let result = [];
    images.forEach(image => {
      let { imgID, name } = image;
      let temp = { imgID, name, collected: false };

      if (image.collectors.includes(req.query.id)) {
        temp.collected = true;
      }

      result.push(temp);
    })
    res.json(result);
  })
})


/* 
* $route  GET api/newlog
* @desc   收藏/取消收藏 图片
* @access Private
*/
router.get("/collectimage", (req, res) => {
  Images.findOne({ imgID: req.query.imgID }).then(image => {
    let collectorList = image.collectors;
    let collectStatus = true;

    if (collectorList.includes(req.query.userID)) { // 取消收藏

      collectorList = collectorList.filter(id => id !== req.query.userID);
      collectStatus = false;
    } else { // 收藏
      collectorList.push(req.query.userID);
    }

    Images.findOneAndUpdate({ imgID: req.query.imgID }, { $set: { collectors: collectorList } }, { new: true }).then(response => {
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
  let query = Images.find({ user: ObjectID(req.user.id) });
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
      fs.unlinkSync(`./static/share/${imgID}`);
    })

  res.json({
    success: true,
    msg: "删除成功"
  })
})

module.exports = router