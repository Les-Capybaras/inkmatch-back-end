import { Schema } from "express-validator"

export const createSchema: Schema = {
  firstname: {
    notEmpty: true,
    errorMessage: 'firstname is required',
  },
  lastname: {
    notEmpty: true,
    errorMessage: 'lastname is required',
  },
  email: {
    notEmpty: true,
    errorMessage: 'Email is required',
  },
  password: {
    notEmpty: true,
    errorMessage: 'Password is required',
    custom: {
      options: (value: string, { req }: any) => {
        if (value !== req.body.password2) {
          throw new Error('Passwords must match')
        }
        return true
      },
    },
  },
  password2: {
    notEmpty: true,
    errorMessage: 'Password confirmation is required',
  },
}

export const loginSchema: Schema = {
  email: {
    notEmpty: true,
    errorMessage: 'Email is required',
  },
  password: {
    notEmpty: true,
    errorMessage: 'Password is required',
  },
}
