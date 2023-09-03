import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '../../Models/User'

import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { OpaqueTokenContract } from '@ioc:Adonis/Addons/Auth'

export default class UsersController {
  public async index({ }: HttpContextContract) { }

  public async create({ request, response }: HttpContextContract) {
    try {
      const newUserSchema = schema.create({
        username: schema.string(),
        email: schema.string({}, [rules.email()]),
        password: schema.string({}, [rules.confirmed('passwordConfirmation')]),
      })
      const payload = await request.validate({
        schema: newUserSchema,
      })
      const user = await User.create(payload)
      response.ok(user)
    } catch (error) {
      response.badRequest(error)
    }
  }

  // todo move those methods into an auth controller
  public async logIn({ auth, request }: HttpContextContract): Promise<OpaqueTokenContract<any>> {
    const username = request.input('username')
    const password = request.input('password')
    const stayLoggedIn = request.input('stayLoggedIn', false)
    if (stayLoggedIn) {
      return auth.use('api').attempt(username, password);
    }
    return auth.use('api').attempt(username, password, {
      expiresIn: '30min'
    })
    // todo: check that a token that never expires is still correct after a short time.
  }

  public async logOut({ auth }: HttpContextContract) {
    try {
      await auth.use('api').revoke()
      return {
        revoked: true
      }
    } catch (error) {
      console.error(error)
    }
  }

  public async store({ }: HttpContextContract) { }

  public async show({ }: HttpContextContract) { }

  public async edit({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
