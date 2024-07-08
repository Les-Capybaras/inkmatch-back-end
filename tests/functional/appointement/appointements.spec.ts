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

  /* Should not be able to take appointment : (multiple situations)
    - Invalid artistId
    - invalid date ( < today )
    - ...
  */
})

test.group('As an artist, I should be able to accept an appointment made by a customer', () => {
  // Artist should be able to accept appointment
  test('Should be able to accept appointment', () => {})
  // Artist should not be able to accept
  test('Should not be able to accept appointment', () => {})
})

test.group('As an artist, I should be able to reject an appointment made by a customer', () => {
  // Artist should be able to reject
  test('Shoud be able to reject appointment', () => {})
  // Artist should not be able to reject
  test('Shoud not be able to reject appointment', () => {})
})