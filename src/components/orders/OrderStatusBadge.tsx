import React from 'react';

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'RETURN_REQUESTED' | 'RETURNED' | 'REFUND_PENDING' | 'REFUNDED';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: { label: 'Pending Payment', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  CONFIRMED: { label: 'Confirmed', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  PROCESSING: { label: 'Processing', className: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  PACKED: { label: 'Packed', className: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  SHIPPED: { label: 'Shipped', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', className: 'bg-orange-100 text-orange-800 border-orange-200' },
  DELIVERED: { label: 'Delivered', className: 'bg-green-100 text-green-800 border-green-200' },
  CANCELLED: { label: 'Cancelled', className: 'bg-red-100 text-red-800 border-red-200' },
  RETURN_REQUESTED: { label: 'Return Requested', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  RETURNED: { label: 'Returned', className: 'bg-gray-100 text-gray-800 border-gray-200' },
  REFUND_PENDING: { label: 'Refund Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  REFUNDED: { label: 'Refunded', className: 'bg-gray-100 text-gray-800 border-gray-200' },
};

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800 border-gray-200' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      {/* <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span> */}
      {config.label}
    </span>
  );
};
