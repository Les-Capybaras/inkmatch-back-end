const bodyParser = require('body-parser')
const cors = require('cors')

module.exports = (app) => {
    app.use(cors())
    app.use(bodyParser.json())
    
    // Swagger
    require('../swagger')(app)
    
    // Routes
    require("../routes")(app);
    require('../routes/user.routes')(app)
    require('../routes/auth.routes')(app)
}