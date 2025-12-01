import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Sales data table for tracking daily supermarket performance.
 * Each row represents one day's sales data.
 */
export const salesData = mysqlTable("sales_data", {
  id: int("id").autoincrement().primaryKey(),
  /** Date of the sales record (stored as YYYY-MM-DD string) */
  date: varchar("date", { length: 10 }).notNull(),
  /** Total revenue for the day */
  totalSales: int("total_sales").notNull().default(0),
  /** Cost of goods sold */
  cogs: int("cogs").notNull().default(0),
  /** Other expenses (wages, utilities, rent, etc.) */
  expensesOther: int("expenses_other").notNull().default(0),
  /** Refunds or discounts (negative adjustments) */
  refundsOrDiscounts: int("refunds_or_discounts").notNull().default(0),
  /** Number of customers */
  customerCount: int("customer_count").notNull().default(0),
  /** Free text notes */
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type SalesData = typeof salesData.$inferSelect;
export type InsertSalesData = typeof salesData.$inferInsert;