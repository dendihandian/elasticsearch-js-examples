'use strict'

const Product = use('App/Models/Product')
const slugify = use('slugify')
const Env = use('Env')
const elasticsearch = use('elasticsearch')

const esHost = Env.get('ELASTICSEARCH_HOST', '127.0.0.1')
const esPort = Env.get('ELASTICSEARCH_PORT', '9200')
const esLog = Env.get('ELASTICSEARCH_LOG', 'trace')
const esClient = new elasticsearch.Client({
  host: esHost + ':' + esPort,
  log: esLog
})

class ProductController {
  async index ({ request, response }) {

    let params = {
      index: Product.INDEX,
      body: {
        query: {
          match_all: {}
        }
      },
    }

    const { q } = request.get()

    if (q) {
      params = {
        index: Product.INDEX,
        q: q
      }
    }

    const products = await esClient.search(params)

    let data = []
    if (products.hits.hits) {
      products.hits.hits.forEach(function(product) {
        data.push(product._source)
      })
    }

    response.status(200).json({
      message: 'Here are your products',
      data: data,
    })
  }

  async store ({ request, response, params: { id } }) {
    const { name, stock, price, description } = request.post()

    const slug = slugify(name, {
      replacement: '-',    // replace spaces with replacement
      remove: /[$*_+~.()'"!\-:@]/g,        // regex to remove characters
      lower: true          // result in lower case
    })

    const product = await Product.create({ name, slug, stock, price, description })

    // elasticsearch create
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
    })

    response.status(201).json({
      message: 'Successfuly created a new product',
      data: product
    })
  }

  async show ({ request, response, params: {id} }) {
    const product = await esClient.get({
      index: Product.INDEX,
      type: Product.TYPE,
      id: id
    })

    response.status(200).json({
      message: 'Here is your product',
      data: product._source
    })
  }

  async update ({ request, response, params: {id} }) {
    const { name, stock, price, description, product } = request.post()

    product.name = name
    product.slug = slugify(name, {
      replacement: '-',    // replace spaces with replacement
      remove: /[$*_+~.()'"!\-:@]/g,        // regex to remove characters
      lower: true          // result in lower case
    })
    product.stock = stock
    product.price = price
    product.description = description

    await product.save()

    // elasticsearch update
    esClient.update({
      index: Product.INDEX,
      type: Product.TYPE,
      id: id,
      body: {
        doc: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          stock: product.stock,
          price: product.price,
          description: product.description,
        }
      }
    })

    response.status(200).json({
      message: 'Successfuly updated the product',
      data: product
    })
  }

  async destroy ({request, response, params: {id} }) {
    const product = request.post().product

    await product.delete()

    // elasticsearch delete
    esClient.delete({
      index: Product.INDEX,
      type: Product.TYPE,
      id: id,
    })

    response.status(200).json({
      message: 'Successfuly deleted the product',
      id
    })
  }

  async search ({ request, response, params: {query} }) {
    const products = await esClient.search({
      index: Product.INDEX,
      q: query,
    })

    let data = []
    if (products.hits.hits) {
      products.hits.hits.forEach(function(product) {
        data.push(product._source)
      })
    }

    response.status(200).json({
      message: 'Here is your search result',
      data: data,
    })
  }
}

module.exports = ProductController
