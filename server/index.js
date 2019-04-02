require('./config')

const bodyParser = require('body-parser')
const express = require('express')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/user', (req, res) => {
  res.json('get user')
})

app.post('/user', (req, res) => {
  let user = req.body

  if (!user.name) {
    res.status(400).json({
      ok: false,
      message: 'Name is required'
    })
  } else {
    res.json({
      user
    })
  }
})

app.put('/user/:id', (req, res) => {
  let id = req.params.id

  res.json({
    id
  })
})

app.delete('/user', (req, res) => {
  res.json('delete  user')
})

app.listen(
  process.env.PORT,
  () => console.log(`listening port :${process.env.PORT}`)
)
