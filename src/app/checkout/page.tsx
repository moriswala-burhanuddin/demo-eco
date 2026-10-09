"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { AppleIcon as Apple, CreditCard, Gift, ShieldCheck, TruckIcon, MapPin } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface Address {
  id: number;
  full_name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

export default function CheckoutPage() {
  const { items, total, fetchCart, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [orderBump, setOrderBump] = useState(false);
  const [mockStatus, setMockStatus] = useState<"success" | "fail">("success");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const SHIPPING_COST = total >= 150 ? 0 : 10;
  const DISCOUNT_AMOUNT = discountApplied ? total * 0.1 : 0; // 10% mock discount
  const BUMP_COST = orderBump ? 5.00 : 0;
  const FINAL_TOTAL = total + SHIPPING_COST - DISCOUNT_AMOUNT + BUMP_COST;

  useEffect(() => {
    fetchCart();
    if (isAuthenticated) {
      api.get("/customers/addresses/")
        .then((res) => {
          const addrs = res.data.results || res.data;
          setSavedAddresses(addrs);
          if (addrs.length > 0) {
            setSelectedAddressId(addrs[0].id);
          }
        })
        .catch(console.error);
    }
  }, [fetchCart, isAuthenticated]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const cartId = useCartStore.getState().cartId;
      if (!cartId) throw new Error("Cart is empty or not found.");

      const payload: any = {
        cart_id: cartId,
        payment_method: "CARD",
        mock_status: mockStatus
      };

      if (selectedAddressId) {
        payload.address_id = selectedAddressId;
      } else {
        payload.shipping_address = {
          address_line_1: address,
          city: city,
          postal_code: postalCode,
          country: "US"
        };
      }

      const res = await api.post("/orders/checkout/", payload);
      
      clearCart();
      if (res.data && res.data.order_number) {
        sessionStorage.setItem('lastOrder', JSON.stringify(res.data));
      }
      router.push("/checkout/success");
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data?.error || "Checkout failed. Payment was declined.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyDiscount = () => {
    if (discountCode.toUpperCase() === "SAVE10") {
      setDiscountApplied(true);
    } else {
      alert("Invalid discount code. Try 'SAVE10'.");
      setDiscountApplied(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-background">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6">
            <CreditCard className="w-10 h-10 text-muted-foreground" />
        </div>
        <p className="text-2xl mb-8 font-heading text-center">Your shopping bag is empty.</p>
        <Link href="/products">
          <Button size="lg" className="rounded-full px-12 font-bold tracking-widest uppercase shadow-xl hover:scale-105 transition-transform duration-300">
            Return to Shop
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 min-h-[80vh] bg-background">
      {/* Checkout Form - Left Side */}
      <div className="lg:col-span-7 xl:col-span-8">
        <h1 className="font-heading text-5xl mb-10 tracking-tight">Secure Checkout</h1>
        
        {/* Express Checkout */}
        <div className="mb-10 p-6 rounded-[2rem] border border-border/40 bg-secondary/30">
          <h2 className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Express Checkout</h2>
          <div className="flex gap-4">
            <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl bg-black text-white hover:bg-black/90 hover:text-white border-0">
               <Apple className="w-5 h-5 mr-2" /> Pay
            </Button>
            <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl bg-[#F0F0F0] text-black hover:bg-[#E0E0E0] border-0">
               <svg viewBox="0 0 48 48" className="w-10 h-5 mr-2"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path></svg> Pay
            </Button>
          </div>
          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
                <span className="bg-background px-4 text-muted-foreground uppercase tracking-widest font-bold">Or continue with Card</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleCheckout} className="space-y-10">
          {/* Shipping Address */}
          <div className="space-y-6">
            <h2 className="text-xl font-heading flex items-center gap-2 border-b border-border pb-4">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">1</span> 
                Shipping Address
            </h2>
            
            {savedAddresses.length > 0 && (
              <div className="grid gap-4 mb-6">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select Saved Address</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedAddresses.map((addr) => (
                    <div 
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-sm">{addr.full_name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{addr.line1}</p>
                          <p className="text-xs text-muted-foreground">{addr.city}, {addr.state} {addr.postal_code}</p>
                        </div>
                        {selectedAddressId === addr.id && <MapPin className="w-5 h-5 text-primary" />}
                      </div>
                    </div>
                  ))}
                  <div 
                    onClick={() => setSelectedAddressId(null)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-colors flex items-center justify-center ${selectedAddressId === null ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                  >
                    <p className="font-bold text-sm">Use a different address</p>
                  </div>
                </div>
              </div>
            )}

            {selectedAddressId === null && (
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Street Address</Label>
                  <Input id="address" className="rounded-xl h-14 bg-secondary/50 border-border/50 focus-visible:ring-primary" value={address} onChange={(e) => setAddress(e.target.value)} required={!selectedAddressId} placeholder="123 Main St" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">City</Label>
                    <Input id="city" className="rounded-xl h-14 bg-secondary/50 border-border/50 focus-visible:ring-primary" value={city} onChange={(e) => setCity(e.target.value)} required={!selectedAddressId} placeholder="New York" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Postal Code</Label>
                    <Input id="postalCode" className="rounded-xl h-14 bg-secondary/50 border-border/50 focus-visible:ring-primary" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required={!selectedAddressId} placeholder="10001" />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Payment Method */}
          <div className="space-y-6">
            <h2 className="text-xl font-heading flex items-center gap-2 border-b border-border pb-4">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">2</span> 
                Payment details
            </h2>
            <div className="p-8 bg-secondary/30 border border-border rounded-[2rem] flex flex-col items-center justify-center min-h-[200px]">
                <CreditCard className="w-10 h-10 text-muted-foreground/50 mb-4" />
                <p className="text-sm text-muted-foreground font-medium text-center max-w-sm">
                    This is a secure, encrypted payment gateway. In this demo, Stripe or Razorpay Elements would be mounted here.
                </p>
            </div>
          </div>

          {/* Order Bump */}
          <div className="p-6 rounded-2xl border-2 border-primary/20 bg-primary/5 flex items-start gap-4 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => setOrderBump(!orderBump)}>
            <div className={`w-6 h-6 rounded border flex items-center justify-center shrink-0 mt-0.5 ${orderBump ? 'bg-primary border-primary' : 'border-primary/50'}`}>
                {orderBump && <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </div>
            <div>
                <h4 className="font-bold text-sm flex items-center gap-2"><Gift className="w-4 h-4 text-primary" /> Add Premium Gift Packaging</h4>
                <p className="text-xs text-muted-foreground mt-1">Make your unboxing experience unforgettable with our signature eco-friendly gift box and personalized note. <span className="font-bold text-foreground">Only {formatCurrency(5)}</span></p>
            </div>
          </div>

          {error && <p className="text-destructive text-sm font-bold p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> {error}</p>}
          
          {/* Mock Payment Toggle */}
          <div className="p-4 rounded-xl border border-border/50 bg-secondary/30 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm">Simulate Payment</h4>
              <p className="text-xs text-muted-foreground">Test checkout flows before Razorpay integration</p>
            </div>
            <div className="flex bg-background border border-border/50 rounded-lg p-1">
              <button 
                type="button" 
                onClick={() => setMockStatus("success")}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${mockStatus === "success" ? "bg-emerald-100 text-emerald-700" : "text-muted-foreground hover:bg-secondary"}`}
              >
                Success
              </button>
              <button 
                type="button" 
                onClick={() => setMockStatus("fail")}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${mockStatus === "fail" ? "bg-destructive/10 text-destructive" : "text-muted-foreground hover:bg-secondary"}`}
              >
                Failure
              </button>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full rounded-full h-16 font-bold uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-transform duration-300" disabled={loading}>
            {loading ? "Processing Securely..." : `Pay ${formatCurrency(FINAL_TOTAL)}`}
          </Button>
          <p className="text-center text-[10px] text-muted-foreground font-semibold tracking-widest uppercase mt-4 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Payments are secure and encrypted.
          </p>
        </form>
      </div>
      
      {/* Order Summary - Right Side Sticky */}
      <div className="lg:col-span-5 xl:col-span-4 relative">
        <div className="sticky top-8 bg-secondary/40 p-8 rounded-[3rem] border border-border/50 shadow-2xl">
            <h2 className="font-heading text-3xl mb-8 border-b border-border/50 pb-6 flex items-center justify-between">
                Summary
                <span className="text-sm font-sans font-bold bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">{items.length}</span>
            </h2>
            
            {/* Items */}
            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto no-scrollbar pr-2">
            {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                    <Link href={`/products/${item.variant_details?.product_slug || ''}`} className="w-20 h-24 bg-background border border-border/50 rounded-xl flex items-center justify-center overflow-hidden relative shadow-sm group">
                        {item.variant_details?.product_image ? (
                            <img 
                            src={item.variant_details.product_image.startsWith('http') ? item.variant_details.product_image : `item.variant_details.product_image${item.variant_details.product_image}`}
                            alt={item.variant_details?.product_name || "Product image"} 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Img</span>
                        )}
                    </Link>
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <Link href={`/products/${item.variant_details?.product_slug || ''}`} className="font-bold text-sm leading-tight line-clamp-2 hover:text-primary transition-colors">
                                {item.variant_details?.product_name || 'Item'}
                            </Link>
                            <div className="flex gap-2 text-xs text-muted-foreground mt-1 font-medium">
                                <span>{item.variant_details?.size_name || 'Size'}</span> • <span>{item.variant_details?.color_name || 'Color'}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-medium bg-background px-2 py-1 rounded-md border border-border/50">Qty: {item.quantity}</span>
                            <span className="font-bold">{formatCurrency(item.price_at_addition || 0)}</span>
                        </div>
                    </div>
                </div>
            ))}
            </div>
            
            {/* Discount Code */}
            <div className="mb-8 pt-6 border-t border-border/50">
                <Label htmlFor="discount" className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block">Gift Card or Discount Code</Label>
                <div className="flex gap-2">
                    <Input 
                        id="discount" 
                        className="rounded-xl h-12 bg-background border-border/50" 
                        placeholder="Enter code (Try SAVE10)" 
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        disabled={discountApplied}
                    />
                    <Button 
                        type="button" 
                        variant={discountApplied ? "secondary" : "default"}
                        className="rounded-xl h-12 px-6 font-bold"
                        onClick={handleApplyDiscount}
                        disabled={!discountCode || discountApplied}
                    >
                        {discountApplied ? "Applied" : "Apply"}
                    </Button>
                </div>
                {discountApplied && (
                    <p className="text-xs text-primary font-bold mt-2 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        Code SAVE10 applied! 10% off.
                    </p>
                )}
            </div>

            {/* Calculations */}
            <div className="space-y-3 pt-6 border-t border-border/50 text-sm font-medium text-muted-foreground">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-foreground">{formatCurrency(total)}</span>
                </div>
                {discountApplied && (
                    <div className="flex justify-between text-primary font-bold">
                        <span>Discount (SAVE10)</span>
                        <span>-{formatCurrency(DISCOUNT_AMOUNT)}</span>
                    </div>
                )}
                {orderBump && (
                    <div className="flex justify-between">
                        <span>Premium Packaging</span>
                        <span className="text-foreground">{formatCurrency(BUMP_COST)}</span>
                    </div>
                )}
                <div className="flex justify-between">
                    <span className="flex items-center gap-1">Shipping <TruckIcon className="w-3 h-3"/></span>
                    {SHIPPING_COST === 0 ? (
                        <span className="text-primary font-bold uppercase tracking-widest text-[10px]">Free</span>
                    ) : (
                        <span className="text-foreground">{formatCurrency(SHIPPING_COST)}</span>
                    )}
                </div>
            </div>
            
            <div className="flex justify-between items-center font-bold text-3xl pt-6 mt-6 border-t border-border/50">
            <span className="font-heading">Total</span>
            <span>{formatCurrency(FINAL_TOTAL)}</span>
            </div>
        </div>
      </div>
    </div>
  );
}
