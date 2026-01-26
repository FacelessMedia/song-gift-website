'use client';

import { useEffect } from 'react';
import AnnouncementBar from '@/components/sections/AnnouncementBar';
import Navigation from '@/components/navigation/Navigation';
import Footer from '@/components/sections/Footer';
import { ValentinesBanner } from '@/components/ui/ValentinesBanner';
import { Button } from '@/components/ui/Button';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeading, SectionDescription } from '@/components/ui/Typography';
import TrackOrderForm from '@/components/ui/TrackOrderForm';

export default function TrackOrder() {
  return (
    <>
      {/* 1. Top announcement bar */}
      <AnnouncementBar />
      
      {/* 2. Sticky navigation bar */}
      <Navigation />
      
      <main>
        {/* Valentine's Day Offer Banner */}
        <ValentinesBanner />
        
        {/* Track Order Main Content */}
        <SectionWrapper background="default" spacing="lg">
          <div className="max-w-2xl mx-auto text-center">
            <SectionHeading level={1}>
              Track Your Order
            </SectionHeading>
            <SectionDescription className="mb-12">
              Enter your tracking ID to check the status of your custom song order.
            </SectionDescription>

            {/* Search Form */}
            <TrackOrderForm />

            {/* Help Text */}
            <div className="mt-12 p-6 bg-gradient-to-br from-background-soft to-primary/5 rounded-2xl border border-primary/10">
              <h3 className="font-heading text-lg font-semibold text-text-main mb-3">
                Need Help?
              </h3>
              <p className="font-body text-sm text-text-muted leading-relaxed mb-4">
                Your tracking ID was sent to your email after checkout. If you can't find it, check your spam folder or contact our support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="outline" 
                  size="md"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = '/contact';
                    }
                  }}
                >
                  Contact Support
                </Button>
                <Button variant="secondary" size="md">
                  Resend Tracking ID
                </Button>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </main>
      
      {/* Footer */}
      <Footer />
    </>
  );
}
