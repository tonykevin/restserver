const express = require('express')
const _ = require('underscore')
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

// Show a category with id
app.get('/category/:id', (req, res) => {
  let { id } = req.params

  Category.findById(id)
    .exec((err, category) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }

      res.json({
        ok: true,
        category
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

// Update a category
app.put('/category/:id', (req, res) => {
  let { id } = req.params
  let body = _.pick(req.body, ['name', 'user'])

  Category.findOneAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, categoryDB) => {
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
