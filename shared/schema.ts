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
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertSearchHistory = z.infer<typeof insertSearchHistorySchema>;
export type SearchHistory = typeof searchHistory.$inferSelect;

// UPC API Response types
export const upcApiResponseSchema = z.object({
  code: z.string(),
  total: z.number(),
  offset: z.number(),
  items: z.array(z.object({
    ean: z.string(),
    title: z.string(),
    description: z.string().optional(),
    upc: z.string(),
    brand: z.string().optional(),
    model: z.string().optional(),
    color: z.string().optional(),
    size: z.string().optional(),
    dimension: z.string().optional(),
    weight: z.string().optional(),
    category: z.string().optional(),
    currency: z.string().optional(),
    lowest_recorded_price: z.number().optional(),
    highest_recorded_price: z.number().optional(),
    images: z.array(z.string()).optional(),
    offers: z.array(z.object({
      merchant: z.string(),
      domain: z.string(),
      title: z.string(),
      currency: z.string().optional(),
      list_price: z.string().optional(),
      price: z.number().optional(),
      shipping: z.string().optional(),
      condition: z.string().optional(),
      availability: z.string().optional(),
      link: z.string(),
      updated_t: z.number().optional(),
    })).optional(),
  })),
});

export type UpcApiResponse = z.infer<typeof upcApiResponseSchema>;
