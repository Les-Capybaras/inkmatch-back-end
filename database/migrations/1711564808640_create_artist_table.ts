import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'artists'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.string('first_name').nullable()
      table.string('last_name').nullable()
      table.string('phone_number').nullable()
      table.string('address').nullable()
      table.string('city').nullable()
      table.string('zip_code').nullable()
      table.string('country').nullable()
      table.boolean('has_confirmed_email').defaultTo(false)
      table.string('company_name').nullable()
      table.string('legal_form').nullable()
      table.integer('prefered_arrhes_percentage').notNullable().defaultTo(10)
      table.integer('quote_number').notNullable().defaultTo(0)
      table.string('siret').nullable()
      table.json('availability').defaultTo(
        JSON.stringify({
          Monday: [
            { start: '09:00', end: '12:00' },
            { start: '14:00', end: '18:00' },
          ],
          Tuesday: [
            { start: '09:00', end: '12:00' },
            { start: '14:00', end: '18:00' },
          ],
          Wednesday: [
            { start: '09:00', end: '12:00' },
            { start: '14:00', end: '18:00' },
          ],
          Thursday: [
            { start: '09:00', end: '12:00' },
            { start: '14:00', end: '18:00' },
          ],
          Friday: [
            { start: '09:00', end: '12:00' },
            { start: '14:00', end: '18:00' },
          ],
          Saturday: [],
          Sunday: [],
        })
      )

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
