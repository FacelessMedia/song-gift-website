'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface OrderData {
  tracking_id: string;
  order_status: string;
  expected_delivery_at: string;
  created_at: string;
}

export default function TrackOrderForm() {
  const [trackingId, setTrackingId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingId.trim()) return;

    setIsLoading(true);
    setError(null);
    setOrderData(null);

    try {
      const response = await fetch('/api/orders/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tracking_id: trackingId.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to track order');
      }

      setOrderData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleTrackOrder} className="space-y-6">
      <div>
        <label htmlFor="tracking-id" className="sr-only">
          Tracking ID
        </label>
        <input
          type="text"
          id="tracking-id"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Enter your tracking ID (e.g., SG-123456)"
          className="w-full px-6 py-4 text-lg border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-soft"
          required
        />
      </div>
      
      <Button 
        type="submit" 
        variant="primary" 
        size="lg"
        disabled={!trackingId.trim() || isLoading}
      >
        {isLoading ? 'Tracking...' : 'Track Order'}
      </Button>

      {/* Error State */}
      {error && (
        <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-2xl">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Order Not Found</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success State - Order Found */}
      {orderData && (
        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-2xl">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-green-800">Order Found!</h3>
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Tracking ID</p>
                    <p className="mt-1 text-sm font-mono text-green-900">{orderData.tracking_id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Status</p>
                    <p className="mt-1 text-sm font-semibold text-green-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        orderData.order_status === 'paid' ? 'bg-blue-100 text-blue-800' :
                        orderData.order_status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        orderData.order_status === 'qa' ? 'bg-purple-100 text-purple-800' :
                        orderData.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                        orderData.order_status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {orderData.order_status === 'qa' ? 'QA' : orderData.order_status.charAt(0).toUpperCase() + orderData.order_status.slice(1)}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Order Date</p>
                    <p className="mt-1 text-sm text-green-900">
                      {new Date(orderData.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Expected Delivery</p>
                    <p className="mt-1 text-sm text-green-900">
                      {new Date(orderData.expected_delivery_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
