import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Showcase from '#models/showcase'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare showcaseId: number

  @column()
  declare url: string

  @column()
  declare type: string

  @column()
  declare position: number

  @belongsTo(() => Showcase)
  declare showcase: BelongsTo<typeof Showcase>
}
