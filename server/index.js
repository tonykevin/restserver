require('./config')

const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(require('./routes/user'))

mongoose.connect(process.env.URL_DB, { useNewUrlParser: true }, (err, res) => {
  if (err) {
    throw new Error(err)
  } else {
    console.log('Online database')
  }
})

app.listen(
  process.env.PORT,
  () => console.log(`listening port :${process.env.PORT}`)
)
