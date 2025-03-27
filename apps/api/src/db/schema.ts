import { createId } from '@paralleldrive/cuid2'
import { sql } from 'drizzle-orm'
import {
  json,
  pgEnum,
  text,
  pgTableCreator,
  timestamp,
  foreignKey,
} from 'drizzle-orm/pg-core'

export const createTable = pgTableCreator((name) => `prompt-dev_${name}`)

export const rolesEnum = pgEnum('roles', ['system', 'user', 'assistant'])

export const threads = createTable('thread', {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  name: text().notNull(),
})

export const messages = createTable(
  'message',
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createId()),
    content: text(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
    role: rolesEnum().notNull(),
    parts: json()
      .notNull()
      .default(sql`'[]'`),
    threadId: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.threadId],
      foreignColumns: [threads.id],
      name: 'message_threads_fk',
    }),
  ],
)
