module.exports = async () => {
  const User = require('./models/User')
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
}
