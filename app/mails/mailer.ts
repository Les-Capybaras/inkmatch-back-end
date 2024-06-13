import mail from '@adonisjs/mail/services/main'
import VerifyAccount from './verify_account.js'
import ResetPassword from './reset_password.js'
import env from '#start/env'

export default class Mailer {
  static async sendResetPasswordEmail(email: string, token: string) {
    const resetLink = `${env.get('FRONTEND_URL')}/reset-password/${token}`
    const resetPassword = new ResetPassword(email, resetLink)
    await mail.send(resetPassword)
  }

  static async sendConfirmationEmail(email: string, token: string) {
    const resetLink = `${env.get('FRONTEND_URL')}/confirm-account/${token}`
    const verifyEmail = new VerifyAccount(email, resetLink)
    await mail.send(verifyEmail)
  }
}
