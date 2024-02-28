module.exports = async () => {
  const User = require('./models/User')
  console.log(`[DEBUG] - Start Syncing`)

  const syncDatabase = async () => {
    try {
      // await sequelize.sync({ force: true, alter: true });
      await User.sync()
      console.log('[DATABASE] - Synced database.')
    } catch (error) {
      console.error('[DATABASE] - Unable to sync database:', error)
    }
  }
  await syncDatabase()

  console.log(`[DEBUG] - Start Synced`)
}
