'use strict'

/*
|--------------------------------------------------------------------------
| ProductSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Env = use('Env')
const elasticsearch     = require('elasticsearch');
const Product = use('App/Models/Product')

// create elasticsearch client instance
const esHost = Env.get('ELASTICSEARCH_HOST', '127.0.0.1')
const esPort = Env.get('ELASTICSEARCH_PORT', '9200')
const esLog = Env.get('ELASTICSEARCH_LOG', 'trace')
const esClient = new elasticsearch.Client({
  host: esHost + ':' + esPort,
  log: esLog
});

const Factory = use('Factory')

class ProductSeeder {
  async run () {
    // create products to database
    const products = await Factory
      .model('App/Models/Product')
      .createMany(10)

    // add products to elasticsearch products index
    if (products) {
      products.forEach(function(product) {
        esClient.index({
          index: Product.INDEX,
          type: Product.TYPE,
          id: product.id,
          body: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            stock: product.stock,
            price: product.price,
            description: product.description,
          }
        });
      });
    }
  }
}

module.exports = ProductSeeder
