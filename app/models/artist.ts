import { column } from '@adonisjs/lucid/orm'
import Showcase from './showcase.js'
import User from './user.js'
import { LegalForm } from '../enums/legal_form.js'

export default class Artist extends User {
  @column()
  declare showcase: Showcase

  @column()
  declare siret: string

  @column()
  declare companyName: string

  @column()
  declare legalForm: LegalForm
}
