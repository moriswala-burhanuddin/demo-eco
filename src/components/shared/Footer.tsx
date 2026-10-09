import Link from "next/link";
import { GlobeIcon as Globe, SendIcon as Send, MailIcon as Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-auto">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h3 className="font-heading text-3xl md:text-4xl tracking-tight mb-2">Join the Club</h3>
            <p className="text-sm text-gray-400 max-w-md">
              Get early access to new drops, exclusive offers, and style tips delivered straight to your inbox.
            </p>
          </div>
          <div className="flex w-full md:w-auto gap-0">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="bg-white/10 border border-white/20 px-4 py-3 text-sm w-full md:w-72 placeholder:text-gray-500 focus:outline-none focus:border-white/40 transition-colors"
            />
            <button className="bg-white text-black px-6 py-3 text-sm font-semibold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors cursor-pointer whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-heading text-2xl tracking-[0.3em] uppercase block mb-4 cursor-pointer hover:opacity-70 transition-opacity">BURHANI</Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Modern fashion for the conscious generation. Premium quality, accessible style.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer"><Globe className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer"><Send className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer"><Mail className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest mb-4">Shop</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/products?category=new" className="hover:text-white transition-colors cursor-pointer">New Arrivals</Link></li>
              <li><Link href="/products?category=men" className="hover:text-white transition-colors cursor-pointer">Men</Link></li>
              <li><Link href="/products?category=women" className="hover:text-white transition-colors cursor-pointer">Women</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors cursor-pointer">All Products</Link></li>
              <li><Link href="/products?sale=true" className="hover:text-white transition-colors cursor-pointer text-primary">Sale</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest mb-4">Help</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/contact" className="hover:text-white transition-colors cursor-pointer">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors cursor-pointer">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors cursor-pointer">Returns & Exchanges</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors cursor-pointer">FAQ</Link></li>
              <li><Link href="/size-guide" className="hover:text-white transition-colors cursor-pointer">Size Guide</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors cursor-pointer">About Us</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors cursor-pointer">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors cursor-pointer">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 Burhani. All rights reserved.</p>
          <div className="flex gap-4">
            <span>🇮🇳 India (INR ₹)</span>
            <span>·</span>
            <span>English</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
