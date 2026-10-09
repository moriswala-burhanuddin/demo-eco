"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, Tag, ArrowRight } from 'lucide-react';
import api from '@/services/api';
import { formatCurrency } from '@/lib/currency';

interface AnalyticsData {
  thirty_days: {
    total_revenue: number;
    total_orders: number;
    average_order_value: number;
  }
}

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

export default function HQDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [analyticsRes, ordersRes] = await Promise.all([
          api.get('/analytics/sales-summary/'),
          api.get('/orders/')
        ]);
        
        setAnalytics(analyticsRes.data);
        
        // Handle paginated response if applicable
        const ordersData = ordersRes.data.results || ordersRes.data;
        setRecentOrders(ordersData.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
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

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-heading font-black tracking-tight">Overview</h1>
          <p className="text-muted-foreground mt-2 font-medium">Here's what's happening in your store over the last 30 days.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(analytics?.thirty_days.total_revenue || 0)} 
          trend="30 Days" 
          icon={<DollarSign className="text-emerald-600" />} 
          bg="bg-emerald-50"
        />
        <StatCard 
          title="Total Orders" 
          value={analytics?.thirty_days.total_orders.toString() || "0"} 
          trend="30 Days" 
          icon={<ShoppingCart className="text-blue-600" />} 
          bg="bg-blue-50"
        />
        <StatCard 
          title="Average Order Value" 
          value={formatCurrency(analytics?.thirty_days.average_order_value || 0)} 
          trend="30 Days" 
          icon={<TrendingUp className="text-purple-600" />} 
          bg="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-background rounded-3xl shadow-sm border border-border/60 p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold font-heading">Recent Orders</h2>
            <Link href="/hq-panel/orders" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
              View All Orders <ArrowRight size={16} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-muted-foreground border-b border-border/50">
                <tr>
                  <th className="pb-4 font-bold uppercase tracking-widest text-xs">Order</th>
                  <th className="pb-4 font-bold uppercase tracking-widest text-xs">Customer</th>
                  <th className="pb-4 font-bold uppercase tracking-widest text-xs">Status</th>
                  <th className="pb-4 font-bold uppercase tracking-widest text-xs text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recentOrders.length > 0 ? recentOrders.map(order => (
                  <tr key={order.id} className="group hover:bg-secondary/50 transition-colors">
                    <td className="py-5 font-bold text-foreground">#{order.order_number}</td>
                    <td className="py-5 font-medium">{order.customer_details?.first_name} {order.customer_details?.last_name}</td>
                    <td className="py-5">
                      <span className={`px-3 py-1.5 rounded-md text-xs font-bold border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-5 text-right font-bold text-foreground">{formatCurrency(parseFloat(order.total || '0'))}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground font-medium">No recent orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Activity */}
        <div className="bg-background rounded-3xl shadow-sm border border-border/60 p-8 flex flex-col">
          <h2 className="text-2xl font-bold font-heading mb-8">Quick Actions</h2>
          <div className="space-y-4 flex-1">
            <Link href="/hq-panel/products" className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 hover:border-primary hover:bg-primary/5 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package size={20} />
              </div>
              <div>
                <h3 className="font-bold">Manage Inventory</h3>
                <p className="text-xs text-muted-foreground font-medium">Add or update products</p>
              </div>
            </Link>
            
            <Link href="/hq-panel/offers/create" className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 hover:border-primary hover:bg-primary/5 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <Tag size={20} />
              </div>
              <div>
                <h3 className="font-bold">Create Offer</h3>
                <p className="text-xs text-muted-foreground font-medium">Setup a new discount</p>
              </div>
            </Link>

            <Link href="/hq-panel/customers" className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 hover:border-primary hover:bg-primary/5 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users size={20} />
              </div>
              <div>
                <h3 className="font-bold">View Customers</h3>
                <p className="text-xs text-muted-foreground font-medium">Manage user accounts</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, icon, bg }: { title: string, value: string, trend: string, icon: React.ReactNode, bg: string }) {
  return (
    <div className="bg-background rounded-3xl shadow-sm border border-border/60 p-8 flex flex-col justify-between group hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-6">
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
        <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <h3 className="text-4xl font-black font-heading tracking-tight">{value}</h3>
        <span className="text-xs font-bold text-muted-foreground bg-secondary px-3 py-1.5 rounded-lg border border-border/50">{trend}</span>
      </div>
    </div>
  );
}
