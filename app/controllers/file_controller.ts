// import File from '#models/file'
// import Showcase from '#models/showcase'
// import { HttpContext } from '@adonisjs/core/http'

export default class ShowcaseController {
  // async store(ctx: HttpContext) {
  //   const showcaseId = ctx.params.showcaseId
  //   const showcase = await Showcase.find(showcaseId)

  //   const file = ctx.request.file('file', {
  //     size: '2mb',
  //     extnames: ['jpg', 'png', 'jpeg', 'gif', 'pdf'],
  //   })

  //   if (!file) {
  //     return ctx.response.badRequest({ message: 'No file provided.' })
  //   }

  //   const totalFiles = await File.query().where('showcaseId', showcaseId).count('* as total')
  //   const position = totalFiles[0].total + 1

  //   newFile.position = position

  //   return ctx.response.created(newFile)
  // }

  // async updateOrder(ctx: HttpContext) {}
}
