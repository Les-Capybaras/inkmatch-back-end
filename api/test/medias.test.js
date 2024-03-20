const app = require('./index')
const supertest = require('supertest')

let chai
let expect

import('chai').then((Chai) => {
  chai = Chai
  expect = chai.expect
})

let request = supertest(app)

let token = ''

describe('Store a file and download it', function () {
  beforeEach(async () => {
    const response = await request.post('/api/auth/login').send({
      email: 'test@test.com',
      password: 'testtest12',
    })
    token = response.body.token
  })

  it('should upload a file', async function () {
    const response = await request
      .post('/api/medias')
      .set('Authorization', `Bearer ${token}`)
      .field('Content-Type', 'multipart/form-data')
      .attach('file', 'test/assets/mock.jpg')

    expect(response.status).to.equal(201)
    expect(response.body)
      .to.be.an('object')
      .to.have.property('id')
      .to.be.a('number')
  })
})
