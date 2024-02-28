const express = require('express');
const loader = require('../src/loaders/index');

const PORT = 5001;

const app = express()

loader(app)

app.listen(port, err => {
  if (err) {
    console.log(err);
    return process.exit(1);
  }

  app.emit("databaseSynced");
  console.log(`Server is running on ${port}`);
});

module.exports = app

