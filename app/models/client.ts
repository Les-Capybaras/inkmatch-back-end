import { column } from '@adonisjs/lucid/orm'
import User from './user.js'

export default class Client extends User {
  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare phoneNumber: string

  @column()
  declare address: string

  @column()
  declare city: string

  @column()
  declare zipCode: string

  @column()
  declare country: string
}
