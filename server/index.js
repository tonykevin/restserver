const express = require('express')

const PORT = process.env.PORT || 3000
const app = express()

app.get('/', (req, res) => {
  res.json('RESTServer')
})

app.listen(PORT, () => console.log(`listening port :${PORT}`))
