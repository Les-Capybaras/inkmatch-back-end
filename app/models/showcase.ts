import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'
import File from '#models/file'

export default class Showcase extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare verified: boolean

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => File)
  declare files: HasMany<typeof File>
}
