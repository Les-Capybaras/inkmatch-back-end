import { ApiClient } from '@japa/api-client'

export const loginAsUser = async (client: ApiClient) => {
  const loginResponse = await client.post('/login').json({
    email: 'inkmatch@email.com',
    password: 'adminPassword',
  })
  return loginResponse.body().token.token
}

export const loginAsArtist = async (client: ApiClient) => {
  const loginResponse = await client.post('/login').json({
    email: 'tattoo@inkmatch.com',
    password: 'password123',
  })
  return loginResponse.body().token.token
}
