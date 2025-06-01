import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface SearchHistoryItem {
  id: number;
  query: string;
  resultCount: number;
  searchedAt: string;
}

export default function History() {
  const [, setLocation] = useLocation();
  
  const { data: historyData, isLoading } = useQuery<{ history: SearchHistoryItem[] }>({
    queryKey: ["/api/history"],
  });

  const handleSearchAgain = (query: string) => {
    // Navigate to home with search query
    setLocation(`/?q=${encodeURIComponent(query)}`);
  };

  if (isLoading) {
    return (
      <div className="py-6">
        <h2 className="text-xl font-medium text-gray-800 mb-6">Search History</h2>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-8 w-16 bg-gray-200 rounded ml-4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const history = historyData?.history || [];

  return (
    <div className="py-6">
      <h2 className="text-xl font-medium text-gray-800 mb-6">Search History</h2>
      
      {history.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Search History</h3>
            <p className="text-gray-600">Your recent searches will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{item.query}</h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600">
                        {item.resultCount} result{item.resultCount !== 1 ? 's' : ''}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(item.searchedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleSearchAgain(item.query)}
                    className="ml-4 flex-shrink-0"
                  >
                    Search Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
