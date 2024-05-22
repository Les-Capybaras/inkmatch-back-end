import User from '#models/user'
import { registerUserValidator, loginUserValidator } from '#validators/auth'
import { HttpContext } from '@adonisjs/core/http'
import Mailer from '#mailer'

export default class AuthController {
  async register(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(registerUserValidator)
    const user = await User.create(payload)
    const token = await User.accessTokens.create(user)

    return ctx.response.status(201).json({ token })
  }

  async login(ctx: HttpContext) {
    const { email, password } = await ctx.request.validateUsing(loginUserValidator)

    /*await Mailer.sendDefaultEmail(email);*/

    const user = await User.verifyCredentials(email, password)

    if (!user) {
      return ctx.response.badRequest({ message: 'Invalid credentials' })
    }

    const token = await User.accessTokens.create(user)

    return ctx.response.json({ token })
  }
}
