import mail from '@adonisjs/mail/services/main'

export default class Mailer {
  // async sendDefaultEmail(email: string) {
  //   await mail.send((message) => {
  //     message
  //       .to(email)
  //       .from('inkmatch@ismadev.fr')
  //       .subject('Login sucessful!')
  //       .htmlView('emails/login', { email: 'test@test.com' })
  //   })
  // }

  static async sendResetPasswordEmail(email: string, token: string) {
    const resetLink = `http://your-app-url/reset-password/${token}`
    await mail.send((message) => {
      message
        .to(email)
        .from('inkmatch@ismadev.fr')
        .subject('Reset your password')
        .htmlView('emails/reset-password', { resetLink })
    })
  }

  static async sendConfirmationEmail(email: string, token: string) {
    const resetLink = `http://your-app-url/confirm-account/${token}`
    await mail.send((message) => {
      message
        .to(email)
        .from('inkmatch@ismadev.fr')
        .subject('Confirm your account')
        .htmlView('emails/confirm-account', { resetLink })
    })
  }
}
