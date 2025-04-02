import pg from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema.js'
import { env } from '~/env.js'

const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
})
export const db = drizzle({ schema, client: pool })
