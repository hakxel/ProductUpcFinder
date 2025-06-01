import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  upc: text("upc").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  brand: text("brand"),
  category: text("category"),
  size: text("size"),
  image: text("image"),
  searchedAt: timestamp("searched_at").defaultNow(),
});

export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  resultCount: integer("result_count").notNull().default(0),
  searchedAt: timestamp("searched_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  searchedAt: true,
});

export const insertSearchHistorySchema = createInsertSchema(searchHistory).omit({
  id: true,
  searchedAt: true,
}).extend({
  resultCount: z.number().default(0),
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertSearchHistory = z.infer<typeof insertSearchHistorySchema>;
export type SearchHistory = typeof searchHistory.$inferSelect;

// UPC API Response types - more flexible to handle various API response formats
export const upcApiResponseSchema = z.object({
  code: z.union([z.string(), z.number()]).optional(),
  total: z.number().optional(),
  offset: z.number().optional(),
  items: z.array(z.object({
    ean: z.union([z.string(), z.number()]).transform(String),
    title: z.string(),
    description: z.union([z.string(), z.number(), z.null()]).optional().transform(val => val ? String(val) : undefined),
    upc: z.union([z.string(), z.number()]).transform(String),
    brand: z.union([z.string(), z.number(), z.null()]).optional().transform(val => val ? String(val) : undefined),
    model: z.union([z.string(), z.number(), z.null()]).optional().transform(val => val ? String(val) : undefined),
    color: z.union([z.string(), z.number(), z.null()]).optional().transform(val => val ? String(val) : undefined),
    size: z.union([z.string(), z.number(), z.null()]).optional().transform(val => val ? String(val) : undefined),
    dimension: z.union([z.string(), z.number(), z.null()]).optional().transform(val => val ? String(val) : undefined),
    weight: z.union([z.string(), z.number(), z.null()]).optional().transform(val => val ? String(val) : undefined),
    category: z.union([z.string(), z.number(), z.null()]).optional().transform(val => val ? String(val) : undefined),
    currency: z.union([z.string(), z.number(), z.null()]).optional().transform(val => val ? String(val) : undefined),
    lowest_recorded_price: z.number().optional(),
    highest_recorded_price: z.number().optional(),
    images: z.array(z.string()).optional(),
    offers: z.array(z.any()).optional(), // Make offers more flexible
  })).optional().default([]),
});

export type UpcApiResponse = z.infer<typeof upcApiResponseSchema>;
