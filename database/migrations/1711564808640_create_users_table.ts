import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

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

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
