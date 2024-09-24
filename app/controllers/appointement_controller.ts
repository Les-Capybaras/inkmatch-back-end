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
import { DateTime } from 'luxon'

export default class AppointementController {
  async show(ctx: HttpContext) {
    const appointement = await Appointement.findOrFail(ctx.params.id)

    return ctx.response.ok(appointement)
  }

  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(requestAppointementCreation)

    // Combiner la date et l'heure pour obtenir le startTime
    const date = DateTime.fromJSDate(payload.date)
    const [hour, minute] = payload.startTime.split(':').map(Number)
    const startTime = date.set({ hour, minute })

    // Préparer les données pour créer l'appointement
    const appointementData = {
      userId: ctx.auth.user!.id,
      artistId: payload.artistId,
      description: payload.description,
      duration: payload.duration,
      startTime: startTime,
      date: payload.date, // Si nécessaire pour d'autres contrôleurs
      status: AppointementStatus.Pending,
    }

    // Créer l'appointement
    const appointement = await Appointement.create(appointementData)

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

    // Combiner la date et l'heure pour obtenir le startTime
    const date = DateTime.fromJSDate(payload.date)
    const [hour, minute] = payload.startTime.split(':').map(Number)
    const startTime = date.set({ hour, minute })

    const appointementData = {
      userId: payload.userId,
      artistId: ctx.auth.user!.id,
      description: payload.description,
      duration: payload.duration,
      startTime: startTime,
      date: payload.date, // Si nécessaire pour d'autres contrôleurs
      status: AppointementStatus.Accepted,
    }

    try {
      // Send confirmation email to user
      const user = await User.findOrFail(payload.userId)
      const artist = await Artist.findOrFail(ctx.auth.user?.id)

      if (!user || !artist) {
        console.log('User or artist not found', user, artist)

        return ctx.response.badRequest({ message: 'User or artist not found' })
      }
      const appointement = await Appointement.create(appointementData)

      await MailingService.createConfirmAppointementEmail(user, artist, appointement)

      return ctx.response.created(appointement)
    } catch (error) {
      console.log(error)

      return ctx.response.badRequest({ message: 'Could not create appointement' })
    }
  }
}
