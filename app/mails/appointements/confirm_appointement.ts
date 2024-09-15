import Appointement from '#models/appointement'
import Artist from '#models/artist'
import { BaseMail } from '@adonisjs/mail'

export default class ConfirmAppointement extends BaseMail {
    private email: string
    private artist: Artist
    private appointement: Appointement

    constructor(email: string, artist: Artist, appointement: Appointement) {
        super()
        this.email = email
        this.artist = artist
        this.appointement = appointement
    }

    prepare() {
        this.message.from('inkmatch@ismadev.fr')
        this.message.to(this.email)
        this.message.subject('Your appointement has been confirmed')
        this.message.htmlView('emails/appointement/confirm', { artist: this.artist, appointement: this.appointement })
    }
}
