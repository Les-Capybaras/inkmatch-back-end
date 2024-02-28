const User = require('./models/User')

module.exports = async () => {
  console.log("database called");

  console.log(`[DEBUG] - Start Syncing`)

    try {
      // await sequelize.sync({ force: true, alter: true });
      await User.sync()
      console.log('[DATABASE] - Synced database.')
      app.emit("appStarted");
    } catch (error) {
      console.error('[DATABASE] - Unable to sync database:', error)
    }

    console.log(`[DEBUG] - Start Synced`)
  };

