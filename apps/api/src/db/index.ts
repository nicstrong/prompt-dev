import pg from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema.js'
import { env } from '~/env.js'

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
    client: pg.Client | undefined
}

export const client = globalForDb.client ?? new pg.Client(env.DATABASE_URL)
if (env.NODE_ENV !== 'production') globalForDb.client = client

export const db = drizzle(client, { schema })
