import {
  FileUIPart,
  ReasoningUIPart,
  SourceUIPart,
  StepStartUIPart,
  TextUIPart,
  ToolInvocationUIPart,
} from '@ai-sdk/ui-utils'
import { createId } from '@paralleldrive/cuid2'
import { Message } from 'ai'
import { desc, sql } from 'drizzle-orm'
import {
  json,
  pgEnum,
  text,
  pgTableCreator,
  timestamp,
  foreignKey,
  integer,
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
  userId: text().notNull(),
})

export type PartType =
  | TextUIPart
  | ReasoningUIPart
  | ToolInvocationUIPart
  | SourceUIPart
  | FileUIPart
  | StepStartUIPart

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
      .$type<PartType[]>()
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

export const providerEnum = pgEnum('providers', [
  'openai',
  'google',
  'anthropic',
  'grok',
])

export const models = createTable('model', {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text().notNull(),
  description: text().notNull(),
  shortDescription: text().notNull(),
  provider: providerEnum().notNull(),
  modelId: text().notNull(),
  order: integer().notNull().default(1),
})
