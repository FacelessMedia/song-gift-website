'use client';

import { Button } from '@/components/ui/Button';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeading, SectionDescription } from '@/components/ui/Typography';

export default function Hero() {

  return (
    <SectionWrapper 
      className="relative overflow-hidden bg-gradient-to-br from-background-main via-background-soft to-primary/5 py-8 md:py-12"
      spacing="sm"
    >
      {/* Background Video Placeholder */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-background-soft/80 to-background-main/60">
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Content */}
        <div className="text-center lg:text-left">
          <SectionHeading 
            level={1}
            className="text-5xl md:text-6xl lg:text-7xl mb-8"
          >
            Turn Your Memories Into 
            <span className="text-primary"> Personalized Songs</span>
          </SectionHeading>
          
          <SectionDescription className="mb-10 max-w-2xl mx-auto lg:mx-0">
            Create custom songs that capture your most precious moments. Professional musicians craft unique melodies based on your story, delivered as beautiful keepsakes.
          </SectionDescription>

          <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-12">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/create';
                }
              }}
              aria-label="Start creating your personalized song"
            >
              Gift a Custom Song
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/reviews';
                }
              }}
              aria-label="Listen to sample songs"
            >
              Listen to Samples
            </Button>
          </div>

          {/* Enhanced Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 text-base">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3" role="img" aria-label="Customer avatars">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark border-3 border-white shadow-soft"></div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-dark to-primary border-3 border-white shadow-soft"></div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-background-soft to-primary/20 border-3 border-white shadow-soft flex items-center justify-center">
                  <span className="text-primary font-heading font-bold text-sm" aria-hidden="true">+</span>
                </div>
              </div>
              <span className="font-body font-medium text-sm text-text-main">Join over 100,000 people who have made memories with Custom Song Gifts!</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex" role="img" aria-label="5 star rating">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span className="font-body font-semibold text-text-main">4.9/5 rating</span>
            </div>
          </div>
        </div>

        {/* Featured Video */}
        <div className="relative flex justify-center">
          {/* Fixed Video Container */}
          <div className="w-full max-w-[264px] sm:max-w-[297px] aspect-[9/16] bg-gradient-to-br from-white/90 to-background-soft/90 backdrop-blur-sm rounded-3xl shadow-soft-lg border border-white/50 overflow-hidden">
            {/* YouTube Embed with nocookie domain for less branding */}
            <iframe
              className="w-full h-full object-cover"
              src="https://www.youtube-nocookie.com/embed/uRQsEE_yP1M?mute=1&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0&disablekb=1&fs=1&playsinline=1&origin=https://song-gift-website.vercel.app"
              title="Featured Video - Song Creation Process"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              style={{ objectFit: 'cover' }}
            />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl" aria-hidden="true"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl" aria-hidden="true"></div>
        </div>
      </div>
    </SectionWrapper>
  );
}
