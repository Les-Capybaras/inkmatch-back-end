import Showcase from '#models/showcase'
import { HttpContext } from '@adonisjs/core/http'

export default class ShowcaseController {
  async show(ctx: HttpContext) {
    const showcases = await Showcase.query()
      .where('id', ctx.params.id)
      .preload('files', (query) => {
        query.orderBy('position')
      })
      .first()

    return ctx.response.ok(showcases)
  }

  async create(ctx: HttpContext) {
    const payload = ctx.request.only(['title', 'description', 'verified'])
    const showcase = await Showcase.create({
      userId: ctx.auth.user?.id, // Add null check for ctx.auth.user
      ...payload,
    })

    return ctx.response.created(showcase)
  }
}
