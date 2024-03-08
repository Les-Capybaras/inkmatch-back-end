const databaseLoader = require('./database.js')
const expressLoader = require('./express.js')

module.exports = async (app) => {
  await databaseLoader()
  expressLoader(app)
}
