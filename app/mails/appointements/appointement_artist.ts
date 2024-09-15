import Appointement from '#models/appointement'
import User from '#models/user'
import { BaseMail } from '@adonisjs/mail'

export default class ConfirmAppointement extends BaseMail {
  private artistEmail: string
  private user: User
  private appointement: Appointement

  constructor(artistEmail: string, user: User, appointement: Appointement) {
    super()
    this.artistEmail = artistEmail
    this.user = user
    this.appointement = appointement
  }

  prepare() {
    this.message.from('inkmatch@ismadev.fr')
    this.message.to(this.artistEmail)
    this.message.subject('New appointement request')
    this.message.htmlView('emails/appointement/artist/new_request', {
      user: this.user,
      appointement: this.appointement,
    })
  }
}
