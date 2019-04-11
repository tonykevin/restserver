const { model, Schema } = require('mongoose')

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
  available: {
    type: Boolean,
    required: true,
    default: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }

})

module.exports = model('Product', productSchema)
