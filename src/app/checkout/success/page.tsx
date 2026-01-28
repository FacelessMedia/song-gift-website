'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AnnouncementBar from '@/components/sections/AnnouncementBar';
import Navigation from '@/components/navigation/Navigation';
import Footer from '@/components/sections/Footer';
import { Button } from '@/components/ui/Button';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <>
        <AnnouncementBar />
        <Navigation />
        <main className="min-h-screen bg-background-soft flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="font-body text-text-muted">Processing your order...</p>
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
            Payment Successful! 🎉
          </h1>
          
          <p className="font-body text-text-muted mb-8 text-lg">
            Thank you for your order! Your custom song is now in production.
          </p>

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

          {sessionId && (
            <div className="bg-primary/5 rounded-xl p-4 mb-8">
              <p className="text-sm text-text-muted">
                <strong>Session ID:</strong> {sessionId}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => window.location.href = '/track-order'}
            >
              Track Your Order
            </Button>
            
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
