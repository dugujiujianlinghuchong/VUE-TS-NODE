const bcrypt = require("bcrypt");

// 加密密码
function encrypt(target, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(target, salt, (err, hash) => {
      if (err) throw err;
      res = hash;
      callback(res);
    })
  })
}

module.exports = encrypt;