import { test } from '@japa/runner'

test.group('should be able to autenticate with login on a account', () => {
  test('Should be able to login as a user', async ({ assert, client }) => {
    const response = await client.post('/login').json({
      email: 'ismadev.work@gmail.com',
      password: 'adminPassword',
    })

    response.assertStatus(200)
    assert.exists(response.body().token)
  })

  test('Should not be able to sign in with invalid input', async ({ client }) => {
    const response = await client.post('/login').json({
      email: 'capybara',
      password: 'invalid-password',
    })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          message: 'The email field must be a valid email address',
          field: 'email',
          rule: 'email',
        },
      ],
    })
  })

  test('Should not be able to sign in with invalid credentials', async ({ client }) => {
    const response = await client.post('/login').json({
      email: 'capybara@inkmatch.com',
      password: 'invalid-password',
    })

    response.assertStatus(400)
    response.assertBodyContains({
      errors: [
        {
          message: 'Invalid user credentials',
        },
      ],
    })
  })
})
