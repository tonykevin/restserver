const { model, Schema } = require('mongoose')

const categorySchema = new Schema({
  name: {
    type: String,
    require: [true, 'name is required']
  },
  user: {
    type: Schema.ObjectId, ref: 'User'
  }

})

module.exports = model('Category', categorySchema)
