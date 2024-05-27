import User from '#models/user'
import MailingToken from '#models/mailing_token'
import { DateTime } from 'luxon'
import crypto from 'node:crypto'
import { test } from '@japa/runner'
import hash from '@adonisjs/core/services/hash'
import mail from '@adonisjs/mail/services/main'
import ResetPassword from '#mails/reset_password'

// TODO: Implement tests for the reset password feature
// 1. Test that a user can request a password reset
// 2. Test that a user can reset their password
// 3. Test that a user cannot reset their password with an invalid token
// 4. Test that a user cannot reset their password with an expired token
// 5. Test that a user cannot reset their password with a password that is less than 8 characters
// 6. Test that a user cannot reset their password with a password that is more than 32 characters

test.group('should be able to reset password', () => {
  test('Should be able to request a password reset', async ({ assert, client }) => {
    const { mails } = mail.fake()

    const mockPayload = {
      email: 'inkmatch@email.com',
    }

    const response = await client.post('/reset-password').json(mockPayload)

    response.assertStatus(200)
    assert.equal(
      response.body().message,
      'If an account with that email exists, a reset link has been sent.'
    )

    mails.assertSent(ResetPassword, (email) => {
      email.message.assertTo(mockPayload.email)
      email.message.assertFrom('inkmatch@ismadev.fr')
      email.message.assertSubject('Reset your password')

      return true
    })
  })

  test('Should not be able to request a password reset with an invalid email address', async ({
    assert,
    client,
  }) => {
    const mockPayload = {
      email: 'invalidEmail',
    }

    const response = await client.post('/reset-password').json(mockPayload)
    response.assertStatus(422)
    assert.equal(response.body().errors[0].message, 'The email field must be a valid email address')
  })

  test('Should not be able to request a password reset with an email address that does not exist', async ({
    assert,
    client,
  }) => {
    const mockPayload = {
      email: 'admin@email.com',
    }

    const response = await client.post('/reset-password').json(mockPayload)
    response.assertStatus(400)
    assert.equal(response.body().message, 'Invalid email address.')
  })

  test('Should be able to reset their password', async ({ assert, client }) => {
    const user = await User.create({
      email: 'testuser@example.com',
      password: 'originalpassword',
    })

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = DateTime.now().plus({ hours: 1 })

    await MailingToken.create({
      token,
      userId: user.id,
      expiresAt,
    })

    const newPassword = 'newsecurepassword'

    const response = await client
      .post(`/reset-password/${token}`)
      .json({ token, password: newPassword, password_confirmation: newPassword })

    response.assertStatus(200)
    assert.equal(response.body().message, 'Password reset successfully.')

    await user.refresh()
    const passwordMatches = await hash.verify(user.password, newPassword)
    assert.isTrue(passwordMatches)
  })

  test('Should not be able to reset their password with an invalid token', async ({
    assert,
    client,
  }) => {
    const newPassword = 'newsecurepassword'

    const response = await client
      .post('/reset-password/invalidtoken')
      .json({ token: 'invalidtoken', password: newPassword, password_confirmation: newPassword })

    response.assertStatus(400)
    assert.equal(response.body().message, 'Invalid or expired token.')
  })

  test('Should not be able to reset their password with an expired token', async ({
    assert,
    client,
  }) => {
    const user = await User.create({
      email: 'testuser2@example.com',
      password: 'originalpassword',
    })

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = DateTime.now().minus({ hours: 1 })

    await MailingToken.create({
      token,
      userId: user.id,
      expiresAt,
    })

    const newPassword = 'newsecurepassword'

    const response = await client
      .post(`/reset-password/${token}`)
      .json({ token, password: newPassword, password_confirmation: newPassword })

    response.assertStatus(400)
    assert.equal(response.body().message, 'Invalid or expired token.')
  })

  test('Should not be able to reset their password with a password that is less than 8 characters', async ({
    assert,
    client,
  }) => {
    const user = await User.create({
      email: 'testuser3@example.com',
      password: 'originalpassword',
    })

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = DateTime.now().plus({ hours: 1 })

    await MailingToken.create({
      token,
      userId: user.id,
      expiresAt,
    })

    const newPassword = 'short'

    const response = await client
      .post(`/reset-password/${token}`)
      .json({ token, password: newPassword })

    response.assertStatus(422)
    assert.equal(
      response.body().errors[0].message,
      'The password field must have at least 8 characters'
    )
  })

  test('Should not be able to reset their password with a password that is more than 32 characters', async ({
    assert,
    client,
  }) => {
    const user = await User.create({
      email: 'testuser4@example.com',
      password: 'originalpassword',
    })

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = DateTime.now().plus({ hours: 1 })

    await MailingToken.create({
      token,
      userId: user.id,
      expiresAt,
    })

    const newPassword = 'a'.repeat(33)

    const response = await client
      .post(`/reset-password/${token}`)
      .json({ token, password: newPassword })

    response.assertStatus(422)
    assert.equal(
      response.body().errors[0].message,
      'The password field must not be greater than 32 characters'
    )
  })
})
