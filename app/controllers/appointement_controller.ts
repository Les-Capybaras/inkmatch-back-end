import Appointement from '#models/appointement'
import {
  requestAppointementCreation,
  requestAppointementCreationArtist,
} from '#validators/appointement'
import { HttpContext } from '@adonisjs/core/http'
import { AppointementStatus } from '../enums/appointements_status.js'
import MailingService from '#services/mailing'
import User from '#models/user'

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

  async accept(ctx: HttpContext) {
    const appointement = await Appointement.findOrFail(ctx.params.id)

    if (appointement.artistId !== ctx.auth.user?.id) {
      return ctx.response.forbidden()
    }

    appointement.status = AppointementStatus.Accepted
    await appointement.save()

    // Send confirmation email to user
    const user = await User.findOrFail(appointement.userId);
    const artist = await User.findOrFail(ctx.auth.user?.id);
    await MailingService.createConfirmAppointementEmail(user, artist, appointement)

    return ctx.response.ok(appointement)
  }

  async reject(ctx: HttpContext) {
    const appointement = await Appointement.findOrFail(ctx.params.id)

    if (appointement.artistId !== ctx.auth.user?.id) {
      return ctx.response.forbidden()
    }

    appointement.status = AppointementStatus.Rejected
    await appointement.save()

    // TODO: Send alert/email/something to customer

    return ctx.response.ok(appointement)
  }

  async storeArtistToClient(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(requestAppointementCreationArtist)
    const object = { ...payload, artistId: ctx.auth.user?.id, status: AppointementStatus.Accepted }

    try {
      const appointement = await Appointement.create(object)

      // Send confirmation email to user
      const user = await User.findOrFail(appointement.userId);
      const artist = await User.findOrFail(ctx.auth.user?.id);
      await MailingService.createConfirmAppointementEmail(user, artist, appointement)

      return ctx.response.created(appointement)
    } catch (error) {
      return ctx.response.badRequest({ message: 'Could not create appointement' })
    }
  }
}
