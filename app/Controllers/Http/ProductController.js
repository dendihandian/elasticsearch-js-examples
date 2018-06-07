'use strict'

const Product = use('App/Models/Product')
const slugify = use('slugify')

class ProductController {
  async index ({ response }) {
    const products = await Product.all()
    response.status(200).json({
      message: 'Here are your products',
      data: products
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

    response.status(201).json({
      message: 'Successfuly created a new product',
      data: product
    })
  }

  async show ({ request, response, params: {id} }) {
    const product = request.post().product

    response.status(200).json({
      message: 'Here is your product',
      data: product
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

    response.status(200).json({
      message: 'Successfuly updated the product',
      data: product
    })
  }

  async destroy ({request, response, params: {id} }) {
    const product = request.post().product

    await product.delete()

    response.status(200).json({
      message: 'Successfuly deleted the product',
      id
    })
  }
}

module.exports = ProductController
