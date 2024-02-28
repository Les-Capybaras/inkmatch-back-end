const express = require('express');
const dotenv = require('dotenv');
const loader = require('../src/loaders/index');
const PORT = 5001;
const app = express()

loader(app)
.then(() => {
  // Select the env file
  dotenv.config()

  // Start server
  app.listen(PORT, err => {
    if (err) {
      console.log(err);
      return process.exit(1);
    }

    console.log(`Server is running on ${PORT}`);
  });
}

);


