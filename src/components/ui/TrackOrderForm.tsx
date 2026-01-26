'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function TrackOrderForm() {
  const [trackingId, setTrackingId] = useState('');

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder logic - no complex functionality yet
    console.log('Tracking ID:', trackingId);
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
        disabled={!trackingId.trim()}
      >
        Track Order
      </Button>
    </form>
  );
}
