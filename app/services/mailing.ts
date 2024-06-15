import { DateTime } from 'luxon'
import crypto from 'node:crypto'
import Mailer from '#mails/mailer'
import User from '#models/user'
import Artist from '#models/artist'
import MailingToken from '#models/mailing_token'

export default class MailingService {
  static async createConfirmationEmail(user: User | Artist) {
    const mailingToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = DateTime.now().plus({ hours: 1 })
    const isArtist = user instanceof Artist

    if (isArtist) {
      await MailingToken.create({
        token: mailingToken,
        artistId: user.id,
        expiresAt,
      })
    } else {
      await MailingToken.create({
        token: mailingToken,
        userId: user.id,
        expiresAt,
      })
    }

    await Mailer.sendConfirmationEmail(user.email, mailingToken)
  }

  static async createResetPasswordEmail(user: User | Artist) {
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = DateTime.now().plus({ hours: 1 })

    await MailingToken.create({
      token,
      userId: user.id,
      expiresAt,
    })

    await Mailer.sendResetPasswordEmail(user.email, token)
  }
}
