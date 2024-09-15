import mail from '@adonisjs/mail/services/main'
import env from '#start/env'
import VerifyAccount from './verify_account.js'
import ResetPassword from './reset_password.js'
import ConfirmAppointement from './appointements/confirm_appointement.js'
import Appointement from '#models/appointement'
import Artist from '#models/artist'

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

  static async sendConfirmAppointementEmail(email: string, artist: Artist, appointement: Appointement) {
    const confirmAppointement = new ConfirmAppointement(email, artist, appointement)
    await mail.send(confirmAppointement)
  }
}
