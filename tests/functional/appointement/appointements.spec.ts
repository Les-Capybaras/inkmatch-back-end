import { test } from '@japa/runner'
import { loginAsUser } from '../auth.js'

test.group('As an user, I should be able to take an appointement with an artist', () => {
  test('Should be able to take an appointement', async ({ assert, client }) => {
    const response = await client
      .post('/appointements')
      .bearerToken(await loginAsUser(client))
      .json({
        artistId: 1,
        date: '2024-11-11',
        description: 'A description',
      })

    response.assertStatus(201)

    assert.equal(response.body().description, 'A description')
  })
})
