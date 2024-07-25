import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import hash from '@adonisjs/core/services/hash'
import Showcase from './showcase.js'
import { LegalForm } from '../enums/legal_form.js'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Appointement from './appointement.js'
import { compose } from '@adonisjs/core/helpers'
import { DateTime } from 'luxon'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class Artist extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare firstName: string | null

  @column()
  declare lastName: string | null

  @column()
  declare phoneNumber: string | null

  @column()
  declare address: string | null

  @column()
  declare city: string | null

  @column()
  declare zipCode: string | null

  @column()
  declare country: string | null

  @column({ consume: (value) => !!value })
  declare hasConfirmedEmail: boolean

  @hasMany(() => Appointement)
  declare appointements: HasMany<typeof Appointement>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column()
  declare siret: string

  @column()
  declare companyName: string

  @column()
  declare legalForm: LegalForm

  @hasOne(() => Showcase)
  declare showcase: HasOne<typeof Showcase>

  static artistAccessTokens = DbAccessTokensProvider.forModel(Artist, {
    table: 'artists_access_tokens',
  })
}
