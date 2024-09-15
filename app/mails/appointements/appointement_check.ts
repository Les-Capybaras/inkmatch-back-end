import Appointement from '#models/appointement'
import Artist from '#models/artist'
import { BaseMail } from '@adonisjs/mail'
import { AppointementStatus } from '../../enums/appointements_status.js'

export default class AppointementCheck extends BaseMail {
    private email: string
    private artist: Artist
    private appointement: Appointement
    private status: AppointementStatus

    constructor(email: string, artist: Artist, appointement: Appointement, status: AppointementStatus) {
        super()
        this.email = email
        this.artist = artist
        this.appointement = appointement
        this.status = status
    }

    prepare() {
        this.message.from('inkmatch@ismadev.fr')
        this.message.to(this.email)
        if (this.status === AppointementStatus.Rejected) {
            this.message.subject('Your appointement has been rejected')
            this.message.htmlView('emails/appointement/reject', { artist: this.artist, appointement: this.appointement })
        } else if (this.status === AppointementStatus.Accepted) {
            this.message.subject('Your appointement has been confirmed')
            this.message.htmlView('emails/appointement/confirm', { artist: this.artist, appointement: this.appointement })
        }
    }
}
