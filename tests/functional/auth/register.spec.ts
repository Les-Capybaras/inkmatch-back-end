import { test } from '@japa/runner'
import mail from '@adonisjs/mail/services/main'
import VerifyAccount from '#mails/verify_account'
import { LegalForm } from '../../../app/enums/legal_form.js'
import Artist from '#models/artist'

test.group('should be able to create an account', () => {
  test('Should be able to register as a regular user', async ({ assert, client }) => {
    const { mails } = mail.fake()

    const mockPayload = {
      email: 'test@example.com',
      password: 'password123',
      password_confirmation: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+33623456789',
      address: '123 Rue de la Paix',
      city: 'Paris',
      zipCode: '75001',
      country: 'France',
    }

    const response = await client.post('/register').json(mockPayload)

    response.assertStatus(201)
    assert.exists(response.body().token)

    mails.assertSentCount(1)
    mails.assertSent(VerifyAccount, (email) => {
      email.message.assertTo(mockPayload.email)
      email.message.assertFrom('inkmatch@ismadev.fr')
      email.message.assertSubject('Verify your account')

      return true
    })
  })

  test('Should be able to register as a tattoo artist', async ({ assert, client }) => {
    const { mails } = mail.fake()

    const mockPayload = {
      email: 'creative@designink.com',
      password: 'uniquePass789',
      password_confirmation: 'uniquePass789',
      firstName: 'Emma',
      lastName: 'Leroy',
      phoneNumber: '+33765432198',
      address: '789 Boulevard des Artistes',
      city: 'Lyon',
      zipCode: '69002',
      country: 'France',
      isArtist: true,
      companyName: 'DesignInk',
      legalForm: LegalForm.SoleProprietorship,
      siret: '98765432109876',
    }

    const response = await client.post('/register').json(mockPayload)

    response.assertStatus(201)
    assert.exists(response.body().token)

    mails.assertSentCount(1)
    mails.assertSent(VerifyAccount, (email) => {
      email.message.assertTo(mockPayload.email)
      email.message.assertFrom('inkmatch@ismadev.fr')
      email.message.assertSubject('Verify your account')

      return true
    })

    const whoamiResponse = await client.get('/whoami').bearerToken(response.body().token.token)
    whoamiResponse.assertStatus(200)

    const showcaseResponse = await client
      .get(`showcases/${whoamiResponse.body().showcase.id}`)
      .bearerToken(response.body().token.token)

    showcaseResponse.assertStatus(200)
    assert.equal(showcaseResponse.body().artistId, whoamiResponse.body().id)
  }).teardown(async () => {
    await Artist.query().where('email', 'creative@designink.com').delete()
  })

  test('Should not be able to register with invalid input', async ({ client }) => {
    const response = await client.post('/register').json({
      email: 'capybara',
      password: 'single-password',
      password_confirmation: 'double-password',
    })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'email',
          message: 'The email field must be a valid email address',
          rule: 'email',
        },
        {
          field: 'password',
          message: 'The password field and password_confirmation field must be the same',
          meta: {
            otherField: 'password_confirmation',
          },
          rule: 'confirmed',
        },
      ],
    })
  })

  test('Should not be able to register if the mail is already taken', async ({ client }) => {
    const response = await client.post('/register').json({
      email: 'inkmatch@email.com', // This mail is used in seeds
      password: 'secret',
    })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'email',
          message: 'The email field is not unique',
          rule: 'unique',
        },
      ],
    })
  })
})
