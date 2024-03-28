import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

export default class UsersController {
  async index(ctx: HttpContext) {
    logger.info(ctx.inspect())
    return [
      {
        id: 1,
        username: 'virk',
      },
      {
        id: 2,
        username: 'romain',
      },
    ]
  }
}
