import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, Package, Megaphone, Settings, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Applications", href: "/admin/applications", icon: Users },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
    { name: "Theme Settings", href: "/admin/theme", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-secondary/30 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-card border-r border-border shadow-2xl lg:shadow-none
        transform transition-transform duration-300 ease-in-out
        flex flex-col
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-6 flex items-center justify-between border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <Package size={20} className="stroke-[2.5]" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-foreground">Admin<span className="text-primary">Pro</span></h1>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </Button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location === item.href || (location.startsWith(item.href) && item.href !== '/admin');
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href} className={`admin-sidebar-item ${isActive ? "active" : ""}`}>
                <Icon size={20} className={isActive ? "text-primary-foreground" : "text-muted-foreground"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="bg-secondary rounded-xl p-4 text-sm">
            <p className="font-semibold text-foreground">Logged in as</p>
            <p className="text-muted-foreground truncate">admin@example.com</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-card/80 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-6 lg:px-10 shrink-0 z-30 sticky top-0">
          <div className="flex items-center gap-4 lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </Button>
            <h2 className="text-lg font-bold">AdminPanel</h2>
          </div>
          <div className="hidden lg:block">
            <h2 className="text-xl font-bold text-foreground">
              {navigation.find(n => n.href === location)?.name || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="rounded-full px-6 shadow-sm">View Website</Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-slate-50/50 p-4 md:p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
