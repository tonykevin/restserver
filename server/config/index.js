// PORT
process.env.PORT = process.env.PORT || 3000

// ENVIRONMENT
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// DATABASE
process.env.MONGO_URI = process.env.NODE_ENV === 'production'
  ? process.env.MONGO_URI
  : 'mongodb://localhost:27017/coffee'
