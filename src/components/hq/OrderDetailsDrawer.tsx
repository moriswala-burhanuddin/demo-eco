"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Truck, User, CreditCard, ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import api from '@/services/api';

interface OrderItem {
  id: number;
  variant_details: any;
  quantity: number;
  price: string;
}

interface Order {
  id: number;
  order_number: string;
  customer_details: {
    first_name: string;
    last_name: string;
    email: string;
  };
  shipping_address_details: any;
  status: string;
  total: string;
  subtotal: string;
  tax: string;
  shipping_cost: string;
  created_at: string;
  items?: OrderItem[];
}

interface OrderDetailsDrawerProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: () => void;
}

export function OrderDetailsDrawer({ order, isOpen, onClose, onStatusChange }: OrderDetailsDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [fullOrder, setFullOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (order && isOpen) {
      setLoading(true);
      api.get(`/orders/${order.id}/`).then(res => {
        setFullOrder(res.data);
      }).catch(err => {
        console.error(err);
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setFullOrder(null);
    }
  }, [order, isOpen]);

  const updateStatus = async (newStatus: string) => {
    if (!fullOrder) return;
    setLoading(true);
    try {
      await api.patch(`/orders/${fullOrder.id}/`, { status: newStatus });
      setFullOrder({ ...fullOrder, status: newStatus });
      onStatusChange();
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'SHIPPED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'PROCESSING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'CANCELLED': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-secondary text-muted-foreground border-border';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && order && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-background border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="h-20 border-b border-border px-8 flex items-center justify-between bg-secondary/30">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-heading font-bold">Order #{order.order_number}</h2>
                <span className={`px-3 py-1.5 rounded-md text-xs font-bold border ${getStatusColor(fullOrder?.status || order.status)}`}>
                  {fullOrder?.status || order.status}
                </span>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-border transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {loading && !fullOrder ? (
                <div className="flex items-center justify-center h-40">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : fullOrder ? (
                <>
                  {/* Action Bar */}
                  <div className="bg-secondary/30 border border-border rounded-2xl p-6 flex flex-wrap gap-4">
                    <h3 className="w-full text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Fulfillment Actions</h3>
                    
                    {fullOrder.status === 'PROCESSING' && (
                      <button 
                        onClick={() => updateStatus('SHIPPED')}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
                      >
                        <Truck size={18} /> Mark as Shipped
                      </button>
                    )}
                    
                    {fullOrder.status === 'SHIPPED' && (
                      <button 
                        onClick={() => updateStatus('DELIVERED')}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
                      >
                        <Package size={18} /> Mark as Delivered
                      </button>
                    )}

                    {(fullOrder.status === 'PROCESSING' || fullOrder.status === 'PENDING') && (
                      <button 
                        onClick={() => updateStatus('CANCELLED')}
                        className="px-6 py-3 bg-background border border-destructive/30 hover:bg-destructive/10 text-destructive font-bold rounded-xl transition-colors ml-auto"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="border border-border/60 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4 text-muted-foreground">
                        <User size={20} />
                        <h3 className="font-bold">Customer</h3>
                      </div>
                      <p className="font-bold text-lg">{fullOrder.customer_details?.first_name} {fullOrder.customer_details?.last_name}</p>
                      <p className="text-muted-foreground mt-1">{fullOrder.customer_details?.email}</p>
                    </div>
                    <div className="border border-border/60 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4 text-muted-foreground">
                        <Truck size={20} />
                        <h3 className="font-bold">Shipping Address</h3>
                      </div>
                      <p className="font-medium">
                        {fullOrder.shipping_address_details?.address_line_1}<br/>
                        {fullOrder.shipping_address_details?.city}, {fullOrder.shipping_address_details?.postal_code}<br/>
                        {fullOrder.shipping_address_details?.country}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <h3 className="text-lg font-bold font-heading mb-4">Items Purchased</h3>
                    <div className="border border-border/60 rounded-2xl overflow-hidden">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-secondary/50 text-muted-foreground">
                          <tr>
                            <th className="px-6 py-4 font-bold">Product</th>
                            <th className="px-6 py-4 font-bold text-center">Qty</th>
                            <th className="px-6 py-4 font-bold text-right">Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {fullOrder.items?.map(item => (
                            <tr key={item.id}>
                              <td className="px-6 py-4 font-medium">
                                {item.variant_details?.product_name}
                                <div className="text-xs text-muted-foreground mt-1">
                                  {item.variant_details?.color_name} • {item.variant_details?.size_name}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center font-bold">{item.quantity}</td>
                              <td className="px-6 py-4 text-right font-bold">{formatCurrency(parseFloat(item.price))}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="border border-border/60 rounded-2xl p-6 space-y-4 bg-secondary/20">
                    <div className="flex justify-between text-muted-foreground font-medium">
                      <span>Subtotal</span>
                      <span className="text-foreground">{formatCurrency(parseFloat(fullOrder.subtotal || '0'))}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground font-medium">
                      <span>Shipping</span>
                      <span className="text-foreground">{formatCurrency(parseFloat(fullOrder.shipping_cost || '0'))}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground font-medium">
                      <span>Tax</span>
                      <span className="text-foreground">{formatCurrency(parseFloat(fullOrder.tax || '0'))}</span>
                    </div>
                    <div className="pt-4 border-t border-border/60 flex justify-between font-bold text-2xl font-heading">
                      <span>Total</span>
                      <span>{formatCurrency(parseFloat(fullOrder.total || '0'))}</span>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
