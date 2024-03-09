import express from 'express'
import loader from '../src/loaders/index'
import fixture from '../src/loaders/fixtures'

const PORT = 7000

const app = express()

;(async () => {
  await loader(app)
  await fixture()

  app.emit('databaseSynced')

  if (process.env.NODE_ENV !== 'prod') {
    console.log(`Server is running on ${PORT}`)
  }
})()

export default app
