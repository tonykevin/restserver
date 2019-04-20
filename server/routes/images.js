const express = require('express')
const { existsSync } = require('fs')
const { resolve } = require('path')

const app = express()

app.get('/image/:type/:img', (req, res) => {
  let { type, img } = req.params

  let imgPath = resolve(__dirname, `../../uploads/${type}/${img}`)

  if (existsSync(imgPath)) {
    res.sendFile(imgPath)
  } else {
    let noImagePath = resolve(__dirname, '../assets/no-image.jpg')
    res.sendFile(noImagePath)
  }
})

module.exports = app
