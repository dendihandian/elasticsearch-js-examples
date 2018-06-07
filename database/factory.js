'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

const Factory = use('Factory')
const slugify = require('slugify')

/**
  Factory.blueprint('App/Models/User', (faker) => {
    return {
      username: faker.username()
    }
  })
*/

Factory.blueprint('App/Models/Product', (faker) => {

  const name = faker.sentence({ words: 5 }).replace('.','')
  const slug = slugify(name, {
    replacement: '-',    // replace spaces with replacement
    remove: /[$*_+~.()'"!\-:@]/g,        // regex to remove characters
    lower: true          // result in lower case
  })
  const stockInterval = { min: 1, max: 10 }
  const priceInterval = { min: 1, max: 100 }

  return {
    name: name,
    slug: slug,
    stock: Math.floor(Math.random() * (stockInterval.max - stockInterval.min + 1)) + stockInterval.min,
    price: Math.floor(Math.random() * (priceInterval.max - priceInterval.min + 1)) + priceInterval.min,
    description: faker.paragraph({ sentences: 5 }),
  }
})
