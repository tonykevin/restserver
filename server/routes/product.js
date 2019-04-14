const express = require('express')
const _ = require('underscore')
const { verifyToken } = require('../middlewares')
const { Product } = require('../models')

const app = express()

/* List products */
app.get('/product', verifyToken, (req, res) => {
  let { limit, since } = req.query
  const filter = {
    available: true
  }

  since = Number(since) || 0
  limit = Number(limit) || 5

  Product.find(filter)
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

      Product.countDocuments(filter, (err, size) => {
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
app.get('/product/:id', verifyToken, (req, res) => {
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

      if (!productDB || !productDB.available) {
        return res.status(404).json({
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
app.post('/product', verifyToken, (req, res) => {
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

    res.status(201).json({
      ok: true,
      category: productDB
    })
  })
})

/* Update a product */
app.put('/product/:id', verifyToken, (req, res) => {
  let { id } = req.params
  let body = _.pick(
    req.body,
    ['available', 'category', 'description', 'name', 'unitPrice']
  )

  Product.findById(id, (err, productDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!productDB) {
      return res.status(404).json({
        ok: false,
        err: {
          message: 'not exist the product'
        }
      })
    }

    let modified = false

    for (let key in body) {
      if (body[key] && !(body[key] === String(productDB[key]))) {
        productDB[key] = body[key]
        modified = true
      }
    }

    if (!modified) {
      return res.status(304).end()
    }

    productDB.save((err, productDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }

      res.json({
        ok: true,
        product: productDB
      })
    })
  })
})

/* Delete a product */
app.delete('/product/:id', verifyToken, (req, res) => {
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
        return res.status(404).json({
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
