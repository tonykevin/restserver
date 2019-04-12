const express = require('express')
const { verifyToken } = require('../middlewares')
const { Product } = require('../models')

const app = express()

/* List products */
app.get('/products', verifyToken, (req, res) => {
  let { limit, since } = req.query

  since = Number(since) || 0
  limit = Number(limit) || 5

  Product.find({}, 'name unitPrice description category user')
    .sort('name')
    .skip(since)
    .limit(limit)
    .populate('category', 'description')
    .populate('user', 'name email')
    .exec((err, products) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }

      Product.countDocuments({}, (err, size) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          })
        }

        res.json({
          ok: true,
          products,
          size
        })
      })
    })
})

/* Show a product */
app.get('/products/:id', verifyToken, (req, res) => {
  let { id } = req.params

  Product.findById(id, 'name unitPrice category')
    .populate('category', 'description')
    .populate('user', 'name email')
    .exec((err, productDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }

      if (!productDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'not exist the product'
          }
        })
      }

      res.json({
        ok: true,
        category: productDB
      })
    })
})

/* Create a product */
app.post('/products', verifyToken, (req, res) => {
  let { name, unitPrice, description, category } = req.body

  let product = new Product({
    name,
    unitPrice,
    description,
    category,
    user: req.user._id
  })

  product.save((err, productDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      category: productDB
    })
  })
})

module.exports = app
