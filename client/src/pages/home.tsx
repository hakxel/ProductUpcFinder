import { useState } from "react";
import SearchSection from "@/components/search-section";
import LoadingState from "@/components/loading-state";
import ErrorState from "@/components/error-state";
import EmptyState from "@/components/empty-state";
import ProductCard from "@/components/product-card";
import { useUpcSearch } from "@/hooks/use-upc-search";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  
  const { mutate: searchProducts, data, isPending, error, reset } = useUpcSearch();

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    
    setSearchQuery(query);
    setHasSearched(true);
    searchProducts({ query: query.trim() });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setHasSearched(false);
    reset();
  };

  const handleRetrySearch = () => {
    if (searchQuery.trim()) {
      searchProducts({ query: searchQuery.trim() });
    }
  };

  const products = data?.products || [];

  return (
    <div className="py-6">
      <SearchSection onSearch={handleSearch} isLoading={isPending} />
      
      {isPending && <LoadingState />}
      
      {error && !isPending && (
        <ErrorState 
          message={error instanceof Error ? error.message : "Search failed. Please try again."}
          onRetry={handleRetrySearch}
        />
      )}
      
      {data && !isPending && products.length > 0 && (
        <section className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </h3>
            <Button 
              variant="ghost" 
              onClick={handleClearSearch}
              className="text-primary text-sm font-medium h-auto p-0"
            >
              Clear
            </Button>
          </div>
          
          <div className="space-y-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
      
      {data && !isPending && products.length === 0 && hasSearched && (
        <ErrorState 
          message="No products found matching your search. Try a different product name or check your spelling."
          onRetry={handleRetrySearch}
        />
      )}
      
      {!hasSearched && !isPending && <EmptyState />}
    </div>
  );
}
