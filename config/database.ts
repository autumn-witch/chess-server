/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from '@ioc:Adonis/Core/Env'
import type { DatabaseConfig } from '@ioc:Adonis/Lucid/Database'

const Url = require('url-parse');
const databaseUrl = new Url(Env.get('DATABASE_URL'))

const connection = Env.get('NODE_ENV') === 'production'
? {
	host: Env.get('DB_HOST', databaseUrl.hostname),
	port: Env.get('DB_PORT', databaseUrl.port),
	user: Env.get('DB_USER', databaseUrl.username),
	password: Env.get('DB_PASSWORD', databaseUrl.password),
	database: Env.get('DB_DATABASE', databaseUrl.pathname.substr(1)),
	ssl: {
		rejectUnauthorized: false
	}
}
: {
	host: Env.get('PG_HOST'),
	port: Env.get('PG_PORT'),
	user: Env.get('PG_USER'),
	password: Env.get('PG_PASSWORD', ''),
	database: Env.get('PG_DB_NAME'),
}

const databaseConfig: DatabaseConfig = {
  connection: Env.get('DB_CONNECTION'),
  connections: {
    pg: {
			client: 'pg',
      connection,
      migrations: {
        naturalSort: true,
      },
      healthCheck: false,
      debug: false,
    },
  },
}

export default databaseConfig
