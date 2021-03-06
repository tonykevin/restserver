const { model, Schema } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required']
  },
  unitPrice: {
    type: Number,
    required: [true, 'unit price is required']
  },
  description: {
    type: String
  },
  img: {
    type: String
  },
  available: {
    type: Boolean,
    required: true,
    default: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'category is required']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }

})

productSchema.methods.toJSON = function () {
  let product = this
  let productObject = product.toObject()

  delete productObject.available
  delete productObject.__v

  return productObject
}

productSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' })

module.exports = model('Product', productSchema)
