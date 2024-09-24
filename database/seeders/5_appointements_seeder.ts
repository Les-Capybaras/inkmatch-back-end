import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Appointement from '#models/appointement'
import { AppointementStatus } from '../../app/enums/appointements_status.js'
import { DateTime } from 'luxon'

export default class AppointementsSeeder extends BaseSeeder {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  public async run() {
    await Appointement.createMany([
      {
        userId: 1,
        artistId: 1,
        date: new Date(),
        amount: 100,
        description: 'Tattoo of a dragon on my back',
        status: AppointementStatus.Pending,
        startTime: DateTime.local(),
        duration: '01:00',
      },
      {
        userId: 1,
        artistId: 2,
        date: new Date(),
        amount: 200,
        description: 'Tattoo of a rose on my arm',
        status: AppointementStatus.Pending,
        startTime: DateTime.local(),
        duration: '01:00',
      },
    ])
  }
}
