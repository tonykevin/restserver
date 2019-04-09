/*
 * Routers
 */

const express = require('express')

const app = express()

app.use(require('./category'))
app.use(require('./login'))
app.use(require('./user'))

module.exports = app
