const jwt = require('jsonwebtoken')

exports.isAuth = async (req, res, next) => {
  const authorizationHeader = req.header('Authorization')

  const token = authorizationHeader && authorizationHeader.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Access denied' })

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || 'changeMyToken!'
    )
    console.log(
      token,
      process.env.JWT_SECRET || 'changeMyToken!',
      verified,
      req.user
    )
    req.user = verified
    next()
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' })
  }
}

exports.isOwner = async (req, res, next) => {
  const authorizationHeader = req.header('Authorization')

  const token = authorizationHeader && authorizationHeader.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Access denied' })

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    req.user = verified
    if (parseInt(req.user.id) !== parseInt(req.params.id)) {
      return res.status(401).json({ message: 'Access denied' })
    }

    next()
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token' })
  }
}
