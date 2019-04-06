/*
 * Verify token
 */

const { verify } = require('jsonwebtoken')

let verifyToken = (req, res, next) => {
  let token = req.get('Authorization')
  verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: 'invalid token'
        }
      })
    }

    req.user = decoded.user
    next()
  })
}

module.exports = verifyToken
