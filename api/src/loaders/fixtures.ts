import User from '../models/User'
import fixtureUser from '../fixtures/users.json' assert { type: 'json' };
import { hashPassword } from '../utils/auth'

export default async () => {
  await User.destroy({
    where: {},
    truncate: true,
  })

  fixtureUser.users.map(async (user: any) => {
    const pwd = await hashPassword(user.password)
    user.password = pwd
    await User.create(user)

    return user
  })

  console.log('[APP] - Fixtures loaded')
}
