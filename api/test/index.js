// Vars
const dotenv = require('dotenv')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const PORT = 5001

const startApp = async () => {
  // Express App
  const app = express()

  app.use(cors())
  app.use(bodyParser.json())

  // Select the env file
  dotenv.config()

  // Models
  await require('../src/sync')()

  // Swagger
  require('../src/swagger')(app)

  // Routes
  //require("./src/routes")(app);
  require('../src/routes/user.routes')(app)
  require('../src/routes/auth.routes')(app)

  return app
}

const app = startApp()

// Start server
app.listen(PORT, () => {
  console.log(`[EXPRESS] - Server listening on port ${PORT}`)
})

module.exports = app
