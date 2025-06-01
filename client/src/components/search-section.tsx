import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface SearchSectionProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export default function SearchSection({ onSearch, isLoading }: SearchSectionProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <Card className="rounded-2xl shadow-md mb-6">
      <CardContent className="p-6">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Search Products</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-icons text-gray-400">search</span>
            </div>
            <Input
              type="text"
              placeholder="Enter product name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit"
            className="w-full py-3 rounded-xl font-medium transition-all hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !query.trim()}
          >
            <span className="flex items-center justify-center">
              <span className="material-icons mr-2">search</span>
              Search Products
            </span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
