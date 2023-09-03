import { test } from "@japa/runner";
import User from "../../app/Models/User";
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Sign in', async (group) => {
	group.setup(async () => {
		await Database.rawQuery('truncate table users restart identity cascade');
		const userPayload = {
			username: 'mae',
			email: 'test@gmail.com',
			password: '123'
		}
		await User.create(userPayload);
	})

	group.teardown(async () => {
		await Database.rawQuery('truncate table users restart identity cascade');
	})

	test('using wrong credentials returns 400', async ({ assert, client }) => {
		const userPayload = {
			username: 'mae',
			password: '12'
		}
		const response = await client.post('/login').form(userPayload);
		assert.equal(response.status(), 400);
	})

	test('using correct credentials returns 200', async ({ assert, client }) => {
		const userPayload = {
			username: 'mae',
			password: '123'
		}
		const response = await client.post('login').form(userPayload);
		assert.equal(response.status(), 200);
		// todo: disconnect
	})

	test('using correct credentials returns the token', async ({ client }) => {
		const userPayload = {
			username: 'mae',
			password: '123'
		}
		const response = await client.post('login').form(userPayload);
		response.assertBodyContains({
			type: 'bearer'
		});
	})
})