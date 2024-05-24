import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.create({
      email: 'inkmatch@email.com',
      password: 'adminPassword',
      firstName: 'Ismael',
      lastName: 'Dev',
      phoneNumber: '123456789',
      address: '1234 Main Street',
      city: 'New York',
      zipCode: '10001',
      country: 'USA',
    })
  }
}
