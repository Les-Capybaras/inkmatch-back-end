import { BaseModel, column } from '@adonisjs/lucid/orm'
import { FileType } from '../enums/file_type.js'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare url: string

  @column()
  declare ext: string

  @column()
  declare size: number

  @column()
  declare type: FileType

  @column()
  declare showcaseId: number

  @column()
  declare appointementId: number
}
