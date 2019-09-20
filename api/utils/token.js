const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

function token(rule, callback) {
  jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
    if (err) throw err
    callback(token);
  })
}

// 性能差
// function makeToken(rule) {
//   return new Promise((resolve, reject) => {
//     jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
//       if (err) {
//         reject(err);
//       } else {
//         setTimeout(_ => {
//           resolve(token);
//         }, 3000)
//       }
//     })
//   })
// }
// function token(rule, res) {
//   makeToken(rule).then(result => res.json({
//     success: true,
//     token: `Bearer ${result}`
//   }));
// }

module.exports = token;