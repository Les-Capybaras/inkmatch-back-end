import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'files'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('showcase_id')
        .unsigned()
        .references('id')
        .inTable('showcases')
        .onDelete('CASCADE')
      table.string('url').notNullable()
      table.string('type').notNullable()
      table.integer('position').notNullable().defaultTo(0)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}