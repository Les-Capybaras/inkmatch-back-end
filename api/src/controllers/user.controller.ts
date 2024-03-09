import User from '../models/User'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { validationResult } from 'express-validator'
import { hashPassword } from '../utils/auth'
import { Request, Response } from 'express' 

// Login
export const login = async (req: Request, res: Response) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body

  try {
    // Check for existing user
    const user: any = await User.findOne({ where: { email: email } })

    if (!user) {
      return res.status(400).json({ msg: 'User Does not exist' })
    }

    // Check for password match
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' })
    }

    // Create and assign a token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'changeMyToken!',
      {
        expiresIn: 3600,
      }
    )

    res.json({
      token,
      user: {
        email: user.email,
      },
    })
  } catch (err: any) {
    console.error(err.message)
    res.status(500).send({
      message: 'Some error occurred while logging in.',
      error: err,
    })
  }
}

// Create and Save a new User
export const create = async (req: Request, res: Response) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  // Create a User object
  const user = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: await hashPassword(req.body.password),
    birthdate: req.body.birthdate,
  }

  try {
    const dbUser = await User.create(user)
    return res.status(201).json(dbUser)
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ error: 'Some error occurred while creating the user.' })
  }
}

// Retrieve all users from the database.
export const findAll = (req: Request, res: Response) => {
  User.findAll({
    attributes: { exclude: ['password'] },
  })
    .then((users) => {
      res.send(users)
    })
    .catch((err: Error) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving users.',
      })
    })
}

export const findOne = (req: any, res: Response) => {
  const id = req.user.id

  User.findByPk(id, {
    attributes: { exclude: ['password'] },
  })
    .then((user) => {
      res.send(user)
    })
    .catch((err: Error) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving users.',
      })
    })
}

// Update a User by the id in the request
export const update = async (req: Request, res: Response) => {
  const id = req.params.id

  const [dbUser] = await User.update(req.body, {
    where: { id: id },
  })

  if (dbUser == 1) {
    res.send(req.body)
  } else {
    res.send({
      message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
    })
  }
}

// Delete a User with the specified id in the request
export const destroy = async (req: Request, res: Response) => {
  const id = req.params.id

  const deleted = await User.destroy({
    where: { id: id },
  })

  if (deleted == 1) {
    res.send({
      message: 'User was deleted successfully!',
    })
  } else {
    res.send({
      message: `Cannot delete User with id=${id}. Maybe User was not found!`,
    })
  }
}
