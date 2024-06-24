import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'appointements'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('artist_id').unsigned().references('id').inTable('artists').onDelete('CASCADE')
      table.text('description').notNullable()
      table.enum('status', ['Pending', 'Accepted', 'Refused', 'Cancelled', 'Done']).notNullable()
      table.date('date').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
