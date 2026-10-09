"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { ReturnRequest } from "@/types/orders";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [orderId, setOrderId] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const response = await api.get("/returns/api/returns/");
        setReturns(response.data.results || response.data);
      } catch (error) {
        console.error("Failed to fetch returns", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReturns();
  }, []);

  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/returns/api/returns/", {
        order: orderId,
        reason: reason,
        items: [] 
      });
      alert("Return requested successfully!");
      const response = await api.get("/returns/api/returns/");
      setReturns(response.data.results || response.data);
      setOrderId("");
      setReason("");
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to submit return.");
    }
  };

  return (
    <div>
      <h1 className="font-heading text-4xl mb-12">Returns & Exchanges</h1>
      
      <div className="border border-border p-8 mb-16 bg-secondary">
          <h2 className="font-heading text-2xl mb-6">Request a Return</h2>
          <form onSubmit={handleSubmitReturn} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="orderId" className="text-xs uppercase tracking-widest font-semibold">Order ID</Label>
              <Input 
                id="orderId" 
                placeholder="e.g. 1" 
                className="rounded-none h-12 bg-background"
                value={orderId} 
                onChange={(e) => setOrderId(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-xs uppercase tracking-widest font-semibold">Reason for Return</Label>
              <Input 
                id="reason" 
                placeholder="Too small, damaged, etc." 
                className="rounded-none h-12 bg-background"
                value={reason} 
                onChange={(e) => setReason(e.target.value)} 
                required 
              />
            </div>
            <Button type="submit" className="rounded-none h-12 px-8 uppercase tracking-widest text-xs font-semibold">Submit Request</Button>
          </form>
      </div>

      <h2 className="font-heading text-3xl mb-6">Past Returns</h2>
      {loading ? (
        <div className="text-sm font-semibold uppercase tracking-widest text-muted-foreground animate-pulse">Loading returns...</div>
      ) : returns.length === 0 ? (
        <div className="border border-border p-12 text-center text-muted-foreground">
          <p className="uppercase tracking-widest text-xs font-semibold">No Past Returns Found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {returns.map((req) => (
            <div key={req.id} className="border border-border p-6 flex justify-between items-center bg-background">
                <div>
                  <p className="font-semibold text-lg mb-1">Return for Order #{req.order}</p>
                  <p className="text-sm text-muted-foreground">Reason: {req.reason}</p>
                  <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mt-3">
                    Requested on {new Date(req.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="px-4 py-2 border border-primary text-primary uppercase tracking-widest text-xs font-semibold">
                  {req.status}
                </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
