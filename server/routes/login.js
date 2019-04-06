const express = require('express')
const { compareSync } = require('bcrypt')
const { User } = require('../models')

const app = express()

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

    res.json({
      ok: true,
      user: userDB,
      token: '123'
    })
  })
})

module.exports = app
