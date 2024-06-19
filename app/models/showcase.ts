import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import File from '#models/file'
import Artist from './artist.js'

export default class Showcase extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare artistId: number

  @belongsTo(() => Artist)
  declare artist: BelongsTo<typeof Artist>

  @hasMany(() => File)
  declare files: HasMany<typeof File>
}
