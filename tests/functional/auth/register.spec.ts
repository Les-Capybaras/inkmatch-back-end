import { test } from '@japa/runner'

test.group('should be able to create an account', () => {
  test('Should be able to register as a regular user', async ({ assert, client }) => {
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

    // TODO : implement test on confirmation mail
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
