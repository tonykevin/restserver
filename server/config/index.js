// PORT
process.env.PORT = process.env.PORT || 3000

// ENVIRONMENT
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// DATABASE
process.env.MONGO_URI = process.env.NODE_ENV === 'production'
  ? process.env.MONGO_URI
  : 'mongodb://localhost:27017/coffee'

// DATE OF EXPIRY
/* seconds
 * minutes
 * hours
 * days */
process.env.TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || 60 * 60 * 24 * 30

// AUTHENTICATION SEED
process.env.SEED = process.env.SEED || 'seed-development'

// Google Client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '812166147101-gr8r4v4s0c412ij909me2c8tbv47u5nv.apps.googleusercontent.com'
