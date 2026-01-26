'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeading, SectionDescription } from '@/components/ui/Typography';

export default function Pricing() {
  const [expressDelivery, setExpressDelivery] = useState(false);

  const coreFeatures = [
    "Professional songwriting & recording",
    "Studio-quality mixing & mastering", 
    "Digital delivery (MP3 & WAV)",
    "Custom cover art design",
    "48-hour standard delivery",
    "Unlimited revisions until perfect",
    "Lyric sheet included"
  ];

  const totalPrice = expressDelivery ? 118 : 79;

  return (
    <SectionWrapper background="gradient" spacing="lg">
      <div className="text-center mb-20">
        <SectionHeading level={2} id="choose-your-perfect-package">
          Choose Your Perfect Package
        </SectionHeading>
        <SectionDescription>
          Everything you need to create and share your personalized song, delivered with care and precision.
        </SectionDescription>
      </div>

      {/* Single Core Offering */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-white to-background-soft rounded-3xl shadow-soft-lg p-10 border border-white/80 relative">
          {/* Valentine's Badge */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-primary text-white font-body font-semibold px-6 py-2 rounded-full text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              Valentine's Special
            </span>
          </div>

          {/* Pricing Header */}
          <div className="text-center mb-8 pt-4">
            <h3 className="font-heading text-3xl font-bold text-text-main mb-4">
              Custom Song Package
            </h3>
            
            {/* Price Display */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-text-muted line-through text-2xl font-body">
                $199
              </span>
              <span className="text-5xl font-heading font-bold text-primary">
                ${totalPrice}
              </span>
            </div>
            
            <p className="font-body text-text-muted">
              Professional quality, delivered with love
            </p>
          </div>

          {/* Core Features */}
          <div className="mb-8">
            <h4 className="font-heading text-lg font-semibold text-text-main mb-4">
              What's Included:
            </h4>
            <ul className="space-y-3">
              {coreFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span className="font-body text-text-main">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Express Delivery Upsell */}
          <div className="mb-8 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl border border-primary/20">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="express-delivery"
                checked={expressDelivery}
                onChange={(e) => setExpressDelivery(e.target.checked)}
                className="mt-1 w-4 h-4 text-primary bg-white border-primary/30 rounded focus:ring-primary"
              />
              <div className="flex-1">
                <label htmlFor="express-delivery" className="font-heading font-semibold text-text-main cursor-pointer">
                  Express Delivery Upgrade (+$39)
                </label>
                <p className="font-body text-text-muted text-sm mt-1">
                  Get your song in 12-24 hours instead of 48 hours. Perfect for last-minute gifts!
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            variant="primary" 
            size="lg" 
            fullWidth
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/create';
              }
            }}
          >
            Begin Your Song - ${totalPrice}
          </Button>
        </div>

        {/* Trust Elements */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-12">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <div className="text-center sm:text-left">
              <div className="font-heading font-semibold text-text-main">
                100% Satisfaction Guarantee
              </div>
              <div className="font-body text-text-muted text-sm">
                Love your song or get your money back
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L9 9l-8 .75L9 17l-1.5 8L12 21l4.5 4L15 17l8-7.25L15 9z"/>
            </svg>
            <div className="text-center sm:text-left">
              <div className="font-heading font-semibold text-text-main">
                Professional Quality
              </div>
              <div className="font-body text-text-muted text-sm">
                Studio-grade recording & mixing
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
