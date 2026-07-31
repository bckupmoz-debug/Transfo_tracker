import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'

export const gaps = pgTable('gaps', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  region: text('region').notNull(),
  country: text('country').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})