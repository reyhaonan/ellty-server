import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  numeric,
  pgEnum,
  foreignKey,
  index,
} from "drizzle-orm/pg-core";

export const operationEnum = pgEnum("operation_type", [
  "add",
  "sub",
  "mul",
  "div",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const threads = pgTable(
  "threads",
  {
    id: serial("id").primaryKey(),
    creatorId: integer("creator_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    startingNumber: numeric("starting_number", {
      precision: 30,
      scale: 4,
    }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("threads_creator_idx").on(table.creatorId)]
);

export const messages = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),

    parentMessageId: integer("parent_message_id"),

    threadId: integer("thread_id")
      .references(() => threads.id, { onDelete: "cascade" })
      .notNull(),

    authorId: integer("author_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    operation: operationEnum("operation").notNull(),

    operand: numeric("operand", { precision: 30, scale: 4 }).notNull(),

    resultNumber: numeric("result_number", {
      precision: 30,
      scale: 4,
    }).notNull(),

    depth: integer("depth").notNull().default(0),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.parentMessageId],
      foreignColumns: [table.id],
      name: "fk_parent_message",
    }),
    index("messages_thread_idx").on(table.threadId),
    index("messages_parent_idx").on(table.parentMessageId),
    index("messages_author_idx").on(table.authorId),
    index("messages_thread_parent_idx").on(
      table.threadId,
      table.parentMessageId
    ),
  ]
);
