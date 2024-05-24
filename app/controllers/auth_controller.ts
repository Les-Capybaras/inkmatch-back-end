import User from '#models/user'
import ResetToken from '#models/reset_token'
import {
  registerUserValidator,
  loginUserValidator,
  resetPasswordValidator,
  requestResetPasswordValidator,
} from '#validators/auth'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import crypto from 'node:crypto'
import Mailer from '#mails/mailer'

export default class AuthController {
  async register(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(registerUserValidator)
    const user = await User.create(payload)
    const token = await User.accessTokens.create(user)

    return ctx.response.status(201).json({ token })
  }

  async login(ctx: HttpContext) {
    const { email, password } = await ctx.request.validateUsing(loginUserValidator)

    const user = await User.verifyCredentials(email, password)

    const token = await User.accessTokens.create(user)

    return ctx.response.json({ token })
  }

  // RESET PASSWORD

  async requestResetPassword(ctx: HttpContext) {
    const { email } = await ctx.request.validateUsing(requestResetPasswordValidator)
    const user = await User.findBy('email', email)

    if (!user) {
      return ctx.response.status(400).json({ message: 'Invalid email address.' })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = DateTime.now().plus({ hours: 1 })

    await ResetToken.create({
      token,
      userId: user.id,
      expiresAt,
    })

    await Mailer.sendResetPasswordEmail(user.email, token)

    return ctx.response.ok({
      message: 'If an account with that email exists, a reset link has been sent.',
    })
  }

  async resetPassword(ctx: HttpContext) {
    const { token, password } = await ctx.request.validateUsing(resetPasswordValidator)
    const resetToken = await ResetToken.query()
      .where('token', token)
      .andWhere('expiresAt', '>', DateTime.now().toSQL())
      .preload('user')
      .first()

    if (!resetToken) {
      return ctx.response.badRequest({ message: 'Invalid or expired token.' })
    }

    const user = resetToken.user
    user.password = password
    await user.save()

    await resetToken.delete()

    return ctx.response.ok({ message: 'Password reset successfully.' })
  }
}
