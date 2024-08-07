import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        email: 'inkmatch@email.com',
        password: 'adminPassword',
        firstName: 'Ismael',
        lastName: 'Dev',
        phoneNumber: '123456789',
        address: '1234 Main Street',
        city: 'New York',
        zipCode: '10001',
        country: 'USA',
      },
      {
        email: 'matchink@email.com',
        password: 'adminPassword',
        firstName: 'Antoine',
        lastName: 'DevOMG',
        phoneNumber: '987654321',
        address: '4321 Second Street',
        city: 'Los Angeles',
        zipCode: '90001',
        country: 'USA',
      },
    ])
  }
}
