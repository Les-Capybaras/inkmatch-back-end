const User = require('../models/User')

module.exports = async () => {
  try {
    await User.sync()
    console.log('[DATABASE] - Synced database.')
  } catch (error) {
    console.error('[DATABASE] - Unable to sync database:', error)
  }
}
