'use strict'

const Schema = use('Schema')

class ProductSchema extends Schema {
  up () {
    this.create('products', (table) => {
      table.increments()
      table.string('name')
      table.string('slug')
      table.integer('stock').unsigned()
      table.integer('price').unsigned()
      table.text('description').nullable()
      table.timestamps()
    })

    // TODO: create elasticsearch products index and mapping
  }

  down () {
    // TODO: remove elasticsearch products index and mapping
    this.drop('products')
  }
}

module.exports = ProductSchema
