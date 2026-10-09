"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { SearchIcon as Search, ShoppingBagIcon as ShoppingBag, UserIcon as User, MenuIcon as Menu, XIcon as X, HeartIcon as Heart, ChevronDownIcon as ChevronDown } from 'lucide-react';

export function Header() {
  const { setIsOpen, items, fetchCart, cartId } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (cartId) {
      fetchCart();
    }
  }, [cartId, fetchCart]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className="bg-[#1a1a1a] px-3 pt-3 pb-3 transition-colors duration-500">
        <header className="max-w-[1600px] mx-auto flex items-stretch gap-2 h-14">
          
          {/* Left: Hamburger Pill */}
          <div className="bg-background rounded-full flex items-center justify-center w-14 shrink-0 cursor-pointer hover:bg-background/90 transition-colors"
               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5 text-foreground stroke-[2.5]" /> : <Menu className="w-5 h-5 text-foreground stroke-[2.5]" />}
          </div>

          {/* Center: Nav Links (Desktop) */}
          <nav className="hidden md:flex flex-1 bg-background rounded-full items-center justify-center gap-6 lg:gap-10 font-bold tracking-[0.15em] uppercase text-[13px] text-foreground">
            <Link href="/" className="hover:opacity-60 transition-opacity">Home</Link>
            <Link href="/products" className="hover:opacity-60 transition-opacity">Products</Link>
            <Link href="/collections" className="hover:opacity-60 transition-opacity flex items-center gap-1">Collections <ChevronDown className="w-3.5 h-3.5" /></Link>
            <Link href="/contact" className="hover:opacity-60 transition-opacity">Contact</Link>
          </nav>
          
          {/* Center: Brand Name (Mobile only) */}
          <Link href="/" className="md:hidden flex-1 bg-background rounded-full flex items-center justify-center font-heading text-xl tracking-[0.2em] uppercase text-foreground font-bold">
            BURHANI
          </Link>

          {/* Right: Search + Cart Pill */}
          <div className="bg-background rounded-full flex items-center gap-3 px-5 shrink-0">
            <Link href="/search" className="flex items-center gap-2 hover:opacity-60 transition-opacity">
              <Search className="w-[18px] h-[18px] text-foreground stroke-[2.5]" />
              <span className="hidden md:block font-bold tracking-[0.15em] uppercase text-[13px] text-foreground">Search</span>
            </Link>

            <button 
              onClick={() => setIsOpen(true)} 
              className="relative flex items-center hover:opacity-60 transition-opacity cursor-pointer"
            >
              <ShoppingBag className="w-[18px] h-[18px] text-foreground stroke-[2.5]" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-3 bg-primary text-primary-foreground w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </header>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[74px] z-[200] bg-background flex flex-col md:hidden border-t-4 border-primary">
          <nav className="flex flex-col p-6 gap-6 text-2xl font-heading uppercase tracking-wider text-foreground">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b-2 border-border">Home</Link>
            <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b-2 border-border">Products</Link>
            <Link href="/collections" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b-2 border-border">Collections</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b-2 border-border">Contact</Link>
          </nav>
          <div className="mt-auto p-6 border-t-4 border-primary space-y-4">
            {!isAuthenticated ? (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full bg-primary text-primary-foreground text-center py-4 font-bold uppercase tracking-widest text-sm rounded-full">
                Sign In / Register
              </Link>
            ) : (
              <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="block w-full bg-primary text-primary-foreground text-center py-4 font-bold uppercase tracking-widest text-sm rounded-full">
                My Account
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
