'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

Route.get('/', ({ request }) => {
  return { greeting: 'Hello world in JSON' }
})

Route.group(() => {
  Route.get('/', 'ProductController.index')
  Route.post('/', 'ProductController.store')
  Route.get('/:id', 'ProductController.show').middleware(['findProduct'])
  Route.patch('/:id', 'ProductController.update').middleware(['findProduct'])
  Route.delete('/:id', 'ProductController.destroy').middleware(['findProduct'])
  Route.get('search/:query', 'ProductController.search')
})
.prefix('api/products')

Route.group(() => {
  Route.post('register', 'AuthController.register')
  Route.post('login', 'AuthController.login')
  Route.get('user', 'AuthController.user').middleware(['auth'])
  Route.post('logout', 'AuthController.logout').middleware(['auth'])
}).prefix('api/auth')
