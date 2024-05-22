import mail from "@adonisjs/mail/services/main";

export default class Mailer {
  async sendDefaultEmail(email: string) {
    await mail.send((message) => {
      message
        .to(email)
        .from('inkmatch@ismadev.fr')
        .subject('Login sucessful!')
        .htmlView('emails/login', { email: "test@test.com" })
    })
  }
}
