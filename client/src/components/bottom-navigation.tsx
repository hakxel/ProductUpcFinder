import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: "search", label: "Search" },
  { path: "/history", icon: "history", label: "History" },
  { path: "/settings", icon: "settings", label: "Settings" },
];

export default function BottomNavigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-pb z-40">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location === item.path;
            
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex flex-col items-center py-2 px-4 h-auto space-y-1",
                    isActive ? "text-primary" : "text-gray-400"
                  )}
                >
                  <span className="material-icons text-xl">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
