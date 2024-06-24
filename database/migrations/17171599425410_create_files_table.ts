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
      table
        .integer('appointement_id')
        .unsigned()
        .references('id')
        .inTable('appointements')
        .onDelete('CASCADE')
      table.string('url').notNullable()
      table.string('ext').notNullable()
      table.integer('size').notNullable()
      table.string('type').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
