const express = require('express')
const { compareSync } = require('bcrypt')
const { sign } = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const { User } = require('../models')

const app = express()
const client = new OAuth2Client(process.env.CLIENT_ID)

app.post('/login', (req, res) => {
  let { email, password } = req.body

  User.findOne({ email }, (err, userDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!userDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'user or password is invalid'
        }
      })
    }

    if (!compareSync(password, userDB.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'user or password is invalid'
        }
      })
    }

    let token = sign(
      { user: userDB },
      process.env.SEED,
      { expiresIn: process.env.TOKEN_EXPIRATION }
    )

    res.json({
      ok: true,
      user: userDB,
      token
    })
  })
})

// Google settings
async function verify (token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID
  })

  const { name, email, picture } = ticket.getPayload()

  return {
    name,
    email,
    img: picture,
    google: true
  }
}

app.post('/google', async (req, res) => {
  let token = req.body.idToken

  if (!token) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'token not provided'
      }
    })
  }

  let googleUser = await verify(token)
    .catch(err => {
      return res.status(403).json({
        ok: false,
        err
      })
    })

  User.findOne({ email: googleUser.email }, (err, userDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (userDB) {
      if (!userDB.google) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'must use normal authentication'
          }
        })
      } else {
        let token = sign(
          { user: userDB },
          process.env.SEED,
          { expiresIn: process.env.TOKEN_EXPIRATION }
        )

        return res.json({
          ok: true,
          user: userDB,
          token
        })
      }
    } else {
      let user = new User({ ...googleUser })
      user.password = ':)'

      user.save((err, userDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          })
        }

        let token = sign(
          { user: userDB },
          process.env.SEED,
          { expiresIn: process.env.TOKEN_EXPIRATION }
        )

        return res.json({
          ok: true,
          user: userDB,
          token
        })
      })
    }
  })
})

module.exports = app
