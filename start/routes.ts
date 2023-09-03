/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/
import Route from '@ioc:Adonis/Core/Route'

Route.post('users', async (ctx) => {
  const { default: UsersController } = await import('../app/Controllers/Http/UsersController')
  return new UsersController().create(ctx)
})

Route.post('login', async (ctx) => {
  const { default: UsersController } = await import('../app/Controllers/Http/UsersController');
  return new UsersController().logIn(ctx)
})

Route.post('logout', async (ctx) => {
  const { default: UsersController } = await import('../app/Controllers/Http/UsersController')
  return new UsersController().logOut(ctx)
})