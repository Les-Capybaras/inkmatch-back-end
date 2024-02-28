const databaseLoader = require('./database.js');
const expressLoader = require('./express.js');

export default async (app) => {
  await databaseLoader();
  expressLoader(app);
}