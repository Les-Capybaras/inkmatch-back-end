// Vars
const express = require('express')
const dotenv = require('dotenv')
const loader = require('./src/loaders/index')

const app = express()

loader(app)

// Select the env file
dotenv.config()
const PORT = process.env.API_PORT || 5000

// Start server
app.listen(PORT, (err) => {
  if (err) {
    console.log(err)
    return process.exit(1)
  }

  console.log(`Server is running on ${PORT}`)
})
