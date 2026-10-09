import React from 'react';
import Link from 'next/link';
import { OrderStatusBadge } from './OrderStatusBadge';
import { ArrowRight, Calendar, CreditCard, PackageOpen } from 'lucide-react';

interface OrderItemSnap {
  id: number;
  product_name: string;
  image_url: string | null;
  // ... other fields
}

interface OrderCardProps {
  order: {
    id: string;
    order_number: string;
    created_at: string;
    status: any;
    total: string;
    items: OrderItemSnap[];
  };
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const displayedItems = order.items.slice(0, 3);
  const extraItemsCount = order.items.length - 3;

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden mb-6 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 group relative">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gray-900 to-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="border-b border-gray-100/80 bg-gray-50/30 px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h3 className="text-sm font-bold tracking-widest uppercase text-gray-900">Order #{order.order_number}</h3>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="flex items-center text-xs font-medium text-gray-500 gap-4">
            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-gray-400" /> {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span className="flex items-center gap-1.5"><CreditCard size={14} className="text-gray-400" /> ₹{parseFloat(order.total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8">
        <div className="flex flex-col w-full sm:w-auto">
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3 flex items-center gap-1.5">
            <PackageOpen size={12} />
            {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
          </p>
          <div className="flex items-center space-x-3">
            {displayedItems.map((item, idx) => (
              <div key={idx} className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border border-gray-100/80 overflow-hidden bg-gray-50/50 shadow-sm group-hover:shadow transition-shadow">
                {item.image_url ? (
                  <img 
                    src={item.image_url.startsWith('http') ? item.image_url : `http://localhost:8000${item.image_url}`} 
                    alt={item.product_name} 
                    className="h-full w-full object-cover transform transition-transform duration-700 group-hover:scale-110" 
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-50">
                    <span className="text-gray-300 text-[9px] uppercase font-bold tracking-widest">No img</span>
                  </div>
                )}
              </div>
            ))}
            {extraItemsCount > 0 && (
              <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/50">
                <span className="text-sm font-bold text-gray-500">+{extraItemsCount}</span>
              </div>
            )}
          </div>
        </div>

        <div className="w-full sm:w-auto flex items-center justify-end">
          <Link 
            href={`/account/orders/${order.id}`} 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-xs font-bold tracking-widest uppercase text-white bg-black rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-black/20 text-center group/btn"
          >
            View Details
            <ArrowRight size={16} className="transform transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};
