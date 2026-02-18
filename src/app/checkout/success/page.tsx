'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AnnouncementBar from '@/components/sections/AnnouncementBar';
import Navigation from '@/components/navigation/Navigation';
import Footer from '@/components/sections/Footer';
import { Button } from '@/components/ui/Button';
import { clearSessionData } from '@/utils/sessionManager';

interface OrderData {
  tracking_id: string;
  order_status: string;
  expected_delivery_at: string;
  created_at: string;
  customer_email: string;
  amount_paid: number;
  currency: string;
  delivery_speed: string;
  intake_payload?: any;
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [pollingDone, setPollingDone] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate personalized confirmation messaging
  const getPersonalizedMessage = () => {
    if (!orderData?.intake_payload) {
      return {
        primary: "You've just done something truly meaningful.",
        secondary: "We're already working on a song that speaks from your heart."
      };
    }

    const intake = orderData.intake_payload;
    const buyerName = intake.fullName || 'there';
    const recipientName = intake.recipientName;
    const relationship = intake.recipientRelationship === 'other' 
      ? intake.recipientCustomRelation 
      : intake.recipientRelationship;

    if (recipientName && relationship) {
      return {
        primary: `You've just done something meaningful for your ${relationship}, ${recipientName}.`,
        secondary: "We're already working on a song that speaks from your heart to theirs."
      };
    }

    return {
      primary: "You've just done something truly meaningful.",
      secondary: "We're already working on a song that speaks from your heart."
    };
  };

  // Generate delivery context message
  const getDeliveryMessage = () => {
    if (!orderData) return "";
    
    const isExpress = orderData.delivery_speed === 'express';
    const deliveryTime = isExpress ? 'within 24 hours' : 'within 48 hours';
    
    return `Your custom song will be delivered ${deliveryTime}, crafted with the care and attention it deserves.`;
  };

  useEffect(() => {
    if (!sessionId) return;

    // Clear session data immediately — payment succeeded
    clearSessionData();

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 20; // 20 seconds

    const poll = async () => {
      while (attempts < maxAttempts && !cancelled) {
        try {
          const response = await fetch('/api/orders/by-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId }),
          });

          const data = await response.json();

          if (response.ok && data.tracking_id) {
            if (!cancelled) setOrderData(data);
            return;
          }
        } catch {
          // Network error — keep polling
        }

        attempts++;
        if (attempts < maxAttempts && !cancelled) {
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      // Polling exhausted — mark done so we show the graceful fallback
      if (!cancelled) setPollingDone(true);
    };

    poll();

    return () => { cancelled = true; };
  }, [sessionId]);

  const copyTrackingId = async () => {
    if (orderData?.tracking_id) {
      try {
        await navigator.clipboard.writeText(orderData.tracking_id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy tracking ID:', err);
      }
    }
  };

  // No session_id at all — this is the only true error
  if (!sessionId) {
    return (
      <>
        <AnnouncementBar />
        <Navigation />
        <main className="min-h-screen bg-background-soft">
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <h1 className="font-heading text-2xl font-bold text-text-main mb-4">
              No Order Found
            </h1>
            <p className="font-body text-text-muted mb-8">We couldn't find a session for this page. If you just completed a purchase, please check your email for confirmation.</p>
            <Button variant="primary" size="lg" onClick={() => window.location.href = '/'}>
              Return Home
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <Navigation />
      
      <main className="min-h-screen bg-background-soft">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="font-heading text-3xl font-bold text-text-main mb-4">
            Payment Received! 🎉
          </h1>
          
          <div className="mb-8">
            <p className="font-body text-text-main mb-4 text-lg font-medium">
              {getPersonalizedMessage().primary}
            </p>
            <p className="font-body text-text-muted text-base">
              {getPersonalizedMessage().secondary}
            </p>
            {orderData && (
              <p className="font-body text-text-muted text-sm mt-4">
                {getDeliveryMessage()}
              </p>
            )}
          </div>

          {/* Order Details — shown when webhook has processed */}
          {orderData ? (
            <div className="bg-white rounded-2xl shadow-soft border border-primary/10 p-6 mb-8">
              <h2 className="font-heading text-xl font-semibold text-text-main mb-6">
                Order Details
              </h2>
              
              <div className="space-y-4">
                {/* Tracking ID */}
                <div className="bg-primary/5 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-sm font-medium text-primary uppercase tracking-wide">Tracking ID</p>
                      <p className="text-lg font-mono font-bold text-text-main">{orderData.tracking_id}</p>
                    </div>
                    <button
                      onClick={copyTrackingId}
                      className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
                    >
                      {copied ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Order Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Order Status</p>
                    <p className="mt-1 font-semibold text-text-main">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {orderData.order_status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Expected Delivery</p>
                    <p className="mt-1 font-semibold text-text-main">
                      {new Date(orderData.expected_delivery_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Delivery Speed</p>
                    <p className="mt-1 font-semibold text-text-main capitalize">
                      {orderData.delivery_speed === 'express' ? 'Delivered within 24 hours' : 'Delivered within 48 hours'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Amount Paid</p>
                    <p className="mt-1 font-semibold text-text-main">
                      ${(orderData.amount_paid / 100).toFixed(2)} {orderData.currency.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : pollingDone ? (
            /* Graceful fallback — webhook hasn't processed yet but payment succeeded */
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="font-heading text-lg font-semibold text-amber-900 mb-2">
                We're finalizing your order.
              </h2>
              <p className="font-body text-amber-800 text-sm">
                Your payment was successful. You will receive an email confirmation with your tracking ID shortly.
              </p>
            </div>
          ) : (
            /* Still polling — show subtle loading indicator */
            <div className="bg-white rounded-2xl shadow-soft border border-primary/10 p-6 mb-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
              <p className="font-body text-text-muted text-sm">Loading your order details...</p>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-soft border border-primary/10 p-6 mb-8">
            <h2 className="font-heading text-xl font-semibold text-text-main mb-4">
              What happens next?
            </h2>
            
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-sm font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-body font-semibold text-text-main">Order Confirmation</h3>
                  <p className="text-sm text-text-muted">You'll receive an email confirmation with your tracking ID shortly.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-sm font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-body font-semibold text-text-main">Song Creation</h3>
                  <p className="text-sm text-text-muted">Our professional musicians will craft your personalized song.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-sm font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-body font-semibold text-text-main">Delivery</h3>
                  <p className="text-sm text-text-muted">Your custom song will be delivered via email within the selected timeframe.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {orderData?.tracking_id ? (
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => window.location.href = `/track-order?tracking_id=${orderData.tracking_id}`}
              >
                Track My Order
              </Button>
            ) : (
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => window.location.href = '/track-order'}
              >
                Track My Order
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="md"
              onClick={() => window.location.href = '/'}
            >
              Return Home
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={
      <>
        <AnnouncementBar />
        <Navigation />
        <main className="min-h-screen bg-background-soft flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="font-body text-text-muted">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
