/*
 * Middlewares
 */

const verifyToken = require('./verifyToken')
const verifyAdminRole = require('./verifyAdminRole')

module.exports = {
  verifyAdminRole,
  verifyToken
}
