import { test } from '@japa/runner'
import { loginAsUser } from '../auth.js'

test.group('should be able to upload files to server', () => {
  test('Should be able to upload a file', async ({ client }) => {
    const response = await client
      .post('/files')
      .file('file', 'tests/fixture/code.png')
      .bearerToken(await loginAsUser(client))

    response.assertStatus(201)
  })

  test('Should be able to get a file', async ({ client }) => {
    const response = await client
      .get('/files/1')
      .json({
        email: 'inkmatch@email.com',
        password: 'adminPassword',
      })
      .bearerToken(await loginAsUser(client))

    response.assertStatus(200)
  })

  test('Should be able to delete a file', async ({ client }) => {
    const response = await client.delete('/files/1').bearerToken(await loginAsUser(client))

    response.assertStatus(204)
  })
})
