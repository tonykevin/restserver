const bodyParser = require('body-parser')
const express = require('express')

const PORT = process.env.PORT || 3000
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/user', (req, res) => {
  res.json('get user')
})

app.post('/user', (req, res) => {
  let person = req.body
  res.json({
    person
  })
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

app.listen(PORT, () => console.log(`listening port :${PORT}`))
