const { model, Schema } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const allowedRoles = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} is not a allowed role'
}

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'email is required']
  },
  password: {
    type: String,
    required: [true, 'password is required']
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    enum: allowedRoles,
    default: 'USER_ROLE'
  },
  state: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
})

userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' })

module.exports = model('User', userSchema)
