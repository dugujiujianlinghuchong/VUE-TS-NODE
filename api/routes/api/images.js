const express = require("express");
const router = express.Router();
const passport = require("passport");
const Images = require("../../models/Images");
// ID查找
const ObjectID = require('mongodb').ObjectID;


/* 
* $route  POST api/newlog
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
* $route  POST api/newlog
* @desc   返回图片列表
* @access Private
*/
router.get("/getimages", (req, res) => {
  Images.find({}).then(images => {
    res.json(images);
  })
})

module.exports = router