import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Showcase from '#models/showcase'

export default class extends BaseSeeder {
  async run() {
    await Showcase.createMany([
      {
        artistId: 1,
      },
      {
        artistId: 2,
      },
    ])
  }
}
