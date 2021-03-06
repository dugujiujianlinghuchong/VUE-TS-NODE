const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");
// 发送邮件方法
const sendMail = require("../../utils/sendMail");
// 密码加密方法
const encrypt = require("../../utils/encrypt");
// 返回token方法
const token = require("../../utils/token");
// ID查找
const ObjectID = require('mongodb').ObjectID;


/**
 * @route  POST api/users/register
 * @desc   用户注册
 * @access Public
 */
router.post("/register", (req, res) => {
  // 查询数据库中是否已存在邮箱
  User.findOne({ email: req.body.email })
    .then(result => {
      if (result) {
        res.json({
          success: false,
          msg: "该邮箱已被注册"
        })
      } else {
        // 创建账号数据
        let newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar: "default.jpg", // 设置默认头像
          password: req.body.password,
        })

        // 加密密码并储存至数据库
        encrypt(newUser.password, encryptedWord => {
          newUser.password = encryptedWord;
          newUser.save().then(result => res.json({
            success: true,
            msg: "账号注册成功"
          })).catch(err => console.log(err))
        })
      }
    })
})


/**
 * @route  POST api/users/login
 * @desc   用户登录 返回token
 * @access Public
 */
router.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  // 查询数据库
  User.findOne({ email })
    .then(result => {
      if (!result) {
        res.json({
          success: false,
          msg: "用户不存在"
        })
      }

      if (!result.active) {
        res.json({
          success: false,
          msg: "此账号尚未激活"
        })
      }

      // 匹配密码
      bcrypt.compare(password, result.password)
        .then(isMatch => {
          if (isMatch) {
            let resBody = {
              id: result.id,
              name: result.name,
              email: result.email,
              avatar: result.avatar
            }

            // 返回登录口令
            token(resBody, token => res.json({ success: true, token: `Bearer ${token}` }))
          } else {
            res.json({
              success: false,
              msg: "密码错误"
            })
          }
        })
    })
})


/**
 * @route  POST api/users/update
 * @desc   账户修改 返回token
 * @access Private
 */
router.post("/update", passport.authenticate("jwt", { session: false }), (req, res) => {
  let userInfo = {
    name: req.body.name,
    password: req.body.password
  }

  // 加密密码并更新至数据库
  encrypt(userInfo.password, encryptedWord => {
    userInfo.password = encryptedWord;
    // 查询并更新
    User.findOneAndUpdate({ _id: ObjectID(req.user.id) }, { $set: userInfo }, { new: true })
      .then(result => {
        let resBody = {
          id: result.id,
          name: result.name,
          email: result.email,
          avatar: result.avatar
        }
        // 返回登录口令
        token(resBody, token => res.json({ success: true, token: `Bearer ${token}` }))
      });
  })
})


/**
 * @route  POST api/users/sendpwd
 * @desc   发送密码
 * @access Public
 */
router.post("/foundpwd", (req, res) => {
  let condition = {
    name: req.body.name,
    email: req.body.email,
  }
  // 用户ID
  let userID = "";
  // 查询数据库
  User.findOne(condition).then(result => {
    if (result) {
      // 旧密码
      let oldPassword = result.password;
      // 用户id
      userID = result._id;
      // 加密新密码并更新至数据库
      encrypt(req.body.password, res => {
        User.findOneAndUpdate({ _id: ObjectID(userID) }, { $set: { password: res, active: false } }, { new: true })
          .then(updatedUserInfo => {
            setTimeout(() => {
              User.findOne({ _id: ObjectID(userID) }).then(user => {
                // 若没有确认修改，则将账号密码还原
                if (!user.active) {
                  User.findOneAndUpdate({ _id: ObjectID(userID) }, { $set: { password: oldPassword, active: true } }, { new: true })
                    .then(res => {
                      console.log("10分钟后还原密码")
                    })
                }
              })
            }, 2160000)
          });
      })

      // 发送确认邮件
      sendMail(condition.email, {
        subject: "看批网找回密码",
        userID
      })

      res.json({
        success: true,
        msg: "修改密码确认邮件已发送，请稍后在您的邮箱查收"
      })
    } else {
      res.json({
        success: false,
        msg: "未找到用户，请检查输入是否正确"
      })
    }
  })
})


/**
 * @route  GET api/users/confirmupdatepwd
 * @desc   确认修改密码
 * @access Public
 */
router.get("/confirmupdatepwd", (req, res) => {
  // 查询并更新
  User.findOne({ _id: ObjectID(req.query.id) })
    .then(result => {
      if (result) {
        if (result.active) {
          res.json({
            success: false,
            msg: "密码修改请求已过期"
          })
          return;
        }

        User.findOneAndUpdate({ _id: ObjectID(req.query.id) }, { $set: { active: true } }, { new: true })
          .then(result => {
            res.json({
              success: true,
              msg: "密码已修改"
            })
          });
      }
    })
})

module.exports = router