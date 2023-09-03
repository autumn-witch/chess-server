import { test } from "@japa/runner";
import User from "../../app/Models/User";
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Sign in', async (group) => {
	group.setup(async () => {
		// await Database.rawQuery('truncate table users restart identity cascade');
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
		// todo refactor those using response.assertStatusCode
		assert.equal(response.status(), 400);
	})

	test('using correct credentials returns status 200 and the token', async ({ assert, client }) => {
		const userPayload = {
			username: 'mae',
			password: '123'
		}
		const response = await client.post('login').form(userPayload);
		assert.equal(response.status(), 200);
		response.assertBodyContains({
			type: 'bearer'
		});

		const req = client.post('logout');
		req.header('Authorization', `Bearer ${response.body().token}`)
	})
})

test.group('Sign out', (group) => {
	group.setup(async () => {
		await Database.rawQuery('truncate table users restart identity cascade');
		const userPayload = {
			username: 'mae',
			email: 'test@gmail.com',
			password: '123'
		}
		await User.create(userPayload);
	})

	test('logging out deletes the token', async ({ assert, client }) => {
		const { id, username, email } = (await User.findBy('username', 'mae'))!;
		const response = await client.post('login').form({ username, email, password: '123' });

		const request = client.post('logout');
		request.bearerToken(response.body().token);
		await request;

		const newTokens = await Database.from('api_tokens').select('*').where('user_id', id);
		const tokenWasDeleted = newTokens.length === 0;
		assert.equal(tokenWasDeleted, true);
	})
})