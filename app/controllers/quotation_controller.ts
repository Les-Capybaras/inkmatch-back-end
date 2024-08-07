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
    const artist = await Artist.findOrFail(ctx.params.id)
    if (artist === undefined || !(artist instanceof Artist)) {
      return ctx.response.unauthorized()
    }
    const appointement = await Appointement.findOrFail(ctx.params.appointement)
    const formatedAppointement = {
      ...appointement,
      formatedDate: this.getFormatedDate(appointement.date),
    }
    const user = await User.findOrFail(appointement.userId)
    const pricing = this.quotationService.getQuotationPricing(appointement.amount)

    return ctx.view.render('quotation/quotation', {
      client: user,
      artist: artist,
      pricing: pricing,
      appointement: formatedAppointement,
      date: this.getFormatedDate(null),
      validityDate: this.getFormatedDate(null, true),
    })
  }

  getFormatedDate(date: Date | null | undefined, isValidity = false) {
    if (date === null || date === undefined) {
      date = new Date()
    }

    if (isValidity) {
      date.setMonth(date.getMonth() + 1)
    }

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    const formattedDate = `${day}/${month}/${year}`

    return formattedDate
  }
}
