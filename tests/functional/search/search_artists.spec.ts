import { test } from '@japa/runner'
import { loginAsUser } from '../auth.js'

test.group('As a client, I should be able to search for artists', () => {
  test('Should be able to search for artists', async ({ assert, client }) => {
    const response = await client.get('/artists').bearerToken(await loginAsUser(client))

    response.assertStatus(200)
    assert.isArray(response.body())
    assert.containsSubset(response.body(), [
      {
        id: 1,
        companyName: 'InkMatch',
      },
      {
        id: 2,
        companyName: 'ArtInk Studio',
      },
    ])
  })

  test('Should be able to search for artists by companyName', async ({ assert, client }) => {
    const response = await client
      .get('/artists?companyName=InkMatch')
      .bearerToken(await loginAsUser(client))

    response.assertStatus(200)
    assert.isArray(response.body())
    assert.containsSubset(response.body(), [
      {
        id: 1,
        companyName: 'InkMatch',
      },
    ])
    assert.equal(response.body().length, 1)
  })

  test('Should be able to search for artists and order by companyName', async ({
    assert,
    client,
  }) => {
    const response = await client
      .get('/artists?order=companyName')
      .bearerToken(await loginAsUser(client))

    response.assertStatus(200)
    assert.isArray(response.body())
    assert.containsSubset(response.body(), [
      {
        id: 2,
        companyName: 'ArtInk Studio',
      },
      {
        id: 1,
        companyName: 'InkMatch',
      },
    ])
    assert.equal(response.body().length, 2)
    assert.equal(response.body()[0].companyName, 'ArtInk Studio')
  })
})
