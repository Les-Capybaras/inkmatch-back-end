import Artist from '#models/artist'
import { HttpContext } from '@adonisjs/core/http'

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
}
