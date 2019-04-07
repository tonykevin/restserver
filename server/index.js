require('./config')

const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const { resolve } = require('path')

const app = express()
const publicPath = resolve(__dirname, '../public')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(publicPath))
app.use(require('./routes'))

mongoose.connect(
  process.env.MONGO_URI,
  {
    useCreateIndex: true,
    useNewUrlParser: true
  },
  (err) => {
    if (err) {
      throw new Error(err)
    } else {
      console.log('Online database')
    }
  }
)

app.listen(
  process.env.PORT,
  () => console.log(`listening port :${process.env.PORT}`)
)
