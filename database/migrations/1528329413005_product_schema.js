'use strict'

const Product = use('App/Models/Product')
const Schema = use('Schema')
const Env = use('Env')
const elasticsearch = use('elasticsearch')

// create elasticsearch client instance
const esHost = Env.get('ELASTICSEARCH_HOST', '127.0.0.1')
const esPort = Env.get('ELASTICSEARCH_PORT', '9200')
const esLog = Env.get('ELASTICSEARCH_LOG', 'trace')

const esClient = new elasticsearch.Client({
  host: esHost + ':' + esPort,
  log: esLog
});

class ProductSchema extends Schema {
  async up () {
    // create products table
    this.create('products', (table) => {
      table.increments()
      table.string('name')
      table.string('slug')
      table.integer('stock').unsigned()
      table.integer('price').unsigned()
      table.text('description').nullable()
      table.timestamps()
    })

    // create elasticsearch products index
    await esClient.indices.create({
      index: Product.INDEX,
    });

    // create elasticsearch products mapping
    esClient.indices.putMapping({
      index: Product.INDEX,
      type: Product.TYPE,
      body: {
        properties: Product.PROPERTIES
      }
    });

  }

  down () {
    // remove elasticsearch products index and mapping
    esClient.indices.delete({
      index: Product.INDEX,
    });

    // delete product table
    this.drop('products')
  }
}

module.exports = ProductSchema
