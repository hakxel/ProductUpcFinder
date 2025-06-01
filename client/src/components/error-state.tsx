import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <section className="animate-fade-in">
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Results Found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
          <Button onClick={onRetry} className="px-6 py-2 rounded-lg font-medium">
            Try Again
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
