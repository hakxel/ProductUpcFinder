import { products, searchHistory, type Product, type InsertProduct, type SearchHistory, type InsertSearchHistory } from "@shared/schema";

export interface IStorage {
  // Product methods
  getProduct(id: number): Promise<Product | undefined>;
  getProductByUpc(upc: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  searchProductsByTitle(title: string): Promise<Product[]>;
  
  // Search history methods
  getSearchHistory(): Promise<SearchHistory[]>;
  createSearchHistory(search: InsertSearchHistory): Promise<SearchHistory>;
  getRecentSearches(limit?: number): Promise<SearchHistory[]>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private searchHistoryItems: Map<number, SearchHistory>;
  private currentProductId: number;
  private currentSearchId: number;

  constructor() {
    this.products = new Map();
    this.searchHistoryItems = new Map();
    this.currentProductId = 1;
    this.currentSearchId = 1;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductByUpc(upc: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.upc === upc,
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      id,
      searchedAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async searchProductsByTitle(title: string): Promise<Product[]> {
    const searchTerm = title.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) => 
        product.title.toLowerCase().includes(searchTerm) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerm))
    );
  }

  async getSearchHistory(): Promise<SearchHistory[]> {
    return Array.from(this.searchHistoryItems.values())
      .sort((a, b) => b.searchedAt!.getTime() - a.searchedAt!.getTime());
  }

  async createSearchHistory(insertSearch: InsertSearchHistory): Promise<SearchHistory> {
    const id = this.currentSearchId++;
    const search: SearchHistory = {
      ...insertSearch,
      id,
      searchedAt: new Date(),
    };
    this.searchHistoryItems.set(id, search);
    return search;
  }

  async getRecentSearches(limit: number = 10): Promise<SearchHistory[]> {
    const history = await this.getSearchHistory();
    return history.slice(0, limit);
  }
}

export const storage = new MemStorage();
