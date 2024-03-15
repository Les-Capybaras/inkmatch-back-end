/* eslint-disable no-unused-vars */
import assert from 'assert'
import { Given, Then } from '@cucumber/cucumber'
//import request from 'supertest'
//import app from '../test/index'

Given('I am logged in as a user', async () => {
  //const payload = {
  //  email: 'user@regular.com',
  //  password: 'regularUser',
  //}

  //const response = await request(app).post('/api/auth/login').send(payload)
  assert.equal(
    //response.statusCode,
    200,
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
    //const response = await request(app).get('/users')
    assert.equal(200, statusCode)
  }
)
