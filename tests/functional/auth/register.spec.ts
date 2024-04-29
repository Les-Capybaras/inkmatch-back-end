import { test } from '@japa/runner'

test.group('should be able to create an account', () => {
  test('Should be able to register as a regular user', async ({ assert, client }) => {
    const response = await client.post('/register').json({
      email: 'capybara@inkmatch.com',
      password: 'capybara',
      password_confirmation: 'capybara',
    })

    response.assertStatus(200)
    assert.exists(response.body().token)
    // assert.exists(response.body().user.role)
    // assert.equals(response.body().user.role, "client")

    // TODO : implement test on confirmation mail
  })

  test('Should not be able to register with invalid input', async ({ client }) => {
    const response = await client.post('/register').json({
      email: 'capybara',
      password: 'single-password',
      password_confirmation: 'double-password',
    })

    response.assertStatus(401)
    response.assertBodyContains({
      errors: [
        {
          message: 'Invalid user input to be confirmed',
        },
      ],
    })
  })
})
