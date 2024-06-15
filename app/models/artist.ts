import { column } from '@adonisjs/lucid/orm'
import Showcase from './showcase.js'
import User from './user.js'
import { LegalForm } from '../enums/legal_form.js'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

export default class Artist extends User {
  @column()
  declare showcase: Showcase

  @column()
  declare siret: string

  @column()
  declare companyName: string

  @column()
  declare legalForm: LegalForm

  static artistAccessTokens = DbAccessTokensProvider.forModel(Artist, {
    table: 'artists_access_tokens',
  })
}
