// Vars
import express from 'express'
import dotenv from 'dotenv'
import loader from './src/loaders/index'

const app = express()

loader(app);

// Select the env file
dotenv.config()
const PORT = process.env.API_PORT || 5000

// Start server
app.listen(port, err => {
  if (err) {
    console.log(err);
    return process.exit(1);
  }

  console.log(`Server is running on ${port}`);
});
