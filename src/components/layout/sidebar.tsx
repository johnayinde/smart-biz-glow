
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  ExternalLink, 
  FileText, 
  Home, 
  Layers, 
  Users, 
  Wallet,
  Settings,
  BrainCircuit,
  Bell
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  
  const navItems = [
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "Invoices", icon: FileText, path: "/invoices" },
    { name: "Clients", icon: Users, path: "/clients" },
    { name: "Payments", icon: Wallet, path: "/payments" },
    { name: "Analytics", icon: BarChart3, path: "/analytics" },
    { name: "Insights", icon: BrainCircuit, path: "/insights" },
  ];

  return (
    <div className={cn("pb-12 h-full flex flex-col bg-sidebar border-r w-48", className)}>
      <div className="space-y-4 py-4 flex flex-col h-full">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 px-2">
            <Layers className="h-5 w-5 text-sidebar-primary" />
            <h2 className="text-base font-semibold tracking-tight">
              SmartInvoice
            </h2>
          </div>
        </div>
        
        <div className="px-2">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path}>
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-accent font-medium"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                )}
              </NavLink>
            ))}
          </div>
        </div>
        
        <div className="mt-auto px-2 py-2">
          <div className="space-y-1">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
            <NavLink to="/settings">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-accent font-medium"
                  )}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              )}
            </NavLink>
            <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
              <ExternalLink className="mr-2 h-4 w-4" />
              Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
