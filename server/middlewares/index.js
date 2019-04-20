/*
 * Middlewares
 */

const verifyAdminRole = require('./verifyAdminRole')
const verifyTokenImg = require('./verifyTokenImg')
const verifyToken = require('./verifyToken')

module.exports = {
  verifyAdminRole,
  verifyToken,
  verifyTokenImg
}
