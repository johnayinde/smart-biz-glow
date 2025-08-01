
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
  Bell,
  ChevronLeft,
  Menu
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  const navItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Invoices", icon: FileText, path: "/invoices" },
    { name: "Templates", icon: Layers, path: "/invoice-templates" },
    { name: "Clients", icon: Users, path: "/clients" },
    { name: "Payments", icon: Wallet, path: "/payments" },
    { name: "Analytics", icon: BarChart3, path: "/analytics" },
    { name: "Insights", icon: BrainCircuit, path: "/insights" },
  ];

  return (
    <>
      {isMobile && collapsed && (
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed left-4 top-4 z-50 lg:hidden" 
          onClick={toggleSidebar}
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}
      
      <div 
        className={cn(
          "transition-all duration-300 ease-in-out h-full flex flex-col bg-sidebar border-r",
          className,
          collapsed ? "w-0 -translate-x-full lg:w-16 lg:translate-x-0" : "w-64",
          isMobile && !collapsed ? "fixed z-40 h-full left-0 top-0 w-64" : ""
        )}
      >
        <div className="space-y-4 py-4 flex flex-col h-full">
          <div className="px-3 py-2 flex items-center justify-between">
            <div className={cn("flex items-center gap-2 px-2", collapsed && "lg:hidden")}>
              <Layers className="h-5 w-5 text-sidebar-primary" />
              <h2 className={cn("text-base font-semibold tracking-tight", collapsed && "lg:hidden")}>
                SmartInvoice
              </h2>
            </div>
            {!isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-auto h-8 w-8" 
                onClick={toggleSidebar}
              >
                <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
              </Button>
            )}
          </div>
          
          <div className="px-2">
            <div className="space-y-1">
              {navItems.map((item) => (
                <NavLink key={item.path} to={item.path} onClick={() => isMobile && setCollapsed(true)}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className={cn(
                        "w-full justify-start",
                        isActive && "bg-accent font-medium",
                        collapsed && "lg:justify-center lg:px-2"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4", !collapsed ? "mr-2" : "")} />
                      {!collapsed && <span>{item.name}</span>}
                    </Button>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
          
          <div className="mt-auto px-2 py-2">
            <div className="space-y-1">
              <NavLink to="/notifications">
                {({ isActive }) => (
                  <Button 
                    variant={isActive ? "secondary" : "ghost"} 
                    size="sm" 
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-accent font-medium",
                      collapsed && "lg:justify-center lg:px-2"
                    )}
                  >
                    <Bell className={cn("h-4 w-4", !collapsed ? "mr-2" : "")} />
                    {!collapsed && <span>Notifications</span>}
                  </Button>
                )}
              </NavLink>
              <NavLink to="/settings">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-accent font-medium",
                      collapsed && "lg:justify-center lg:px-2"
                    )}
                  >
                    <Settings className={cn("h-4 w-4", !collapsed ? "mr-2" : "")} />
                    {!collapsed && <span>Settings</span>}
                  </Button>
                )}
              </NavLink>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "w-full justify-start text-muted-foreground",
                  collapsed && "lg:justify-center lg:px-2"
                )}
              >
                <ExternalLink className={cn("h-4 w-4", !collapsed ? "mr-2" : "")} />
                {!collapsed && <span>Documentation</span>}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {isMobile && !collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  );
}
