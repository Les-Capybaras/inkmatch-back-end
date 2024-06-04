import File from '#models/file'
import Showcase from '#models/showcase'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class ShowcaseController {
  async store(ctx: HttpContext) {
    const showcaseId = ctx.params.showcaseId
    const showcase = await Showcase.find(showcaseId)

    const file = ctx.request.file('file', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg', 'gif', 'pdf'],
    })

    if (!file) {
      return ctx.response.badRequest({ message: 'No file provided.' })
    }

    await file.move(app.publicPath('uploads'), {
      name: `${new Date().getTime()}.${file.extname}`,
    })

    const fileType = ctx.request.input('type')
    const newFile = new File()
    newFile.url = `uploads/${file.fileName}`
    newFile.showcaseId = showcase.id
    newFile.type = fileType
    newFile.position = (await File.query().where('showcaseId', showcaseId).count('* as total'))[0].total + 1;
    await newFile.save()

    return ctx.response.created(newFile)

  }

  async updateOrder(ctx: HttpContext) {}
}
