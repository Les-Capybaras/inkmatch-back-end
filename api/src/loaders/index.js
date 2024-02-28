const databaseLoader = require('./database.js');
const expressLoader = require('./express.js');

module.exports = async (app) => {
  console.log("loader called");
  await databaseLoader();
  expressLoader(app);
}