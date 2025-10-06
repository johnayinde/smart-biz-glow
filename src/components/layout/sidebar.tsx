import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  FileText,
  Home,
  Layers,
  Users,
  Wallet,
  Settings,
  BrainCircuit,
  Bell,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
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

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar border-r">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div
          className={cn(
            "flex items-center gap-2",
            collapsed && !isMobile && "hidden"
          )}
        >
          <Layers className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold">SmartInvoice</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={toggleSidebar}
        >
          {isMobile ? (
            <X className="h-4 w-4" />
          ) : (
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          )}
        </Button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto p-3">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setMobileOpen(false)}
            >
              {({ isActive }) => (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start h-16 text-base",
                    isActive && "bg-accent font-medium",
                    collapsed && !isMobile && "justify-center px-2"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5",
                      !collapsed || isMobile ? "mr-3" : ""
                    )}
                  />
                  {(!collapsed || isMobile) && <span>{item.name}</span>}
                </Button>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t space-y-2">
        <NavLink to="/notifications">
          {({ isActive }) => (
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-11 text-base",
                isActive && "bg-accent font-medium",
                collapsed && !isMobile && "justify-center px-2"
              )}
              onClick={() => isMobile && setMobileOpen(false)}
            >
              <Bell
                className={cn("h-5 w-5", !collapsed || isMobile ? "mr-3" : "")}
              />
              {(!collapsed || isMobile) && <span>Notifications</span>}
            </Button>
          )}
        </NavLink>
        <NavLink to="/settings">
          {({ isActive }) => (
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-11 text-base",
                isActive && "bg-accent font-medium",
                collapsed && !isMobile && "justify-center px-2"
              )}
              onClick={() => isMobile && setMobileOpen(false)}
            >
              <Settings
                className={cn("h-5 w-5", !collapsed || isMobile ? "mr-3" : "")}
              />
              {(!collapsed || isMobile) && <span>Settings</span>}
            </Button>
          )}
        </NavLink>
      </div>
    </div>
  );

  // Mobile: Show menu button + overlay sidebar
  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        {!mobileOpen && (
          <Button
            variant="outline"
            size="icon"
            className="fixed left-4 top-4 z-50 md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}

        {/* Mobile Sidebar Overlay */}
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileOpen(false)}
            />

            {/* Sidebar */}
            <div className="fixed left-0 top-0 bottom-0 w-64 z-50">
              {sidebarContent}
            </div>
          </>
        )}
      </>
    );
  }

  // Desktop: Normal sidebar
  return (
    <div
      className={cn(
        "transition-all duration-300 ease-in-out h-screen",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {sidebarContent}
    </div>
  );
}
