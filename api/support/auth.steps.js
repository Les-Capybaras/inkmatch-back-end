/* eslint-disable no-unused-vars */
const assert = require('assert')
const { Given, Then, BeforeAll } = require('@cucumber/cucumber')
const request = require('supertest')

let app

BeforeAll(function () {
  delete require.cache[require.resolve('../test/index')]
  app = require('../test/index')
})

Given('I am logged in as a user', async () => {
  const payload = {
    email: 'user@regular.com',
    password: 'regularUser',
  }

  const request = await request.post('/api/auth/login').send(payload)
  assert.equal(
    request.statusCode,
    200,
    'unable to logged as user using fixture'
  )
})

Given('I am logged in as a user', () => {
  // Write code here that turns the phrase above into concrete actions
  return 'pending'
})

Then(
  'I should receive a response with status code {int}',
  async (statusCode) => {
    const response = await request(app).get('/users')
    assert.equal(response.statusCode, statusCode)
  }
)
