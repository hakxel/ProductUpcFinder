import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp, Copy, ImageIcon } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const handleCopyUpc = async () => {
    try {
      await navigator.clipboard.writeText(product.upc);
      toast({
        title: "UPC Copied!",
        description: "UPC code copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy UPC to clipboard",
        variant: "destructive",
      });
    }
  };

  const toggleDetails = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="rounded-2xl shadow-md animate-slide-up hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex space-x-4">
          {/* Product Image with Fallback */}
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          
          <div className={`w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 ${product.image ? 'hidden' : ''}`}>
            <ImageIcon className="w-6 h-6 text-gray-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">{product.title}</h4>
            {product.brand && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{product.brand}</p>
            )}
            {product.category && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{product.category}</p>
            )}
            
            {/* UPC Display */}
            <div className="mt-2 flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs font-medium text-primary bg-blue-50 dark:bg-blue-900/20">
                UPC
              </Badge>
              <span className="font-roboto-mono text-sm font-medium">{product.upc}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyUpc}
                className="h-auto p-1 text-gray-400 hover:text-primary"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Expandable Details */}
        {(product.description || product.size) && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="ghost"
              onClick={toggleDetails}
              className="flex items-center justify-between w-full text-left h-auto p-0"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Details</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400 transition-transform" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400 transition-transform" />
              )}
            </Button>
            
            {isExpanded && (
              <div className="mt-3 space-y-2 animate-slide-up">
                {product.description && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Description:</span>
                    <span className="text-gray-800 dark:text-gray-200 ml-2">{product.description}</span>
                  </div>
                )}
                {product.size && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Size:</span>
                    <span className="text-gray-800 dark:text-gray-200 ml-2">{product.size}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
