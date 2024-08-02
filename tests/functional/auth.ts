import { ApiClient } from '@japa/api-client'

export const loginAsUser = async (client: ApiClient, userId: number) => {
  const loginResponse = await client.post('/login').json({
    email: userId === 1 ? 'inkmatch@email.com' : 'matchink@email.com',
    password: 'adminPassword',
  })
  return loginResponse.body().token.token
}

export const loginAsArtist = async (client: ApiClient, artistId: number) => {
  const loginResponse = await client.post('/login').json(
    artistId === 1
      ? {
          email: 'tattoo@inkmatch.com',
          password: 'password123',
        }
      : {
          email: 'studio@artink.com',
          password: 'securePass456',
        }
  )
  return loginResponse.body().token.token
}
