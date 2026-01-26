'use client';

import { Button } from '@/components/ui/Button';

interface ValentinesBannerProps {
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function ValentinesBanner({ variant = 'primary', className }: ValentinesBannerProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-8 px-4">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center">
            {/* Valentine's Day Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span className="font-body font-semibold text-sm">Valentine's Day Special</span>
            </div>

            {/* Main Offer */}
            <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Limited Time: 60% Off Valentine's Songs
            </h3>
            
            {/* Pricing */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-white/70 line-through text-xl md:text-2xl font-body">
                $199
              </span>
              <span className="text-3xl md:text-4xl font-heading font-bold">
                $79
              </span>
            </div>

            {/* Key Benefits */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6 text-white/90">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="font-body font-semibold">48-Hour Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span className="font-body font-semibold">Perfect for Valentine's Day</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white text-primary hover:bg-white/90 border-0"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/create';
                  }
                }}
              >
                Claim Valentine's Offer
              </Button>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1-1h2v6h-2V1zm0 8h2v6h-2V9z"/>
                </svg>
                <span>Limited time offer - ends soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
