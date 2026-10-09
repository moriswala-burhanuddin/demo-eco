"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, Sparkles, Settings } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/hq-panel', icon: LayoutDashboard },
  { name: 'Orders', href: '/hq-panel/orders', icon: ShoppingCart },
  { name: 'Products', href: '/hq-panel/products', icon: Package },
  { name: 'Customers', href: '/hq-panel/customers', icon: Users },
  { name: 'Offers', href: '/hq-panel/offers', icon: Tag },
  { name: 'Campaigns', href: '/hq-panel/campaigns', icon: Sparkles },
];

export function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <nav className="mt-8 flex flex-col gap-2 px-4 flex-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/hq-panel' && pathname.startsWith(item.href));
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-medium ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <Icon size={22} className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'} />
            <span className="text-[15px]">{item.name}</span>
          </Link>
        );
      })}

      <div className="mt-auto pb-4 pt-8">
        <Link
          href="/hq-panel/settings"
          className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-medium ${
            pathname.startsWith('/hq-panel/settings')
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          <Settings size={22} />
          <span className="text-[15px]">Settings</span>
        </Link>
      </div>
    </nav>
  );
}