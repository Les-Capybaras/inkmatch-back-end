import { test } from '@japa/runner'
import { loginAsArtist, loginAsUser } from '../auth.js'
import { AppointementStatus } from '../../../app/enums/appointements_status.js'

test.group('As an user, I should be able to take an appointement with an artist', () => {
  test('Should be able to take an appointement', async ({ assert, client }) => {
    const response = await client
      .post('/appointements')
      .bearerToken(await loginAsUser(client, 1))
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
  test('Should be able to accept appointment', async ({ assert, client }) => {
    // Accepts the appointement
    const artistToken = await loginAsArtist(client, 1)
    const response = await client.put('/appointements/1/accept').bearerToken(artistToken)

    assert.equal(response.status(), 200)
    assert.equal(response.body().status, AppointementStatus.Accepted)
  })

  test('Artist should not be able to accept an appointment of other artist', async ({
    assert,
    client,
  }) => {
    // Creates the appointement
    await client
      .post('/appointements')
      .bearerToken(await loginAsUser(client, 2))
      .json({
        artistId: 1,
        date: '2024-11-11',
        description: 'A description',
      })

    const artistToken = await loginAsArtist(client, 2)
    const response = await client.put('/appointements/4/accept').bearerToken(artistToken)

    assert.equal(response.status(), 403)
  })

  test('Artist should not be able to accept an appointement that does not exist', async ({
    assert,
    client,
  }) => {
    const artistToken = await loginAsArtist(client, 1)
    const response = await client.put('/appointements/54/accept').bearerToken(artistToken)

    assert.equal(response.status(), 404)
    assert.equal(response.body().message, 'Row not found')
  })
})

test.group('As an artist, I should be able to reject an appointment made by a customer', () => {
  test('Shoud be able to reject appointment', async ({ assert, client }) => {
    await client
      .post('/appointements')
      .bearerToken(await loginAsUser(client, 2))
      .json({
        artistId: 2,
        date: '2024-12-12',
        description: 'A description',
      })

    const artistToken = await loginAsArtist(client, 2)
    const response = await client.put('/appointements/5/reject').bearerToken(artistToken)

    assert.equal(response.status(), 200)
    assert.equal(response.body().status, AppointementStatus.Rejected)
  })
  // Artist should not be able to reject
  test('Shoud not be able to reject appointment of other artist', async ({ assert, client }) => {
    await client
      .post('/appointements')
      .bearerToken(await loginAsUser(client, 1))
      .json({
        artistId: 2,
        date: '2024-12-12',
        description: 'A different one',
      })

    const artistToken = await loginAsArtist(client, 1)
    const response = await client.put('/appointements/6/reject').bearerToken(artistToken)

    assert.equal(response.status(), 403)
  })

  test('Shoud not be able to reject appointment that does not exist', async ({
    assert,
    client,
  }) => {
    const artistToken = await loginAsArtist(client, 1)
    const response = await client.put('/appointements/45/reject').bearerToken(artistToken)

    assert.equal(response.status(), 404)
    assert.equal(response.body().message, 'Row not found')
  })
})

test.group('As an artist, I should be able to take an appointement with a customer', () => {
  test('Should be able to create an appointment', async ({ assert, client }) => {
    const response = await client
      .post('/appointements/artist-to-client')
      .bearerToken(await loginAsArtist(client, 2))
      .json({
        userId: 2,
        date: '2024-11-11',
        description: 'A description',
      })

    assert.equal(response.status(), 201)
    assert.equal(response.body().description, 'A description')
  })
  test('Should not be able to create an appointment for user that does not exist', async ({
    assert,
    client,
  }) => {
    const response = await client
      .post('/appointements/artist-to-client')
      .bearerToken(await loginAsArtist(client, 2))
      .json({
        userId: 45,
        date: '2024-11-11',
        description: 'A description',
      })

    assert.equal(response.status(), 400)
    assert.equal(response.body().message, 'Could not create appointement')
  })

  test('Should not be able to create an appointment with date < NOW', async ({
    assert,
    client,
  }) => {
    const response = await client
      .post('/appointements/artist-to-client')
      .bearerToken(await loginAsArtist(client, 2))
      .json({
        userId: 2,
        date: '2023-11-11',
        description: 'A description',
      })

    assert.equal(response.status(), 422)
    assert.equal(
      response.body().errors[0].message,
      'The date field must be a date after or equal to today'
    )
  })
})
