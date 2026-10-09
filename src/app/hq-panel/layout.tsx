import Link from 'next/link';
import { Search, Bell } from 'lucide-react';
import { SidebarNavigation } from '@/components/hq/SidebarNavigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-secondary/30 flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-background border-r border-border flex flex-col flex-shrink-0 fixed inset-y-0 left-0 z-50">
        <div className="p-8 pb-4">
          <Link href="/hq-panel" className="text-3xl font-heading font-black tracking-tighter">
            Burhani<span className="text-primary">HQ</span>
          </Link>
        </div>
        
        <SidebarNavigation />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        {/* Top Header */}
        <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input 
                type="text" 
                placeholder="Search orders, products, or customers..." 
                className="w-full pl-12 pr-4 py-3 bg-secondary border border-border/50 rounded-2xl text-sm focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none shadow-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-8">
            <button className="text-muted-foreground hover:text-foreground transition-colors relative">
              <Bell size={24} />
              <span className="absolute 0 right-0 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background"></span>
            </button>
            <div className="flex items-center gap-4 pl-8 border-l border-border">
              <div className="text-right">
                <p className="font-bold text-sm leading-none">Admin User</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">Superuser</p>
              </div>
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-10 max-w-[1600px] w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
