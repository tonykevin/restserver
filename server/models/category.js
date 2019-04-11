const { model, Schema } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const categorySchema = new Schema({
  description: {
    type: String,
    unique: true,
    required: [true, 'description is required']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'user is required']
  }

})

categorySchema.plugin(uniqueValidator, { message: '{PATH} must be unique' })

module.exports = model('Category', categorySchema)
