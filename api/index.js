// Vars
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Express App
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Select the env file
dotenv.config();
const PORT = process.env.API_PORT || 5000;

// Models
require("./src/sync")();

// Swagger
require("./src/swagger")(app);


// Routes
//require("./src/routes")(app);
require("./src/routes/user.routes")(app);
require("./src/routes/trip.routes")(app);
require("./src/routes/auth.routes")(app);
require("./src/routes/car.routes")(app);
require("./src/routes/segment.routes")(app);
require("./src/routes/request.routes")(app);

// Start server
app.listen(PORT, () => {
  console.log(`[EXPRESS] - Server listening on port ${PORT}`);
});
