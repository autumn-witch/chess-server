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

  public async logIn({ auth, request }: HttpContextContract): Promise<OpaqueTokenContract<any>> {
    const username = request.input('username')
    const password = request.input('password')
    return auth.use('api').attempt(username, password)
  }

  public async store({ }: HttpContextContract) { }

  public async show({ }: HttpContextContract) { }

  public async edit({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
