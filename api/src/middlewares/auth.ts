import jwt from 'jsonwebtoken'
import { Response, NextFunction } from 'express' 

export const isAuth = async (req: any, res: Response, next: NextFunction) => {
  const authorizationHeader = req.header('Authorization')

  const token = authorizationHeader && authorizationHeader.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Access denied' })

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || 'changeMyToken!'
    )
    
    req.user = verified
    next()
  } catch (err) {    
    res.status(400).json({ message: 'Invalid token' })
  }
}

export const isOwner = async (req: any, res: Response, next: NextFunction) => {
  const authorizationHeader = req.header('Authorization')

  const token = authorizationHeader && authorizationHeader.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Access denied' })

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || 'changeMyToken!'
    )

    req.user = verified
    if (parseInt(req.user.id) !== parseInt(req.params.id)) {
      return res.status(401).json({ message: 'Access denied' })
    }

    next()
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token' })
  }
}
