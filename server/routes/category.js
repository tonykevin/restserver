const express = require('express')
const { verifyAdminRole, verifyToken } = require('../middlewares')
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
    description: req.body.description,
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
  let { description } = req.body

  Category.findByIdAndUpdate(
    id,
    { description },
    { new: true, runValidators: true, context: 'query' },
    (err, categoryDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }

      if (!categoryDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'not exist the category'
          }
        })
      }

      res.json({
        ok: true,
        category: categoryDB
      })
    })
})

// Delete a category
app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, res) => {
  let { id } = req.params

  Category.findByIdAndDelete(id, (err, deleteCategory) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!deleteCategory) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'category not found'
        }
      })
    }

    res.json({
      ok: true,
      category: deleteCategory
    })
  })
})

module.exports = app
