const express = require('express')
const { hashSync } = require('bcrypt')
const _ = require('underscore')
const { User } = require('../models')

const app = express()

app.get('/user', (req, res) => {
  let { limit, since } = req.query

  since = Number(since) || 0
  limit = Number(limit) || 5

  User.find({})
    .skip(since)
    .limit(limit)
    .exec((err, users) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }

      res.json({
        ok: true,
        users
      })
    })
})

app.post('/user', (req, res) => {
  let { email, name, password, role } = req.body

  let user = new User({
    email,
    name,
    password: hashSync(password, 10),
    role
  })

  user.save((err, userDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      user: userDB
    })
  })
})

app.put('/user/:id', (req, res) => {
  let { id } = req.params
  let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state'])

  User.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, userDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }

      res.json({
        ok: true,
        user: userDB
      })
    }
  )
})

app.delete('/user', (req, res) => {
  res.json('delete  user')
})

module.exports = app
