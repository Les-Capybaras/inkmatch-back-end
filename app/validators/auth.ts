import vine from '@vinejs/vine'

/**
 * Validates the user's register
 */
export const registerUserValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(32).confirmed()
  })
)

/**
 * Validates the user's login
 */
export const loginUserValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string()
  })
)
