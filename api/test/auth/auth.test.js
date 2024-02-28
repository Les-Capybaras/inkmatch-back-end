const app = require('../index')

const supertest = require('supertest')

let chai
let expect

import('chai').then((Chai) => {
  chai = Chai
  expect = chai.expect
})

const request = supertest(app)

before(function (done) {
  app.on("databaseSynced", function(){
      done();
  });
});

describe('POST /api/auth/register', function () {
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
})