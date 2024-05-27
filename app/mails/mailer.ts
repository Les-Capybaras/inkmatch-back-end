import mail from '@adonisjs/mail/services/main'
import VerifyAccount from './verify_account.js'
import ResetPassword from './reset_password.js'

export default class Mailer {
  static async sendResetPasswordEmail(email: string, token: string) {
    const resetLink = `http://your-app-url/reset-password/${token}`
    const resetPassword = new ResetPassword(email, resetLink)
    await mail.send(resetPassword)
  }

  static async sendConfirmationEmail(email: string, token: string) {
    const resetLink = `http://your-app-url/confirm-account/${token}`
    const verifyEmail = new VerifyAccount(email, resetLink)
    await mail.send(verifyEmail)
  }
}
