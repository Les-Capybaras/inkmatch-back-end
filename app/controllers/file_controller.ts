import File from '#models/file'
import { requestFileUpload } from '#validators/file'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class FileController {
  async show(ctx: HttpContext) {
    const file = await File.findOrFail(ctx.params.id)

    const filePath = file.url

    const absolutePath = app.makePath('uploads/' + filePath)
    return ctx.response.download(absolutePath)
  }

  async store(ctx: HttpContext) {
    const request = await ctx.request.validateUsing(requestFileUpload)

    await request.file.move(app.makePath('uploads'))

    const file = await File.create({
      url: request.file.fileName,
      type: request.file.type,
    })

    return ctx.response.created(file)
  }
  async delete(ctx: HttpContext) {
    const file = await File.findOrFail(ctx.params.id)
    await file.delete()
    return ctx.response.noContent()
  }
}
