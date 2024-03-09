import User from '../models/User'

export default async () => {
  try {
    await User.sync()
    console.log('[DATABASE] - Synced database.')
  } catch (error) {
    console.error('[DATABASE] - Unable to sync database:', error)
  }
}
