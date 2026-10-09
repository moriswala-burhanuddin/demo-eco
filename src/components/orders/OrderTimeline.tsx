import React from 'react';

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'RETURN_REQUESTED' | 'RETURNED' | 'REFUND_PENDING' | 'REFUNDED';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  placedAt?: string;
  // Can add more timestamps if backend provides them later
}

const statusFlow = [
  { status: 'CONFIRMED', label: 'Order Confirmed' },
  { status: 'PROCESSING', label: 'Processing' },
  { status: 'PACKED', label: 'Packed' },
  { status: 'SHIPPED', label: 'Shipped' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { status: 'DELIVERED', label: 'Delivered' },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ currentStatus, placedAt }) => {
  // Determine if order is cancelled
  if (currentStatus === 'CANCELLED') {
    return (
      <div className="p-4 border rounded-lg bg-red-50 border-red-100">
        <h3 className="font-semibold text-red-800">Order Cancelled</h3>
        <p className="text-sm text-red-600 mt-1">This order was cancelled.</p>
      </div>
    );
  }

  // Find current index in normal flow
  const currentIndex = statusFlow.findIndex(s => s.status === currentStatus);
  // If not found (e.g. pending), treat as -1
  const activeIndex = currentIndex >= 0 ? currentIndex : (currentStatus === 'PENDING' ? -1 : statusFlow.length - 1);

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {statusFlow.map((step, idx) => {
          const isComplete = idx <= activeIndex;
          const isLast = idx === statusFlow.length - 1;

          return (
            <li key={step.status}>
              <div className="relative pb-8">
                {!isLast && (
                  <span
                    className={`absolute top-4 left-4 -ml-px h-full w-0.5 ${isComplete ? 'bg-black' : 'bg-gray-200'}`}
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${isComplete ? 'bg-black' : 'bg-gray-100'}`}>
                      {isComplete ? (
                        <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                      )}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className={`text-sm ${isComplete ? 'font-semibold text-gray-900' : 'font-medium text-gray-500'}`}>
                        {step.label}
                      </p>
                    </div>
                    {isComplete && step.status === 'CONFIRMED' && placedAt && (
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        <time dateTime={placedAt}>{new Date(placedAt).toLocaleDateString()} · {new Date(placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
