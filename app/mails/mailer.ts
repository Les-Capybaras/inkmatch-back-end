import mail from '@adonisjs/mail/services/main'
import env from '#start/env'
import VerifyAccount from './verify_account.js'
import ResetPassword from './reset_password.js'
import AppointementCheck from './appointements/appointement_client.js'
import Appointement from '#models/appointement'
import Artist from '#models/artist'
import { AppointementStatus } from '../enums/appointements_status.js'
import User from '#models/user'
import ConfirmAppointement from './appointements/appointement_artist.js'

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

  static async sendConfirmAppointementEmail(
    email: string,
    artist: Artist,
    appointement: Appointement
  ) {
    const confirmAppointement = new AppointementCheck(
      email,
      artist,
      appointement,
      AppointementStatus.Accepted
    )
    await mail.send(confirmAppointement)
  }

  static async sendRejectAppointementEmail(
    email: string,
    artist: Artist,
    appointement: Appointement
  ) {
    const rejectAppointement = new AppointementCheck(
      email,
      artist,
      appointement,
      AppointementStatus.Rejected
    )
    await mail.send(rejectAppointement)
  }

  static async sendRequestAppointementEmail(
    artistEmail: string,
    user: User,
    appointement: Appointement
  ) {
    const requestAppointement = new ConfirmAppointement(artistEmail, user, appointement)
    await mail.send(requestAppointement)
  }
}
