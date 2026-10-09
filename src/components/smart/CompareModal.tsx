"use client";

import { useCompareStore } from "@/store/compareStore";
import { formatCurrency } from "@/lib/currency";
import { XIcon, CheckCircle2, ZapIcon, TrophyIcon, WalletIcon } from "lucide-react";

export function CompareModal() {
  const { compareList, isCompareModalOpen, closeCompareModal, removeFromCompare } = useCompareStore();

  if (!isCompareModalOpen) return null;

  // AI Suggestions Logic
  const calculateBestOverall = () => {
    // Combine rating (high is good) and price (low is good)
    return compareList.reduce((prev, curr) => {
      const prevScore = (Number(prev.rating) || 0) * 10 - (Number(prev.variants?.[0]?.selling_price) || 99999);
      const currScore = (Number(curr.rating) || 0) * 10 - (Number(curr.variants?.[0]?.selling_price) || 99999);
      return currScore > prevScore ? curr : prev;
    }, compareList[0]);
  };

  const calculateBestValue = () => {
    // Lowest total price
    return compareList.reduce((prev, curr) => {
      const prevPrice = Number(prev.variants?.[0]?.selling_price) || 99999;
      const currPrice = Number(curr.variants?.[0]?.selling_price) || 99999;
      return currPrice < prevPrice ? curr : prev;
    }, compareList[0]);
  };

  const calculateFastestDelivery = () => {
    // Lowest delivery days
    return compareList.reduce((prev, curr) => {
      const prevDays = prev.delivery_days || 99;
      const currDays = curr.delivery_days || 99;
      return currDays < prevDays ? curr : prev;
    }, compareList[0]);
  };

  const bestOverall = calculateBestOverall();
  const bestValue = calculateBestValue();
  const fastestDelivery = calculateFastestDelivery();

  const getMediaUrl = (url: string | null) => {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    return `item.variant_details.product_image${url}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-background border border-border shadow-2xl rounded-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50 bg-secondary/30">
          <h2 className="text-2xl font-heading uppercase tracking-widest">Compare Products</h2>
          <button onClick={closeCompareModal} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6 flex flex-col gap-8">
          
          {/* AI Suggestions (Top) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-campaign-accent/30 bg-campaign-primary/5 shadow-sm relative overflow-hidden group hover:bg-campaign-primary/10 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <TrophyIcon className="w-5 h-5 text-campaign-primary" />
                <span className="font-bold uppercase text-xs tracking-widest text-campaign-primary">Best Overall</span>
              </div>
              <p className="font-medium text-foreground truncate">{bestOverall?.name}</p>
              <p className="text-xs text-muted-foreground mt-1">Best balance of rating & value</p>
            </div>
            
            <div className="p-4 rounded-xl border border-border/50 bg-secondary/30 shadow-sm relative overflow-hidden group hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <WalletIcon className="w-5 h-5 text-green-500" />
                <span className="font-bold uppercase text-xs tracking-widest text-green-500">Best Value</span>
              </div>
              <p className="font-medium text-foreground truncate">{bestValue?.name}</p>
              <p className="text-xs text-muted-foreground mt-1">Lowest total cost</p>
            </div>

            <div className="p-4 rounded-xl border border-border/50 bg-secondary/30 shadow-sm relative overflow-hidden group hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <ZapIcon className="w-5 h-5 text-yellow-500" />
                <span className="font-bold uppercase text-xs tracking-widest text-yellow-500">Fastest Delivery</span>
              </div>
              <p className="font-medium text-foreground truncate">{fastestDelivery?.name}</p>
              <p className="text-xs text-muted-foreground mt-1">Arrives in {fastestDelivery?.delivery_days} days</p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-4 min-w-[120px] bg-secondary/20 font-bold uppercase text-xs tracking-widest text-muted-foreground border-b border-border">Features</th>
                  {compareList.map(product => (
                    <th key={product.id} className="p-4 min-w-[200px] border-b border-border bg-background align-top">
                      <div className="relative group">
                        <div className="w-full aspect-square bg-secondary rounded-lg overflow-hidden mb-3">
                          <img 
                            src={getMediaUrl(product.media?.[0]?.webp_url || product.media?.[0]?.original_url)} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-bold text-sm leading-tight truncate">{product.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 truncate">{product.brand?.name || 'Burhani'}</p>
                        
                        <button
                          onClick={() => {
                            removeFromCompare(product.id);
                            if (compareList.length <= 2) closeCompareModal();
                          }}
                          className="absolute -top-2 -right-2 bg-background border border-border rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr>
                  <td className="p-4 border-b border-border/50 bg-secondary/10 font-medium">Price</td>
                  {compareList.map(product => (
                    <td key={product.id} className="p-4 border-b border-border/50 font-bold text-foreground">
                      {formatCurrency(product.variants?.[0]?.selling_price || "0")}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 border-b border-border/50 bg-secondary/10 font-medium">Rating</td>
                  {compareList.map(product => (
                    <td key={product.id} className="p-4 border-b border-border/50 flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span> 
                      <span className="font-medium">{product.rating || "N/A"}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 border-b border-border/50 bg-secondary/10 font-medium">Material</td>
                  {compareList.map(product => (
                    <td key={product.id} className="p-4 border-b border-border/50 text-muted-foreground">
                      {product.material || "N/A"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 border-b border-border/50 bg-secondary/10 font-medium">Delivery</td>
                  {compareList.map(product => (
                    <td key={product.id} className="p-4 border-b border-border/50 text-muted-foreground">
                      {product.delivery_days ? `${product.delivery_days} days` : "N/A"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 border-b border-border/50 bg-secondary/10 font-medium">Warranty</td>
                  {compareList.map(product => (
                    <td key={product.id} className="p-4 border-b border-border/50 text-muted-foreground">
                      {product.warranty_years ? `${product.warranty_years} yr` : "N/A"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    </div>
  );
}
