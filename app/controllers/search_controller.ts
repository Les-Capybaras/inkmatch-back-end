import Artist from '#models/artist'
import { HttpContext } from '@adonisjs/core/http'

export default class SearchController {
  async searchArtists(ctx: HttpContext) {
    const { companyName, order } = ctx.request.qs()

    let query = Artist.query()

    if (companyName) {
      query = query.where('companyName', 'like', `%${companyName}%`)
    }

    if (order === 'companyName') {
      query = query.orderBy('companyName')
    }

    const artists = await query
    return ctx.response.ok(artists)
  }
}
