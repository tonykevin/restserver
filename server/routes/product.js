const express = require('express')
const { verifyToken } = require('../middlewares')
const { Product } = require('../models')

const app = express()

// Create a user
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
