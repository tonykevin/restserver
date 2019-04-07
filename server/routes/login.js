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

  const payload = ticket.getPayload()

  console.log(payload.name)
  console.log(payload.email)
  console.log(payload.picture)
}

app.post('/google', (req, res) => {
  let token = req.body.idtoken

  verify(token)

  res.json({
    token
  })
})

module.exports = app
