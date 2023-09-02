import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Post requests to /users', async (group) => {
  group.setup(async () => {
    await Database.rawQuery('truncate table users restart identity');
  })

  group.teardown(async () => {
    await Database.rawQuery('truncate table users restart identity');
  })

  test('bad username returns status 400', async ({ assert, client }) => {
    const userPayload = {
      username: '',
      email: 'test@gmail.com',
      password: '123',
      passwordConfirmation: '123'
    }
    const response = await client.post('/users').form(userPayload)
    assert.equal(response.status(), 400)
  })

  test('existing username returns status 400', async ({ assert, client }) => {
    const userPayload = {
      username: 'exists',
      email: 'test@gmail.com',
      password: '123',
      passwordConfirmation: '123'
    }
    await client.post('/users').form(userPayload);
    const response = await client.post('/users').form(userPayload);
    assert.equal(response.status(), 400)
  })

  test('bad email returns status 400', async ({ assert, client }) => {
    const userPayload = {
      username: 'Test',
      email: '',
      password: '123',
      passwordConfirmation: '123'
    }
    const response = await client.post('/users').form(userPayload)
    assert.equal(response.status(), 400)
  })

  test('password different from the confirmation returns status 400', async ({ assert, client }) => {
    const userPayload = {
      username: 'Test',
      email: 'test@gmail.com',
      password: '123',
      passwordConfirmation: '12'
    }
    const response = await client.post('/users').form(userPayload)
    assert.equal(response.status(), 400)
  })

  test('correct payload returns status 200', async ({ assert, client }) => {
    const userPayload = {
      username: 'mae',
      email: 'test@gmail.com',
      password: '123',
      passwordConfirmation: '123'
    }
    await Database.rawQuery('select * from users');
    const response = await client.post('/users').form(userPayload);
    assert.equal(response.status(), 200);
  })
})
