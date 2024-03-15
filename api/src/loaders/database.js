const Media = require('../models/Media')
const User = require('../models/User')

module.exports = async () => {
  try {
    await User.sync()
    await Media.sync()
    console.log('[DATABASE] - Synced database.')
  } catch (error) {
    console.error('[DATABASE] - Unable to sync database:', error)
  }
}
