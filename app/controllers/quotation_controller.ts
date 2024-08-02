import Appointement from '#models/appointement'
import Artist from '#models/artist'
import User from '#models/user'
import QuotationService from '#services/quotation/quotation'
import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

@inject()
export default class QuotationController {
  constructor(protected quotationService: QuotationService) {}

  async generate(ctx: HttpContext) {
    const user: User | Artist | undefined = ctx.auth.user

    if (user === undefined || !(user instanceof Artist)) {
      return ctx.response.unauthorized()
    }
    const appointement = await Appointement.findOrFail(ctx.params.id)

    const pdfPath = await this.quotationService.generateQuotation(user, appointement)

    return ctx.response.attachment(pdfPath)
  }

  async displayTemplate(ctx: HttpContext) {
    const user = await Artist.findOrFail(ctx.params.id)
    if (user === undefined || !(user instanceof Artist)) {
      return ctx.response.unauthorized()
    }
    const appointement = await Appointement.findOrFail(ctx.params.appointement)
    const pricing = this.quotationService.getQuotationPricing(appointement.amount)

    return ctx.view.render('quotation/quotation', {
      client: appointement.user,
      artist: user,
      pricing: pricing,
      validityDate: new Date().setMonth(new Date().getMonth() + 1).toLocaleString(),
    })
  }
}
