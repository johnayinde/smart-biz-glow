import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { Outlet, useLocation } from "react-router-dom";

export function MainLayout() {
  const location = useLocation();

  // Dynamically set page title based on route
  const getPageTitle = () => {
    const path = location.pathname;

    // Handle root/dashboard
    if (path === "/" || path === "/dashboard") return "Dashboard";

    // Handle specific routes
    const routeTitles: Record<string, string> = {
      "/invoices": "Invoices",
      "/clients": "Clients",
      "/payments": "Payments",
      "/analytics": "Analytics",
      "/insights": "Insights",
      "/settings": "Settings",
      "/notifications": "Notifications",
      "/subscription": "Subscription",
      "/templates": "Invoice Templates",
    };

    // Check if it's a detail page (contains ID)
    if (path.includes("/invoices/") && path !== "/invoices/new") {
      return "Invoice Details";
    }
    if (path.includes("/clients/")) {
      return "Client Details";
    }
    if (path === "/invoices/new") {
      return "Create Invoice";
    }

    // Return from map or capitalize first segment
    return (
      routeTitles[path] ||
      path.substring(1).charAt(0).toUpperCase() + path.slice(2)
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - hidden on mobile, shown on md+ */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar title={getPageTitle()} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            <div className="mx-auto max-w-full">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
