import { BaseMail } from '@adonisjs/mail'

export default class ResetPassword extends BaseMail {
  private email: string
  private resetLink: string

  constructor(email: string, resetLink: string) {
    super()
    this.email = email
    this.resetLink = resetLink
  }

  prepare() {
    this.message.from('inkmatch@ismadev.fr')
    this.message.to(this.email)
    this.message.subject('Reset your password')
    this.message.htmlView('emails/reset-password', { resetLink: this.resetLink })
  }
}
