'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeading, SectionDescription } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';

export default function Testimonials() {
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);

  const handleAudioToggle = (index: number) => {
    if (playingAudio === index) {
      // Pause current audio (placeholder logic)
      setPlayingAudio(null);
    } else {
      // Play new audio (placeholder logic)
      setPlayingAudio(index);
      // In real implementation, this would start audio playback
    }
  };
  const testimonials = [
    {
      type: "video",
      name: "Sarah Johnson",
      role: "Anniversary Gift",
      content: "The song captured our love story perfectly. My husband cried when he heard it on our 10th anniversary. It's now our most treasured possession.",
      rating: 5
    },
    {
      type: "text",
      name: "Michael Chen",
      role: "Wedding Surprise",
      content: "I surprised my bride with a custom song during our reception. The entire room was in tears. SongGift made our special day even more magical.",
      rating: 5
    },
    {
      type: "video",
      name: "Emma Rodriguez",
      role: "Memorial Tribute",
      content: "They helped me honor my grandmother's memory with a beautiful song. It brought comfort to our whole family during a difficult time.",
      rating: 5
    },
    {
      type: "text",
      name: "David Kim",
      role: "Birthday Surprise",
      content: "My daughter's face lit up when she heard her personalized birthday song. The musicians captured her personality perfectly in the melody.",
      rating: 5
    },
    {
      type: "video",
      name: "Lisa Thompson",
      role: "Graduation Gift",
      content: "What an incredible way to celebrate my son's graduation! The song tells his journey and achievements beautifully.",
      rating: 5
    },
    {
      type: "text",
      name: "James Wilson",
      role: "Valentine's Day",
      content: "This was the most romantic gift I've ever given. My wife still plays our song every morning. Worth every penny!",
      rating: 5
    }
  ];

  return (
    <SectionWrapper background="soft" spacing="sm" className="py-8 md:py-12">
      <div className="text-center mb-16">
        <SectionHeading level={2}>
          What Our Customers Say
        </SectionHeading>
        <SectionDescription>
          Real stories from real people who turned their memories into music.
        </SectionDescription>
      </div>

        {/* Horizontally Scrollable Container */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex-shrink-0 w-80 md:w-96 snap-start">
                {testimonial.type === "video" ? (
                  /* Video Testimonial Card */
                  <div className="bg-gradient-to-br from-white to-background-soft p-8 rounded-3xl shadow-soft-lg hover:shadow-soft border border-white/50 h-full">
                    {/* Video Placeholder */}
                    <div className="aspect-video bg-gradient-to-br from-text-main/10 to-primary/20 rounded-2xl mb-6 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <p className="font-body text-sm text-text-muted">Video Testimonial</p>
                      </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>

                    {/* Author */}
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-heading font-semibold mr-4">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-body font-semibold text-text-main">
                          {testimonial.name}
                        </div>
                        <div className="font-body text-sm text-text-muted">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Text Testimonial Card */
                  <div className="bg-white p-8 rounded-3xl shadow-soft-lg hover:shadow-soft border border-primary/10 h-full">
                    {/* Rating Stars */}
                    <div className="flex items-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>

                    {/* Audio Play Button */}
                    <div className="mb-6">
                      <button
                        onClick={() => handleAudioToggle(index)}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 text-primary font-body font-semibold px-4 py-2 rounded-full transition-all duration-300 border border-primary/20 hover:border-primary/30"
                        aria-label={playingAudio === index ? "Pause song" : "Play song"}
                      >
                        {playingAudio === index ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        )}
                        <span className="text-sm">
                          {playingAudio === index ? 'Pause Song' : 'Play Song'}
                        </span>
                      </button>
                    </div>

                    {/* Testimonial Content */}
                    <blockquote className="font-serif text-lg text-text-main mb-8 leading-relaxed">
                      "{testimonial.content}"
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-heading font-semibold mr-4">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-body font-semibold text-text-main text-lg">
                          {testimonial.name}
                        </div>
                        <div className="font-body text-text-muted">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Scroll Indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <div key={index} className="w-2 h-2 rounded-full bg-primary/30"></div>
            ))}
          </div>
        </div>

    </SectionWrapper>
  );
}
