"use client";

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { formatCurrency } from '@/lib/currency';
import { OrderDetailsDrawer } from '@/components/hq/OrderDetailsDrawer';

interface Order {
  id: number;
  order_number: string;
  customer_details: {
    first_name: string;
    last_name: string;
    email: string;
  };
  status: string;
  total: string;
  created_at: string;
}

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/');
      setOrders(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'SHIPPED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'PROCESSING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'CANCELLED': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-secondary text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-heading font-black tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-2 font-medium">Manage fulfillments, track shipments, and view order details.</p>
        </div>
      </div>

      <div className="bg-background rounded-3xl shadow-sm border border-border/60 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/30 text-muted-foreground border-b border-border/60">
                <tr>
                  <th className="px-8 py-5 font-bold uppercase tracking-widest text-xs">Order ID</th>
                  <th className="px-8 py-5 font-bold uppercase tracking-widest text-xs">Date</th>
                  <th className="px-8 py-5 font-bold uppercase tracking-widest text-xs">Customer</th>
                  <th className="px-8 py-5 font-bold uppercase tracking-widest text-xs">Status</th>
                  <th className="px-8 py-5 font-bold uppercase tracking-widest text-xs text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {orders.length > 0 ? orders.map(order => (
                  <tr 
                    key={order.id} 
                    className="group hover:bg-secondary/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-8 py-5 font-bold text-foreground">#{order.order_number}</td>
                    <td className="px-8 py-5 font-medium text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-5 font-medium">
                      {order.customer_details?.first_name} {order.customer_details?.last_name}
                      <div className="text-xs text-muted-foreground font-normal">{order.customer_details?.email}</div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1.5 rounded-md text-xs font-bold border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-bold text-foreground">{formatCurrency(parseFloat(order.total || '0'))}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground font-medium text-lg">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <OrderDetailsDrawer 
        isOpen={!!selectedOrder}
        order={selectedOrder as any}
        onClose={() => setSelectedOrder(null)}
        onStatusChange={() => {
          fetchOrders(); // Refresh table when status changes
        }}
      />
    </div>
  );
}