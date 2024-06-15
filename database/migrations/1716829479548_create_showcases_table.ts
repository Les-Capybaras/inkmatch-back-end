import { BaseSchema } from '@adonisjs/lucid/schema'

// TODO: Finir le intégration showcase + uploads (type[image, pdf, facture, devis, paperasse en tout genre]).

export default class extends BaseSchema {
  protected tableName = 'showcases'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('artists').onDelete('CASCADE')
      //table.string('title').notNullable()
      //table.string('description').notNullable()
      //table.boolean('verified').defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
