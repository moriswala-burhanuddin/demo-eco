"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { SearchIcon as Search, PackageIcon as Package, UserIcon as User, ShoppingBagIcon as ShoppingBag, ArrowRightIcon as ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-background rounded-2xl shadow-2xl border border-border overflow-hidden"
          >
            <Command className="w-full h-full flex flex-col">
              <div className="flex items-center px-4 py-3 border-b border-border">
                <Search className="w-5 h-5 text-muted-foreground mr-3" />
                <Command.Input 
                  placeholder="What are you looking for?" 
                  className="flex-1 bg-transparent border-none outline-none text-foreground text-sm font-medium placeholder:text-muted-foreground placeholder:font-normal"
                />
              </div>

              <Command.List className="max-h-[60vh] overflow-y-auto p-2">
                <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                  No results found.
                </Command.Empty>

                <Command.Group heading="Suggestions" className="text-xs font-semibold text-muted-foreground px-2 py-2 uppercase tracking-widest">
                  <Command.Item 
                    onSelect={() => runCommand(() => router.push('/products'))}
                    className="flex items-center px-3 py-3 mt-1 rounded-lg text-sm text-foreground hover:bg-secondary cursor-pointer data-[selected=true]:bg-secondary data-[selected=true]:text-primary transition-colors"
                  >
                    <Package className="w-4 h-4 mr-3" />
                    View All Products
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => router.push('/products?category=men'))}
                    className="flex items-center px-3 py-3 mt-1 rounded-lg text-sm text-foreground hover:bg-secondary cursor-pointer data-[selected=true]:bg-secondary data-[selected=true]:text-primary transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 mr-3 text-muted-foreground" />
                    Shop Men's
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => router.push('/products?category=women'))}
                    className="flex items-center px-3 py-3 mt-1 rounded-lg text-sm text-foreground hover:bg-secondary cursor-pointer data-[selected=true]:bg-secondary data-[selected=true]:text-primary transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 mr-3 text-muted-foreground" />
                    Shop Women's
                  </Command.Item>
                </Command.Group>

                <Command.Separator className="h-px bg-border my-2 mx-2" />

                <Command.Group heading="Account" className="text-xs font-semibold text-muted-foreground px-2 py-2 uppercase tracking-widest">
                  <Command.Item 
                    onSelect={() => runCommand(() => router.push('/account'))}
                    className="flex items-center px-3 py-3 mt-1 rounded-lg text-sm text-foreground hover:bg-secondary cursor-pointer data-[selected=true]:bg-secondary data-[selected=true]:text-primary transition-colors"
                  >
                    <User className="w-4 h-4 mr-3" />
                    My Account
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => alert('Opening bag...'))}
                    className="flex items-center px-3 py-3 mt-1 rounded-lg text-sm text-foreground hover:bg-secondary cursor-pointer data-[selected=true]:bg-secondary data-[selected=true]:text-primary transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 mr-3" />
                    View Bag
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
