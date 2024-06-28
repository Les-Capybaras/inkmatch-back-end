import { test } from '@japa/runner'
import { loginAsArtist } from '../auth.js'

test.group('As an artist, I should be able to generate a quotation for an appointement', () => {
  test('Should be able to generate a quotation for an appointement', async ({ client }) => {
    const response = await client.get('/quotation/2').bearerToken(await loginAsArtist(client))

    response.assertStatus(200)
    response.assertHeader('content-type', 'application/pdf')
  })
})
