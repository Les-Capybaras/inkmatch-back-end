import Artist from '#models/artist'
import { HttpContext } from '@adonisjs/core/http'

export default class ArtistsController {
  async searchArtists(ctx: HttpContext) {
    const { param, order } = ctx.request.qs()

    let query = Artist.query()

    if (param) {
      query = query.where((builder) => {
        builder
          .where('companyName', 'like', `%${param}%`)
          .orWhere('city', 'like', `%${param}%`)
          .orWhere('zipCode', 'like', `%${param}%`)
          .orWhere('address', 'like', `%${param}%`)
          .orWhere('firstName', 'like', `%${param}%`)
          .orWhere('lastName', 'like', `%${param}%`)
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
