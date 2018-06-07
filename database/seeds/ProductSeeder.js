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

const Factory = use('Factory')

class ProductSeeder {
  async run () {
    const products = await Factory
      .model('App/Models/Product')
      .createMany(10)

    // TODO: add products to elasticsearch products index
  }
}

module.exports = ProductSeeder
