import databaseLoader from './database.js';
import expressLoader from './express.js';

export default async (app) => {
  await databaseLoader();
  expressLoader(app);
}