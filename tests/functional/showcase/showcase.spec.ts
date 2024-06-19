import { test } from '@japa/runner'
import { loginAsArtist, loginAsUser } from '../auth.js'

test.group('As an artist, I should be able to manage my showcase pictures', () => {
  test('Should be able to search for artists', async ({ assert, client }) => {
    const response = await client
      .put('/showcases')
      .bearerToken(await loginAsArtist(client))
      .json({
        files: [1, 2],
      })

    response.assertStatus(200)

    assert.equal(response.body().files.length, 2)
  })

  test('Should not be able to manage a showcase if logged as user', async ({ client }) => {
    const response = await client.put('/showcases').bearerToken(await loginAsUser(client))

    response.assertStatus(401)
  })
})
