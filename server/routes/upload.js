const express = require('express')
const fileUpload = require('express-fileupload')

const app = express()

app.use(fileUpload())

app.put('/upload', (req, res) => {
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'no file has been selected'
      }
    })
  }

  let { file } = req.files

  file.mv('uploads/filename.jpg', (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      message: 'file uploaded'
    })
  })
})

module.exports = app
