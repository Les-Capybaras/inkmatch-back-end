import Appointement from '#models/appointement'
import {
  requestAppointementCreation,
  requestAppointementCreationArtist,
} from '#validators/appointement'
import { HttpContext } from '@adonisjs/core/http'
import { AppointementStatus } from '../enums/appointements_status.js'
import MailingService from '#services/mailing'
import User from '#models/user'
import Artist from '#models/artist'

export default class AppointementController {
  async show(ctx: HttpContext) {
    const appointement = await Appointement.findOrFail(ctx.params.id)

    return ctx.response.ok(appointement)
  }

  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(requestAppointementCreation)
    const object = { ...payload, userId: ctx.auth.user?.id, status: AppointementStatus.Pending }
    const appointement = await Appointement.create(object)

    // TODO: send email to artist when appointement is created and pending
    const user = await User.findOrFail(ctx.auth.user?.id)
    const artist = await Artist.findOrFail(appointement.artistId)
    await MailingService.createRequestAppointementEmail(artist, user, appointement)

    return ctx.response.created(appointement)
  }

  async delete(ctx: HttpContext) {
    const appointement = await Appointement.findOrFail(ctx.params.id)
    await appointement.delete()
    return ctx.response.noContent()
  }

  async accept(ctx: HttpContext) {
    const appointement = await Appointement.findOrFail(ctx.params.id)

    if (appointement.status === AppointementStatus.Accepted) {
      return ctx.response.badRequest({ message: 'Appointement already accepted' })
    }

    if (appointement.artistId !== ctx.auth.user?.id) {
      return ctx.response.forbidden()
    }

    appointement.status = AppointementStatus.Accepted
    await appointement.save()

    // Send confirmation email to user
    const user = await User.findOrFail(appointement.userId)
    const artist = await Artist.findOrFail(ctx.auth.user?.id)
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

    const user = await User.findOrFail(appointement.userId)
    const artist = await Artist.findOrFail(ctx.auth.user?.id)
    await MailingService.createRejectAppointementEmail(user, artist, appointement)

    return ctx.response.ok(appointement)
  }

  async storeArtistToClient(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(requestAppointementCreationArtist)
    const object = { ...payload, artistId: ctx.auth.user?.id, status: AppointementStatus.Accepted }

    try {
      // Send confirmation email to user
      const user = await User.findOrFail(payload.userId)
      const artist = await Artist.findOrFail(ctx.auth.user?.id)

      if (!user || !artist) {
        console.log('User or artist not found', user, artist)

        return ctx.response.badRequest({ message: 'User or artist not found' })
      }
      const appointement = await Appointement.create(object)

      await MailingService.createConfirmAppointementEmail(user, artist, appointement)

      return ctx.response.created(appointement)
    } catch (error) {
      console.log(error)

      return ctx.response.badRequest({ message: 'Could not create appointement' })
    }
  }
}
