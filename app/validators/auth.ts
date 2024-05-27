import vine from '@vinejs/vine'
import { uniqueRule } from './rules/unique.js'

/**
 * Validates the user's register
 */
export const registerUserValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .use(uniqueRule({ table: 'users', column: 'email' })),
    password: vine.string().minLength(8).maxLength(32).confirmed(),
    firstName: vine.string().optional(),
    lastName: vine.string().optional(),
    phoneNumber: vine.string().mobile().optional(),
    address: vine.string().optional(),
    city: vine.string().optional(),
    zipCode: vine.string().minLength(5).maxLength(5).optional(),
    country: vine.string().optional(),
  })
)

/**
 * Validates the user's login
 */
export const loginUserValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)

/**
 * Validates the user's password reset request
 */
export const requestResetPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)

/**
 * Validates the user's password reset request
 */
export const resetPasswordValidator = vine.compile(
  vine.object({
    token: vine.string(),
    password: vine.string().minLength(8).maxLength(32).confirmed(),
  })
)

export const verifyEmailValidator = vine.compile(
  vine.object({
    token: vine.string(),
  })
)
