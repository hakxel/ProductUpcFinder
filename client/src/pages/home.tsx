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
        <section className="animate-fade-in">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-yellow-600 text-2xl">search_off</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Products Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-sm mx-auto">
              We couldn't find any products matching "{searchQuery}". Try adjusting your search terms.
            </p>
            <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <p>Try searching for:</p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Brand name</span>
                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Product type</span>
                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Model number</span>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {!hasSearched && !isPending && <EmptyState />}
    </div>
  );
}
