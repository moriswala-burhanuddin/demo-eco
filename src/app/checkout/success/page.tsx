"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    // Pick up the last order from session storage so we don't expose ID in URL
    const lastOrder = sessionStorage.getItem("lastOrder");
    if (lastOrder) {
      setOrder(JSON.parse(lastOrder));
      // Optional: Clear it if you only want it shown once
      // sessionStorage.removeItem("lastOrder");
    }
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        
        <h2 className="text-3xl font-heading text-gray-900 mb-2">Order Successful!</h2>
        <p className="text-gray-500 mb-8">Thank you for your purchase.</p>
        
        {order ? (
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500">Order Number</span>
              <span className="text-sm font-bold text-gray-900">{order.order_number}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500">Date</span>
              <span className="text-sm font-bold text-gray-900">
                {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500">Total</span>
              <span className="text-sm font-bold text-gray-900">₹{order.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Confirmed
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-center border border-gray-100 text-gray-500 text-sm">
            We have emailed you the order details.
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/account/orders" className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-black hover:bg-gray-800 transition">
            View My Orders
          </Link>
          <Link href="/products" className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
