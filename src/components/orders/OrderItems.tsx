import React from 'react';

interface OrderItem {
  id: number;
  product_name: string;
  variant_snapshot: string;
  variant_sku: string;
  image_url: string | null;
  final_price: string;
  quantity: number;
}

interface OrderItemsProps {
  items: OrderItem[];
}

export const OrderItems: React.FC<OrderItemsProps> = ({ items }) => {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
        <h3 className="text-xs font-bold tracking-widest text-gray-900 uppercase">Order Items</h3>
      </div>
      <ul role="list" className="divide-y divide-gray-100/80">
        {items.map((item) => (
          <li key={item.id} className="p-8 flex flex-col sm:flex-row gap-8 hover:bg-gray-50/30 transition-colors">
            <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm relative group">
              {item.image_url ? (
                <img
                  src={item.image_url.startsWith('http') ? item.image_url : `http://localhost:8000${item.image_url}`}
                  alt={item.product_name}
                  className="h-full w-full object-cover object-center transform transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400 text-[10px] font-bold uppercase tracking-widest">No Image</div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-center">
              <div>
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <h4 className="line-clamp-2 pr-4">{item.product_name}</h4>
                  <p className="whitespace-nowrap">₹{(parseFloat(item.final_price) * item.quantity).toFixed(2)}</p>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                    {item.variant_snapshot}
                  </span>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                    SKU: {item.variant_sku}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 items-end justify-between mt-6">
                <p className="text-sm font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  Qty: {item.quantity}
                </p>
                <p className="text-sm font-bold text-gray-400">
                  ₹{parseFloat(item.final_price).toFixed(2)} each
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
