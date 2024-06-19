import Artist from '#models/artist'
import Showcase from '#models/showcase'
import User from '#models/user'
import File from '#models/file'
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

    const userShowcase = await user.related('showcase').query().first()

    if (!userShowcase) {
      return ctx.response.notFound()
    }

    // If the payload contains files add them to the files property
    const filesIds = ctx.request.body().files

    if (filesIds && Array.isArray(filesIds)) {
      const files = await File.query().whereIn('id', filesIds)

      if (files.length !== filesIds.length) {
        return ctx.response.badRequest({ message: 'Invalid files' })
      }

      files.map((file: File) => {
        userShowcase.related('files').save(file)
      })
    }
    await userShowcase.load('files')

    return ctx.response.ok(userShowcase.serialize())
  }
}
