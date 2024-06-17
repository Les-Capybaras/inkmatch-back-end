import Artist from '#models/artist'
import Showcase from '#models/showcase'
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class ShowcaseController {
  async show(ctx: HttpContext) {
    const showcases = await Showcase.query().where('id', ctx.params.id).preload('files').first()

    return ctx.response.ok(showcases)
  }

  async manageShowcase(ctx: HttpContext) {
    const user: User | Artist | undefined = ctx.auth.user

    if (user === undefined || !(user instanceof Artist)) {
      return ctx.response.unauthorized()
    }

    const userShowcase = await user.showcase
    if (userShowcase === null) {
      return ctx.response.notFound()
    }

    // If the payload contains files add them to the files property
    const files = ctx.request.body().files

    if (files) {
      userShowcase.files = files
      await userShowcase.save()
    }
    return ctx.response.ok(userShowcase)
  }
}
