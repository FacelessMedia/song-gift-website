'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeading, SectionDescription } from '@/components/ui/Typography';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showUnmuteButton, setShowUnmuteButton] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptAutoplay = async () => {
      try {
        // First try autoplay with sound
        video.muted = false;
        await video.play();
        setIsMuted(false);
        setShowUnmuteButton(false);
      } catch (error) {
        try {
          // Fallback to muted autoplay
          video.muted = true;
          await video.play();
          setIsMuted(true);
          setShowUnmuteButton(true);
        } catch (mutedError) {
          console.log('Autoplay blocked entirely');
          setShowUnmuteButton(true);
        }
      }
    };

    attemptAutoplay();
  }, []);

  const handleUnmute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      setIsMuted(false);
      setShowUnmuteButton(false);
      video.play().catch(() => {
        // If play fails, keep the unmute button visible
        setShowUnmuteButton(true);
      });
    }
  };

  return (
    <SectionWrapper 
      className="relative overflow-hidden bg-gradient-to-br from-background-main via-background-soft to-primary/5 py-8 md:py-12"
      spacing="sm"
    >
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
          {/* Video Container — height matches video exactly */}
          <div className="relative w-[80%] max-w-[650px] mx-auto" style={{ transform: 'scaleY(1.2)', transformOrigin: 'center' }}>
            <video
              ref={videoRef}
              className="w-full h-auto object-contain rounded-2xl shadow-lg block"
              src="/Musical-Content/Videos/SongGit-Ad.mp4"
              title="Featured Video - Song Creation Process"
              controls
              playsInline
              preload="metadata"
              loop
            />
            
            {/* Unmute Button Overlay */}
            {showUnmuteButton && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
                <button
                  onClick={handleUnmute}
                  className="bg-white/90 hover:bg-white text-text-main rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-105"
                  aria-label="Tap to unmute video"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M9 9v6l4-3-4-3z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl" aria-hidden="true"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl" aria-hidden="true"></div>
        </div>
      </div>
    </SectionWrapper>
  );
}
