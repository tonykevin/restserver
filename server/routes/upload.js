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

  const allowedExtensions = ['png', 'jpg', 'gif', 'jpeg']

  let filename = file.name.split('.')
  let ext = filename[filename.length - 1]

  if (allowedExtensions.indexOf(ext) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `allowed extensions are: ${allowedExtensions.join(', ')}`,
        ext
      }
    })
  }

  file.mv(`uploads/${file.name}`, (err) => {
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
