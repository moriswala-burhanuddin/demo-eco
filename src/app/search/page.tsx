"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon as Search, TrendingUpIcon as TrendingUp, ClockIcon as Clock, ArrowRightIcon as ArrowRight } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const trendingSearches = [
    "Oversized T-Shirts",
    "Black Hoodie",
    "Cotton Kurta",
    "Slim Fit Jeans",
    "White Shirt",
    "Summer Dress",
  ];

  const popularCategories = [
    { name: "New Arrivals", href: "/products?category=new" },
    { name: "T-Shirts", href: "/products?category=tshirts" },
    { name: "Hoodies", href: "/products?category=hoodies" },
    { name: "Shirts", href: "/products?category=shirts" },
    { name: "Pants", href: "/products?category=pants" },
    { name: "Dresses", href: "/products?category=dresses" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-20">
        {/* Search Header */}
        <h1 className="font-heading text-5xl md:text-6xl tracking-tight text-center mb-10">
          Search
        </h1>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="relative mb-16">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-14 pl-12 pr-4 text-base rounded-none border-2 border-foreground focus-visible:ring-0 focus-visible:border-primary" 
            placeholder="What are you looking for?"
            autoFocus
          />
        </form>

        {/* Trending Searches */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-widest">Trending Searches</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((term) => (
              <Link 
                key={term}
                href={`/products?search=${encodeURIComponent(term)}`}
                className="px-4 py-2 border border-border text-sm hover:border-foreground hover:bg-foreground hover:text-background transition-all cursor-pointer"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Categories */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <Clock className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-widest">Popular Categories</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {popularCategories.map((cat) => (
              <Link 
                key={cat.name}
                href={cat.href}
                className="group flex items-center justify-between p-4 border border-border hover:border-foreground transition-colors cursor-pointer"
              >
                <span className="text-sm font-medium">{cat.name}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
