import Appointement from '#models/appointement'
import { requestAppointementCreation } from '#validators/appointement'
import { HttpContext } from '@adonisjs/core/http'
import { AppointementStatus } from '../enums/appointements_status.js'

export default class AppointementController {
  async show(ctx: HttpContext) {
    const appointement = await Appointement.findOrFail(ctx.params.id)

    return ctx.response.ok(appointement)
  }

  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(requestAppointementCreation)
    const object = { ...payload, userId: ctx.auth.user?.id, status: AppointementStatus.Pending }
    const appointement = await Appointement.create(object)

    return ctx.response.created(appointement)
  }
  async delete(ctx: HttpContext) {
    const appointement = await Appointement.findOrFail(ctx.params.id)
    await appointement.delete()
    return ctx.response.noContent()
  }
}
