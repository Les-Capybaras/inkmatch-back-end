const express = require('express')

const PORT = 7000

const app = express()

;(async () => {
  console.log('mock')

  const loader = await import('../dist/loaders/index')
  console.log('loader')
  await loader.default(app)
  console.log('app')
  app.emit('databaseSynced')

  if (process.env.NODE_ENV !== 'prod') {
    console.log(`Server is running on ${PORT}`)
  }
})()

module.exports = app
