import { test } from '@japa/runner'

test.group('should be able to autenticate with login on a account', () => {
  test('Should be able to login as a user', async ({ assert, client }) => {
    const response = await client.post('/login').json({
      email: 'capybara@inkmatch.com',
      password: 'capybara',
    })

    response.assertStatus(200)
    assert.exists(response.body().token)
  })

  test('Should not be able to sign in with invalid input', async ({ client }) => {
    const response = await client.post('/login').json({
      email: 'capybara',
      password: 'invalid-password',
    })

    response.assertStatus(400)
    response.assertBodyContains({
      errors: [
        {
          message: 'Invalid input to be corrected here',
        },
      ],
    })
  })

  test('Should not be able to sign in with invalid credentials', async ({ client }) => {
    const response = await client.post('/login').json({
      email: 'capybara@inkmatch.com',
      password: 'invalid-password',
    })

    response.assertStatus(401)
    response.assertBodyContains({
      errors: [
        {
          message: 'Invalid user credentials',
        },
      ],
    })
  })
})
