"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { OrderItems } from "@/components/orders/OrderItems";
import { OrderPriceBreakdown } from "@/components/orders/OrderPriceBreakdown";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && id) {
      fetchOrderDetails();
    }
  }, [isAuthenticated, id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${id}/`);
      setOrder(res.data);
    } catch (err) {
      console.error("Failed to fetch order details", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-[40vh]">
        <h2 className="text-xl font-bold mb-4">Order not found</h2>
        <Link href="/account/orders" className="text-blue-600 hover:underline">Return to Order History</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/account/orders" className="inline-flex items-center text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Order History
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading text-gray-900 mb-1">Order #{order.order_number}</h1>
            <p className="text-gray-500">
              Placed on {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (Left) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Timeline */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h2 className="text-xs font-bold text-gray-900 tracking-widest uppercase mb-8">Status Timeline</h2>
            <OrderTimeline currentStatus={order.status} placedAt={order.created_at} />
          </div>

          {/* Items */}
          <OrderItems items={order.items} />

        </div>

        {/* Sidebar (Right) */}
        <div className="space-y-8">
          
          {/* Price Breakdown */}
          <OrderPriceBreakdown 
            subtotal={order.subtotal}
            discount={order.discount}
            couponDiscount={order.coupon_discount}
            tax={order.tax}
            shippingCost={order.shipping_cost}
            total={order.total}
          />

          {/* Address */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-xs font-bold tracking-widest text-gray-900 uppercase">Delivery Address</h3>
            </div>
            <div className="p-8">
              <p className="font-bold text-gray-900 mb-2">{order.shipping_name}</p>
              <p className="text-gray-500 text-sm whitespace-pre-wrap leading-relaxed">{order.shipping_address}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-xs font-bold tracking-widest text-gray-900 uppercase">Payment</h3>
            </div>
            <div className="p-8 text-sm">
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Payment Method</p>
                <p className="font-bold text-gray-900">{order.payment_method}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Amount Paid</p>
                <p className="font-black text-xl text-gray-900 tracking-tight">₹{parseFloat(order.total).toFixed(2)}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
