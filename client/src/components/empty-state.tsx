import { Card, CardContent } from "@/components/ui/card";

export default function EmptyState() {
  return (
    <section className="py-12">
      <div className="text-center">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-icons text-primary text-3xl">qr_code_scanner</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Find Product UPC Codes</h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto mb-6">
          Search for any product by name to instantly get its UPC code along with detailed product information.
        </p>
        
        <Card className="rounded-xl max-w-sm mx-auto">
          <CardContent className="p-4 text-left">
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Try searching for:</h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• Coca-Cola Classic</li>
              <li>• iPhone 15 Pro</li>
              <li>• Nike Air Force 1</li>
              <li>• Cheerios Cereal</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
