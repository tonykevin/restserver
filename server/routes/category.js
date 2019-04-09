const express = require('express')
const { verifyToken } = require('../middlewares')
const { Category } = require('../models')

const app = express()

// Create a category
app.post('/category', verifyToken, (req, res) => {
  let category = new Category({
    name: req.body.name,
    user: req.user._id
  })

  category.save((err, categoryDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      category: categoryDB
    })
  })
})

module.exports = app
