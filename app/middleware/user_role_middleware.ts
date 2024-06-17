import Artist from '#models/artist'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

type RoleGuards = 'artist' | 'admin'

export default class UserRoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options: { guard: RoleGuards }) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const user = ctx.auth.user

    if (!user) {
      return ctx.response.unauthorized()
    }

    const role = user instanceof Artist ? 'artist' : 'user'

    if (options.guard !== role) {
      return ctx.response.unauthorized()
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
