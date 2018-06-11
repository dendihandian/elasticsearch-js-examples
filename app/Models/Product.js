'use strict'

const Model = use('Model')

class Product extends Model {
}

Product.INDEX = 'products'
Product.TYPE = 'products'
Product.PROPERTIES = {
  id: { type: 'integer' },
  name: { type: 'text' },
  slug: { type: 'text' },
  stock: { type: 'integer' },
  price: { type: 'integer' },
  description: { type: 'text' }
}

module.exports = Product
