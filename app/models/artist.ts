import { column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import Showcase from './showcase.js'
import User from './user.js'
import { LegalForm } from '../enums/legal_form.js'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Appointement from './appointement.js'

export default class Artist extends User {
  @column()
  declare siret: string

  @column()
  declare companyName: string

  @column()
  declare legalForm: LegalForm

  @hasOne(() => Showcase)
  declare showcase: HasOne<typeof Showcase>

  @hasMany(() => Appointement)
  declare appointements: HasMany<typeof Appointement>

  static artistAccessTokens = DbAccessTokensProvider.forModel(Artist, {
    table: 'artists_access_tokens',
  })
}
