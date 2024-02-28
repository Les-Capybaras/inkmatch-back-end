const bodyParser = require('body-parser')
const cors = require('cors')

module.exports = (app) => {
    app.use(cors())
    app.use(bodyParser.json())
    
    // Swagger
    require('../src/swagger')(app)
    
    // Routes
    require("../src/routes")(app);
    require('../src/routes/user.routes')(app)
    require('../src/routes/auth.routes')(app)
}