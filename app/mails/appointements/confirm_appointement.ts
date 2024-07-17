import Appointement from '#models/appointement'
import { BaseMail } from '@adonisjs/mail'

export default class ConfirmAppointement extends BaseMail {
    private email: string
    private artistName: string
    private appointement: Appointement

    constructor(email: string, artistName: string, appointement: Appointement) {
        super()
        this.email = email
        this.artistName = artistName
        this.appointement = appointement
    }

    prepare() {
        this.message.from('inkmatch@ismadev.fr')
        this.message.to(this.email)
        this.message.subject('Your appointement has been confirmed')
        this.message.htmlView('emails/appointement/confirm', { artistName: this.artistName, appointement: this.appointement })
    }
}
