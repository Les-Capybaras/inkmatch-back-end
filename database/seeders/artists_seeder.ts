import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Artist from '#models/artist'
import { LegalForm } from '../../app/enums/legal_form.js'

export default class extends BaseSeeder {
  async run() {
    await Artist.createMany([
      {
        email: 'tattoo@inkmatch.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+33623456789',
        address: '123 Rue de la Paix',
        city: 'Paris',
        zipCode: '75001',
        country: 'France',
        companyName: 'InkMatch',
        legalForm: LegalForm.SAS,
        siret: '12345678912345',
      },
      {
        email: 'studio@artink.com',
        password: 'securePass456',
        firstName: 'Alice',
        lastName: 'Martin',
        phoneNumber: '+33698765432',
        address: '456 Avenue des Champs-Élysées',
        city: 'Paris',
        zipCode: '75008',
        country: 'France',
        companyName: 'ArtInk Studio',
        legalForm: LegalForm.LLC,
        siret: '98765432198765',
      },
    ])
  }
}
