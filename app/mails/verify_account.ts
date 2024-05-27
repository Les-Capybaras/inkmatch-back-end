import { BaseMail } from '@adonisjs/mail'

export default class VerifyAccount extends BaseMail {
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
    this.message.subject('Verify your account')
    this.message.htmlView('emails/confirm-account', { resetLink: this.resetLink })
  }
}
