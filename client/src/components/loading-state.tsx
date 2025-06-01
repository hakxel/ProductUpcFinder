import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <section className="animate-fade-in">
      <Card className="rounded-2xl shadow-md mb-4">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <Loader2 className="animate-spin h-6 w-6 text-primary" />
            <span className="text-gray-600 dark:text-gray-400">Searching products...</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Loading Skeleton Cards */}
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="rounded-2xl shadow-md mb-4 animate-pulse">
          <CardContent className="p-4">
            <div className="flex space-x-4">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg w-16 h-16 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-1/2 mb-2"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-2/3"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
