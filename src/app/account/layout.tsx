"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Package, MapPin, RefreshCcw, Settings, User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function AccountLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const navItems = [
    { href: "/account/orders", label: "Order History", icon: Package },
    { href: "/account/addresses", label: "Saved Addresses", icon: MapPin },
    { href: "/account/returns", label: "Returns & Exchanges", icon: RefreshCcw },
    { href: "/account/settings", label: "Account Settings", icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 md:px-8 flex flex-col lg:flex-row gap-10 min-h-[80vh] relative">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-gray-50 to-transparent -z-10 rounded-3xl" />
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 shrink-0">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 sticky top-24">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100/80">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-white shadow-lg shadow-black/20">
              <User size={24} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-1">Welcome back,</p>
              <h2 className="font-heading text-xl font-bold truncate max-w-[150px] text-gray-900">
                {user?.first_name || 'User'}
              </h2>
            </div>
          </div>
          
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm tracking-wide group ${
                    isActive 
                      ? "bg-black text-white shadow-xl shadow-black/10 scale-[1.02]" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-black"
                  }`}
                >
                  <Icon size={18} className={`transition-transform duration-300 ${isActive ? "text-white" : "text-gray-400 group-hover:scale-110 group-hover:text-black"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 min-h-[600px]">
        {children}
      </main>
    </div>
  );
}
