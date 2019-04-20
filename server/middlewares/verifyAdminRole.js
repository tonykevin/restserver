/*
 * Verify admin role
 */

let verifyAdminRole = (req, res, next) => {
  const isAdmin = req.user.role === 'ADMIN_ROLE'

  if (!isAdmin) {
    return res.json({
      ok: false,
      err: {
        message: 'user is not an admin'
      }
    })
  }

  next()
}

module.exports = verifyAdminRole
