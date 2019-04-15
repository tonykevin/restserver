const express = require('express')
const fileUpload = require('express-fileupload')
const { existsSync, unlinkSync } = require('fs')
const { resolve } = require('path')
const uniqid = require('uniqid')
const { User } = require('../models')

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

  filename = `${filename[0]}.${uniqid()}.${ext}`

  file.mv(`uploads/${type}/${filename}`, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    userImage(id, res, filename)
  })
})

function userImage (id, res, filename) {
  User.findById(id, (err, userDB) => {
    if (err) {
      deleteFile(filename, 'users')
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!userDB) {
      deleteFile(filename, 'users')
      return res.status(400).json({
        ok: false,
        err: {
          message: 'use not exist'
        }
      })
    }

    deleteFile(userDB.img, 'users')

    userDB.img = filename

    userDB.save((err, userDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }

      res.json({
        ok: true,
        user: userDB
      })
    })
  })
}

function deleteFile (imageName, type) {
  let imagePath = resolve(__dirname, `../../uploads/${type}/${imageName}`)

  if (existsSync(imagePath)) {
    unlinkSync(imagePath)
  }
}

module.exports = app
