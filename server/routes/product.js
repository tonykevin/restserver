const express = require('express')
const _ = require('underscore')
const { verifyToken } = require('../middlewares')
const { Product } = require('../models')

const app = express()

/* List products */
app.get('/products', verifyToken, (req, res) => {
  let { limit, since } = req.query

  since = Number(since) || 0
  limit = Number(limit) || 5

  Product.find({})
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

  Product.findById(id)
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

/* Update a product */
app.put('/products/:id', (req, res) => {
  let { id } = req.params
  let body = _.pick(req.body, ['name', 'unitPrice', 'description', 'category'])

  Product.findByIdAndUpdate(
    id,
    body,
    { context: 'query', new: true, runValidatos: true },
    (err, productDB) => {
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
        product: productDB
      })
    }
  )
})

/* Delete a product */
app.delete('/products/:id', verifyToken, (req, res) => {
  let { id } = req.params

  let changeAvailable = { available: false }

  Product.findByIdAndUpdate(
    id,
    changeAvailable,
    { new: true },
    (err, delProduct) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }

      if (!delProduct) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'not exist the product'
          }
        })
      }

      res.json({
        ok: true,
        product: delProduct
      })
    }
  )
})

module.exports = app
