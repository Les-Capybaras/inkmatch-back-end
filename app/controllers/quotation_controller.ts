import Artist from '#models/artist'
import User from '#models/user'
import QuotationService from '#services/quotation/quotation'
import { HttpContext } from '@adonisjs/core/http'

export default class QuotationController {
  async generate(ctx: HttpContext) {
    const user: User | Artist | undefined = ctx.auth.user

    if (user === undefined || !(user instanceof Artist)) {
      return ctx.response.unauthorized()
    }

    const quotationService = new QuotationService()
    const pdfPath = await quotationService.generateQuotation(user)

    return ctx.response.attachment(pdfPath)
  }

  async displayTemplate(ctx: HttpContext) {
    const user = await Artist.findOrFail(ctx.params.id)
    if (user === undefined || !(user instanceof Artist)) {
      return ctx.response.unauthorized()
    }
    // Enhance by adding possiblitity to customize the template

    return ctx.view.render('quotation/quotation')
  }
}
