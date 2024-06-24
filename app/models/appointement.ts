import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import File from '#models/file'
import Artist from './artist.js'
import User from './user.js'
import { DateTime } from 'luxon'
import { AppointementStatus } from '../enums/appointements_status.js'

export default class Appointement extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare description: string

  @column()
  declare status: AppointementStatus

  @column()
  declare artistId: number

  @column()
  declare userId: number

  @column()
  declare date: Date

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Artist)
  declare artist: BelongsTo<typeof Artist>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => File)
  declare files: HasMany<typeof File>
}
