require('./config')

const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(require('./routes/user'))

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
