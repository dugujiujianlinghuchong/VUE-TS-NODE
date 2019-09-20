const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");
const Profile = require("../../models/Profiles");
const User = require("../../models/User");
// ID查找
const ObjectID = require('mongodb').ObjectID;
// 引入验证方法
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");


/* 
* $route  POST api/profile
* @desc   获取当前登录用户的个人信息
* @access public
*/
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
    .populate("user", ["name", "email", "avatar"]) // 关联到user表
    .then(profile => {
      if (!profile) {
        errors.noprofile = "该用户的信息不存在！";
        return res.status(404).json(errors);
      }

      res.json(profile)
    })
    .catch(err => res.status(404).json(err))
})


/* 
* $route  POST api/profile/handle/:handle
* @desc   通过handle获取个人信息
* @access public
*/
router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "email", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "未找到该用户的信息！";
        return res.status(404).json(errors);
      }

      res.json(profile)
    })
    .catch(err => res.status(404).json(err))
})


/* 
* $route  POST api/profile/user/:user_id
* @desc   通过id获取个人信息
* @access public
*/
router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "email", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "未找到该用户的信息！";
        return res.status(404).json(errors);
      }

      res.json(profile)
    })
    .catch(err => res.status(404).json(err))
})


/* 
* $route  POST api/profile/all
* @desc   获取所有用户信息
* @access public
*/
router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "email", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "没有任何用户的信息！";
        return res.status(404).json(errors);
      }

      res.json(profile)
    })
    .catch(err => res.status(404).json(err))
})


/* 
* $route  POST api/newlog
* @desc   更新图片浏览日志
* @access Private
*/
router.post("/newlog", passport.authenticate("jwt", { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id, imgID: req.body.imgID }).then(profile => {
    if (profile) {
      Profile.findOneAndUpdate({ user: req.user.id, imgID: req.body.imgID }, { $set: { viewCount: profile.viewCount + 1, lastViewTime: Date.now() } }, { new: true })
        .then(updatedProfile => res.json(updatedProfile));
    } else {
      new Profile({ name: req.body.name, imgID: req.body.imgID, user: req.user.id }).save()
        .then(profile => res.json(profile));
    }
  })
})


/* 
* $route  POST api/getlog
* @desc   查询图片浏览日志
* @access Private
*/
router.get("/getlog", passport.authenticate("jwt", { session: false }), (req, res) => {
  let { pageIndex, pageSize, imgName } = req.query;
  let query = Profile.find({ user: req.user.id });
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
      Profile.find({ user: req.user.id }, (err, result) => {
        jsonArray = { rows: rs, total: result.length };
        res.json(jsonArray);
      });

    }
  });
})


/* 
* $route  POST api/profile/experience
* @desc   添加个人经历
* @access Private
*/
router.post("/experience", passport.authenticate("jwt", { session: false }), (req, res) => {
  console.log("22222222222222222222222222222")
  // 字段验证
  // const { errors, isValid } = validateExperienceInput(req.body);
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (profile) {
        const newExp = {};
        ["title", "company", "location", "from", "to", "description"].forEach(fieldName => {
          newExp[fieldName] = req.body[fieldName];
        })

        profile.experience.unshift(newExp);

        profile.save().then(savedProfile => {
          res.json(savedProfile);
        })
      }
    })
})


/* 
* $route  POST api/profile/education
* @desc   添加个人学历
* @access Private
*/
router.post("/education", passport.authenticate("jwt", { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (profile) {
        const newEdu = {};
        ["school", "degree", "fieldofstudy", "from", "to", "description"].forEach(fieldName => {
          newEdu[fieldName] = req.body[fieldName];
        })

        profile.education.unshift(newEdu);

        profile.save().then(savedProfile => {
          res.json(savedProfile);
        })
      }
    })
})


/* 
* $route  DELETE api/profile/experience/:exp_id
* @desc   删除个人经历
* @access Private
*/
router.delete("/experience/:exp_id", passport.authenticate("jwt", { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

      profile.experience.splice(removeIndex, 1);
      profile.save().then(updatedProfile => res.json(updatedProfile));
    })
    .catch(err => res.status(404).json(err));
})


/* 
* $route  DELETE api/profile/education/:edu_id
* @desc   删除个人学历
* @access Private
*/
router.delete("/education/:edu_id", passport.authenticate("jwt", { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const removeIndex = profile.education.map(item => item._id).indexOf(req.params.edu_id);

      profile.education.splice(removeIndex, 1);
      profile.save().then(updatedProfile => res.json(updatedProfile));
    })
    .catch(err => res.status(404).json(err));
})


/* 
* $route  DELETE api/delperson
* @desc   删除整个用户
* @access Private
*/
router.delete("/delperson", passport.authenticate("jwt", { session: false }), (req, res) => {
  Profile.findOneAndRemove({ user: req.user.id })
    .then(_ => {
      User.findOneAndRemove({ _id: req.user.id })
        .then(_ => res.json({ success: true }));
    })
})

module.exports = router;