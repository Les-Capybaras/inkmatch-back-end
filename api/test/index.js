const express = require('express')
const loader = require('../src/loaders/index')
const fixture = require('../src/loaders/fixtures')

const PORT = 7000

const app = express()

;(async () => {
  await loader(app)
  await fixture()

  app.emit('databaseSynced')

  app.listen(PORT, (err) => {
    if (err) {
      console.log(err)
      return process.exit(1)
    }

    console.log(`Server is running on ${PORT}`)
  })
})()

module.exports = app
