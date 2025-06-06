import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { upcApiResponseSchema } from "@shared/schema";

const UPC_API_KEY =
  process.env.UPC_API_KEY || process.env.VITE_UPC_API_KEY || "";
const UPC_API_BASE = "https://api.upcitemdb.com/prod/trial/search";

export async function registerRoutes(app: Express): Promise<Server> {
  // Search products by name
  app.post("/api/search", async (req, res) => {
    try {
      const { query } = z.object({ query: z.string().min(1) }).parse(req.body);

      // First check local storage
      const localResults = await storage.searchProductsByTitle(query);

      // If we have local results, return them
      if (localResults.length > 0) {
        await storage.createSearchHistory({
          query,
          resultCount: localResults.length,
        });
        return res.json({ products: localResults });
      }

      // Search external UPC API
      const searchUrl = `${UPC_API_BASE}?s=${encodeURIComponent(query)}&match=1&type=product`;
      const headers: Record<string, string> = {
        "User-Agent": "UPC-Finder-App/1.0",
      };

      if (UPC_API_KEY) {
        headers["Authorization"] = `Bearer ${UPC_API_KEY}`;
      }

      const response = await fetch(searchUrl, { headers });

      if (!response.ok) {
        if (response.status === 404) {
          // 404 means no products found, return empty results
          await storage.createSearchHistory({ query, resultCount: 0 });
          return res.json({ products: [] });
        }
        throw new Error(
          `UPC API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      let validatedData;
      try {
        validatedData = upcApiResponseSchema.parse(data);
      } catch (validationError) {
        console.error("API response validation failed:", validationError);
        // If API response format is unexpected, return empty results
        await storage.createSearchHistory({ query, resultCount: 0 });
        return res.json({ products: [] });
      }

      const products = [];

      // Save products to local storage and prepare response
      for (const item of validatedData.items || []) {
        const existingProduct = await storage.getProductByUpc(item.upc);

        if (!existingProduct) {
          const product = await storage.createProduct({
            upc: item.upc,
            title: item.title,
            description: item.description || null,
            brand: item.brand || null,
            category: item.category || null,
            size: item.size || null,
            image: item.images?.[0] || null,
          });
          products.push(product);
        } else {
          products.push(existingProduct);
        }
      }

      // Save search history
      await storage.createSearchHistory({
        query,
        resultCount: products.length,
      });

      res.json({ products });
    } catch (error) {
      console.error("Search error:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid request format",
          errors: error.errors,
        });
      }

      // Handle different types of API errors with user-friendly messages
      let userMessage = "Search failed. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("UPC API error: 400")) {
          userMessage =
            "Invalid search request. Please check your search terms and try again.";
        } else if (error.message.includes("UPC API error: 401")) {
          userMessage =
            "Authentication failed. Please contact support for assistance.";
        } else if (error.message.includes("UPC API error: 403")) {
          userMessage =
            "Access denied. Please contact support for assistance.";
        } else if (error.message.includes("UPC API error: 404")) {
          userMessage =
            "No products found for your search. Try a different product name.";
        } else if (error.message.includes("UPC API error: 429")) {
          userMessage =
            "Too many searches. Please wait a moment and try again.";
        } else if (error.message.includes("UPC API error: 500")) {
          userMessage =
            "The search service is temporarily unavailable. Please try again later.";
        } else if (
          error.message.includes("UPC API error: 502") ||
          error.message.includes("UPC API error: 503")
        ) {
          userMessage =
            "The search service is experiencing issues. Please try again in a few minutes.";
        } else if (error.message.includes("UPC API error: 504")) {
          userMessage = "Search request timed out. Please try again.";
        } else if (
          error.message.includes("fetch failed") ||
          error.message.includes("network") ||
          error.message.includes("ENOTFOUND") ||
          error.message.includes("ECONNREFUSED")
        ) {
          userMessage =
            "Network error. Please check your connection and try again.";
        } else if (error.message.includes("timeout")) {
          userMessage = "Request timed out. Please try again.";
        } else {
          userMessage = "An unexpected error occurred. Please try again later.";
        }
      }

      res.status(500).json({
        message: userMessage,
      });
    }
  });

  // Get search history
  app.get("/api/history", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const history = await storage.getRecentSearches(limit);
      res.json({ history });
    } catch (error) {
      console.error("History error:", error);
      res.status(500).json({ message: "Failed to fetch search history" });
    }
  });

  // Get product by ID
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ product });
    } catch (error) {
      console.error("Product fetch error:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
