// Vars
import express from 'express'
import dotenv from 'dotenv'
import loader from'./src/loaders/index'

const app = express()

loader(app)

// Select the env file
dotenv.config()
const PORT = process.env.API_PORT || 5000

// Start server
app.listen(PORT, (): void => {
  if (process.env.NODE_ENV !== 'prod') {
    console.log(`Server is running on ${PORT}`)
  }
})
