/*
 * Verify token for a image
 */

const { verify } = require('jsonwebtoken')

let verifyTokenImg = (req, res, next) => {
  const { token } = req.query

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

module.exports = verifyTokenImg
