const User = require('../models/User')
const bcrypt = require('bcryptjs')
const fixtureUser = require('../fixtures/users.json')

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  const encryptedPassword = await bcrypt.hash(password, salt)
  return encryptedPassword
}

module.exports = async () => {
  await User.destroy({
    where: {},
    truncate: true,
  })

  fixtureUser.users.map(async (user) => {
    const pwd = await hashPassword(user.password)
    user.password = pwd
    await User.create(user)

    return user
  })

  console.log('[APP] - Fixtures loaded')
}
