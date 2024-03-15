const app = require('../index.cjs')
const supertest = require('supertest')

let chai
let expect

import('chai').then((Chai) => {
  chai = Chai
  expect = chai.expect
})

let request = supertest(app)

let token = ''
let id = null

describe('Access, modify and delete users', function () {
  before(async () => {
    await fixture()
  })
  beforeEach(async () => {
    const response = await request.post('/api/auth/login').send({
      email: 'mock@example.com',
      password: 'testtest',
    })
    token = response.body.token

    const me = await request
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
    id = me.body.id
  })

  it('should return all users', async function () {
    const response = await request
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)
    expect(response.status).to.equal(200)
    expect(response.body).to.be.an('array')
    expect(response.body.length).to.equal(3)
    expect(response.body[0]).to.have.property('id').to.be.a('number')
  })

  it('should be able to modify a user', async function () {
    const payload = {
      firstname: 'changed',
      lastname: 'mock',
      email: 'mock@example.com',
    }

    const response = await request
      .put(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
    expect(response.status).to.equal(200)
    expect(response.body)
      .to.be.an('object')
      .to.have.property('firstname')
      .to.be.a('string')
      .to.equal('changed')
  })

  it('should not be able to modify or delete a user if not the owner', async function () {
    const payload = {
      firstname: 'changed',
      lastname: 'mock',
      email: 'mock@example.com',
    }

    const response = await request
      .put(`/api/users/${typeof id === 'number' ? id + 1 : 0}`)
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
    expect(response.status).to.equal(401)
    expect(response.body).to.be.an('object')
    expect(response.body).to.have.property('message').to.be.a('string')
    expect(response.body.message).to.equal('Access denied')
  })

  it('should be able to delete a user', async function () {
    const response = await request
      .delete(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(response.status).to.equal(200)
    expect(response.body).to.be.an('object')
    expect(response.body).to.have.property('message').to.be.a('string')
    expect(response.body.message).to.equal('User was deleted successfully!')
  })
})
