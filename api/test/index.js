// Vars
const dotenv = require('dotenv')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// Express App
const app = express()

app.use(cors())
app.use(bodyParser.json())

// Select the env file
dotenv.config()
const PORT = 5001;

// Models
(async () => {
  try {
    await require('../src/sync')();
    console.log('[DATABASE] - Synced database.');

    // Routes and server setup
    require('../src/routes')(app);
    require('../src/swagger')(app);
    require('../src/routes/user.routes')(app);
    require('../src/routes/auth.routes')(app);

    app.listen(PORT, () => {
      console.log(`[EXPRESS] - Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
})();

module.exports = app
