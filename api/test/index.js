const express = require('express');
const loader = require('../src/loaders/index');

const PORT = 5000;

const app = express()

loader(app)

app.listen(PORT, err => {
  if (err) {
    console.log(err);
    return process.exit(1);
  }

  console.log(`Server is running on ${PORT}`);
});

module.exports = app

