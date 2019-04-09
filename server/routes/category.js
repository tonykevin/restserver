const express = require('express')
const { verifyToken } = require('../middlewares')
const { Category } = require('../models')

const app = express()

// List categories
app.get('/category', verifyToken, (req, res) => {
  Category.find({})
    .exec((err, categories) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }

      Category.countDocuments({}, (err, size) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          })
        }

        res.json({
          ok: true,
          categories,
          size
        })
      })
    })
})

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
