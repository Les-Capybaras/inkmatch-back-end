import app from '../index'
import supertest from 'supertest'
import { describe, it } from 'mocha'
import { expect } from 'chai'

const request = supertest(app)

describe('Implement authent on the API', function () {
  it('creates a user', function (done) {
    const user = {
      email: 'test@test.com',
      password: 'testtest12',
      password2: 'testtest12',
      firstname: 'John',
      lastname: 'Doe',
      birthdate: '2000-12-12',
    }

    request
      .post('/api/auth/register')
      .send(user)
      .end(function (err, res) {
        expect(res.status).to.equal(201)
        expect(res.body).to.have.property('id')
        expect(res.body).to.have.property('email')
        expect(res.body).to.have.property('firstname')
        done(err)
      })
  })

  it('fails to create a user', function (done) {
    const user = {
      email: 'johndoe@gmail.com',
      password: 'testtest12',
      password2: 'testtest',
      firstname: 'John',
      lastname: 'Doe',
      birthdate: '2000-12-12',
    }

    request
      .post('/api/auth/register')
      .send(user)
      .end(function (err, res) {
        expect(res.status).to.equal(400)
        expect(res.body).to.have.property('errors').to.be.an('array')
        expect(res.body.errors[0])
          .to.have.property('msg')
          .to.equal('Passwords must match')
        done(err)
      })
  })

  it('authenticate a user', function (done) {
    const payload = {
      email: 'test@test.com',
      password: 'testtest12',
    }

    request
      .post('/api/auth/login')
      .send(payload)
      .end(function (err, res) {
        expect(res.status).to.equal(200)
        expect(res.body).to.have.property('token')
        done(err)
      })
  })

  it('should to call a protected route using login token', function (done) {
    const payload = {
      email: 'test@test.com',
      password: 'testtest12',
    }

    request
      .post('/api/auth/login')
      .send(payload)
      .end(function (err, res) {
        const token = res.body.token
        request
          .get('/api/users')
          .set('Authorization', `Bearer ${token}`)
          .end(function (err, res) {
            expect(res.status).to.equal(200)
            expect(res.body).to.be.an('array')
            expect(res.body[0]).to.have.property('id')
            expect(res.body[0]).to.have.property('email')
            expect(res.body[0]).to.have.property('firstname')
            done(err)
          })
      })
  })

  it('should return 401 if no token is provided', async () => {
    //request.get('/api/users').end(function (err, res) {
    //  expect(res.status).to.equal(401)
    //  expect(res.body).to.have.property('message').to.equal('Access denied')
    //})

    // TODO: Implement a protected route to make this test work
  })
})
