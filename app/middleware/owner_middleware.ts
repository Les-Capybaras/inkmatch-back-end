import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class IsOwnerMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user

    if (user === undefined) {
      return ctx.response.unauthorized()
    }

    // Implement a way to check if the logged user is the owner of the resource targeted by the request
    // If not, return a 403 Forbidden response

    const output = await next()
    return output
  }
}
