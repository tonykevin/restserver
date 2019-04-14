const express = require('express')
const fileUpload = require('express-fileupload')

const app = express()

app.use(fileUpload())

app.put('/upload/:type/:id', (req, res) => {
  let { type, id } = req.params

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'no file has been selected'
      }
    })
  }

  // Validate type
  let allowedTypes = ['products', 'users']

  if (allowedTypes.indexOf(type) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `allowed types are: ${allowedTypes.join(', ')}`
      }
    })
  }

  // Allowed extensions
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

  // Change filename
  filename = `${id}.${new Date().getMilliseconds()}.${ext}`

  file.mv(`uploads/${type}/${filename}`, (err) => {
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
