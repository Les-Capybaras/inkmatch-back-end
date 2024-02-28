const User = require('../models/User')

module.exports = async (app) => {
  console.log(`[DEBUG] - Start Syncing`)

    try {
      await User.sync()
      console.log('[DATABASE] - Synced database.')
      app.emit("databaseSynced");
    } catch (error) {
      console.error('[DATABASE] - Unable to sync database:', error)
    }

  console.log(`[DEBUG] - Start Synced`)
};

