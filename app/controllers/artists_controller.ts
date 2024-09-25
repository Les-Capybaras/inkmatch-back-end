import Appointement from '#models/appointement'
import Artist from '#models/artist'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime, Interval } from 'luxon'

interface TimeRange {
  start: string // format 'HH:mm'
  end: string // format 'HH:mm'
}

interface Availability {
  [key: string]: TimeRange[]
}
interface TimeSlot {
  start: DateTime
  end: DateTime
}

export default class ArtistsController {
  async searchArtists(ctx: HttpContext) {
    let { param, order } = ctx.request.qs()

    if (param) {
      param = param.toLowerCase()
    }

    let query = Artist.query()

    if (param) {
      query = query.where((builder) => {
        builder
          .where('companyName', 'ilike', `%${param}%`)
          .orWhere('city', 'ilike', `%${param}%`)
          .orWhere('zipCode', 'ilike', `%${param}%`)
          .orWhere('address', 'ilike', `%${param}%`)
          .orWhere('firstName', 'ilike', `%${param}%`)
          .orWhere('lastName', 'ilike', `%${param}%`)
      })
    }

    if (order === 'companyName') {
      query = query.orderBy('companyName')
    }

    const artists = await query
    return ctx.response.ok(artists)
  }

  async getArtistDetail(ctx: HttpContext) {
    const artist = await Artist.findOrFail(ctx.params.id)
    return ctx.response.ok(artist)
  }

  async getAvailability(ctx: HttpContext) {
    try {
      const artistId = ctx.params.id // L'ID de l'artiste est passé en paramètre de la route
      const appointmentDurationInMinutes = 60 // Durée du créneau en minutes (1 heure)
      const timeIntervalInMinutes = 60 // Intervalle entre les créneaux (1 heure)

      // Définir la plage de dates (aujourd'hui jusqu'à 14 jours plus tard)
      const dateRange = {
        start: DateTime.now(),
        end: DateTime.now().plus({ days: 14 }),
      }

      // Récupérer les disponibilités de l'artiste
      const artist = await Artist.findOrFail(artistId)
      const availability = artist.availability as Availability

      // Récupérer les rendez-vous existants de l'artiste dans la plage de dates
      const existingAppointments = await Appointement.query()
        .where('artist_id', artistId)
        .whereBetween('start_time', [dateRange.start.toSQL(), dateRange.end.toSQL()])

      // Mapper les rendez-vous existants en intervalles
      const appointmentIntervals: Interval[] = existingAppointments.map((appointment) => {
        const startTimeSQL = appointment.startTime?.toSQL()
        if (!startTimeSQL) {
          // Gérer le cas où start_time est null
          throw new Error('Appointment start_time is null')
        }
        const appointmentStart = DateTime.fromSQL(startTimeSQL)
        const durationInMinutes = parseDurationToMinutes(appointment.duration)
        const appointmentEnd = appointmentStart.plus({ minutes: durationInMinutes })
        return Interval.fromDateTimes(appointmentStart, appointmentEnd)
      })

      // Initialiser l'objet de résultats
      const availableTimeSlots: { [date: string]: TimeSlot[] } = {}

      // Itérer sur chaque jour dans la plage de dates
      for (
        let day = dateRange.start.startOf('day');
        day <= dateRange.end;
        day = day.plus({ days: 1 })
      ) {
        const dayName = day.toFormat('EEEE') // 'Monday', 'Tuesday', etc.

        // Obtenir les disponibilités pour le jour
        const dailyAvailability = availability[dayName]
        if (!dailyAvailability || dailyAvailability.length === 0) {
          continue // Pas de disponibilité ce jour-là
        }

        const dayTimeSlots: TimeSlot[] = []

        // Pour chaque plage horaire disponible ce jour-là
        for (const timeRange of dailyAvailability) {
          const rangeStartTime = DateTime.fromISO(`${day.toISODate()}T${timeRange.start}`)
          const rangeEndTime = DateTime.fromISO(`${day.toISODate()}T${timeRange.end}`)

          // Générer les créneaux possibles dans cette plage horaire
          for (
            let slotStart = rangeStartTime;
            slotStart.plus({ minutes: appointmentDurationInMinutes }) <= rangeEndTime;
            slotStart = slotStart.plus({ minutes: timeIntervalInMinutes })
          ) {
            const slotEnd = slotStart.plus({ minutes: appointmentDurationInMinutes })
            const slotInterval = Interval.fromDateTimes(slotStart, slotEnd)

            // Vérifier les chevauchements avec les rendez-vous existants
            const overlaps = appointmentIntervals.some((appointmentInterval) =>
              appointmentInterval.overlaps(slotInterval)
            )

            if (!overlaps) {
              dayTimeSlots.push({ start: slotStart, end: slotEnd })
            }
          }
        }

        if (dayTimeSlots.length > 0) {
          availableTimeSlots[day.toISODate()] = dayTimeSlots
        }
      }

      // Formater les créneaux pour une meilleure lisibilité
      const formattedAvailableTimeSlots = Object.entries(availableTimeSlots).map(
        ([date, slots]) => ({
          date,
          slots: slots.map((slot) => ({
            start: slot.start.toFormat('HH:mm'),
            end: slot.end.toFormat('HH:mm'),
          })),
        })
      )

      // Retourner les créneaux disponibles
      return ctx.response.status(200).json(formattedAvailableTimeSlots)
    } catch (error) {
      console.error(error)
      return ctx.response.status(500).json({ error: 'Erreur interne du serveur' })
    }

    // Fonction utilitaire pour parser la durée en minutes
    function parseDurationToMinutes(durationStr: string): number {
      const [hours, minutes] = durationStr.split(':').map(Number)
      return hours * 60 + minutes
    }
  }

  async getAppointements(ctx: HttpContext) {
    const artistId = ctx.params.id
    const appointements = await Appointement.query().where('artist_id', artistId)
    return ctx.response.ok(appointements)
  }
}
