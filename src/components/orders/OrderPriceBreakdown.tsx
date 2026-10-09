import React from 'react';

interface OrderPriceBreakdownProps {
  subtotal: string;
  discount: string;
  couponDiscount: string;
  tax: string;
  shippingCost: string;
  total: string;
}

export const OrderPriceBreakdown: React.FC<OrderPriceBreakdownProps> = ({
  subtotal,
  discount,
  couponDiscount,
  tax,
  shippingCost,
  total,
}) => {
  const dSubtotal = parseFloat(subtotal);
  const dDiscount = parseFloat(discount);
  const dCoupon = parseFloat(couponDiscount);
  const dTax = parseFloat(tax);
  const dShipping = parseFloat(shippingCost);
  const dTotal = parseFloat(total);

  const totalSavings = dDiscount + dCoupon;

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
        <h3 className="text-xs font-bold tracking-widest text-gray-900 uppercase">Price Details</h3>
      </div>
      <div className="p-8">
        <dl className="space-y-5 text-sm">
          <div className="flex justify-between items-center text-gray-500 font-medium">
            <dt>Subtotal</dt>
            <dd className="text-gray-900">₹{dSubtotal.toFixed(2)}</dd>
          </div>
          
          {dDiscount > 0 && (
            <div className="flex justify-between items-center text-green-600 font-bold">
              <dt>Product Discount</dt>
              <dd>-₹{dDiscount.toFixed(2)}</dd>
            </div>
          )}
          
          {dCoupon > 0 && (
            <div className="flex justify-between items-center text-green-600 font-bold">
              <dt>Coupon Discount</dt>
              <dd>-₹{dCoupon.toFixed(2)}</dd>
            </div>
          )}

          <div className="flex justify-between items-center text-gray-500 font-medium">
            <dt>Shipping</dt>
            <dd className="text-gray-900">
              {dShipping === 0 ? (
                <span className="uppercase tracking-widest text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">Free</span>
              ) : (
                `₹${dShipping.toFixed(2)}`
              )}
            </dd>
          </div>

          <div className="flex justify-between items-center text-gray-500 font-medium pb-5 border-b border-dashed border-gray-200">
            <dt>Tax</dt>
            <dd className="text-gray-900">₹{dTax.toFixed(2)}</dd>
          </div>

          <div className="flex items-center justify-between pt-2">
            <dt className="text-base font-bold text-gray-900 uppercase tracking-widest">Total</dt>
            <dd className="text-2xl font-black text-gray-900 tracking-tight">₹{dTotal.toFixed(2)}</dd>
          </div>
        </dl>
        
        {totalSavings > 0 && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-6 py-4 rounded-2xl text-sm font-bold text-center border border-green-100 shadow-sm flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            You saved ₹{totalSavings.toFixed(2)} on this order
          </div>
        )}
      </div>
    </div>
  );
};
