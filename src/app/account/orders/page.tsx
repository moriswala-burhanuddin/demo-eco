"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { OrderCard } from "@/components/orders/OrderCard";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Loader2, PackageX } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/");
      setOrders(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "ALL") return true;
    if (filter === "PROCESSING") return ["PENDING", "CONFIRMED", "PROCESSING", "PACKED"].includes(order.status);
    if (filter === "SHIPPED") return ["SHIPPED", "OUT_FOR_DELIVERY"].includes(order.status);
    if (filter === "DELIVERED") return order.status === "DELIVERED";
    if (filter === "CANCELLED") return order.status === "CANCELLED";
    return true;
  });

  if (loading) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full blur-xl bg-black/5 animate-pulse"></div>
          <Loader2 className="h-10 w-10 animate-spin text-black relative z-10" />
        </div>
        <p className="text-sm font-bold tracking-widest uppercase text-gray-400 animate-pulse">Loading Orders</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="font-heading text-4xl mb-2">Order History</h1>
          <p className="text-sm text-gray-500">View and manage your past purchases.</p>
        </div>
        
        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 no-scrollbar gap-2 hide-scrollbar">
          {["ALL", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all duration-300 ${
                filter === f
                  ? "bg-black text-white shadow-lg shadow-black/20 scale-[1.02]"
                  : "bg-gray-50 text-gray-500 border border-transparent hover:bg-gray-100 hover:text-black"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-24 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200 shadow-sm flex flex-col items-center justify-center gap-4">
          <div className="h-20 w-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
            <PackageX size={32} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 font-heading">No orders found</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            {filter === "ALL" 
              ? "You haven't placed any orders yet. Start exploring our collections."
              : `You don't have any orders with the status '${filter}'.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order, idx) => (
            <div key={order.id} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms` }}>
              <OrderCard order={order} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
