'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import AnnouncementBar from '@/components/sections/AnnouncementBar';
import Navigation from '@/components/navigation/Navigation';
import Footer from '@/components/sections/Footer';
import { ValentinesBanner } from '@/components/ui/ValentinesBanner';
import { Button } from '@/components/ui/Button';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeading, SectionDescription } from '@/components/ui/Typography';


export default function Reviews() {
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);

  const handleAudioToggle = (index: number) => {
    if (playingAudio === index) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(index);
    }
  };

  const reviews = [
    {
      type: "video",
      name: "Sarah Johnson",
      role: "Anniversary Gift",
      content: "The song captured our love story perfectly. My husband cried when he heard it on our 10th anniversary.",
      rating: 5
    },
    {
      type: "text",
      name: "Michael Chen",
      role: "Wedding Surprise",
      content: "I surprised my fiancée with this at our rehearsal dinner. Everyone was in tears. It was the perfect way to express my feelings.",
      rating: 5
    },
    {
      type: "video",
      name: "Emma Rodriguez",
      role: "Mother's Day Gift",
      content: "My mom has listened to this song every day since I gave it to her. She says it's the most meaningful gift she's ever received.",
      rating: 5
    },
    {
      type: "text",
      name: "David Thompson",
      role: "Birthday Surprise",
      content: "My wife's 40th birthday needed something special. This song about our journey together was absolutely perfect.",
      rating: 5
    },
    {
      type: "text",
      name: "Lisa Park",
      role: "Graduation Gift",
      content: "We gave this to our daughter for graduation. It tells the story of her journey and dreams. She plays it before every job interview now.",
      rating: 5
    },
    {
      type: "video",
      name: "James Wilson",
      role: "Valentine's Day",
      content: "Best Valentine's gift ever. The lyrics captured memories I didn't even know she remembered. Pure magic.",
      rating: 5
    },
    {
      type: "text",
      name: "Maria Garcia",
      role: "Memorial Song",
      content: "We created this in memory of my father. It helps us feel close to him and celebrates his life in the most beautiful way.",
      rating: 5
    },
    {
      type: "text",
      name: "Robert Kim",
      role: "Proposal Song",
      content: "I proposed with this playing in the background. It told our whole story leading up to that moment. She said yes!",
      rating: 5
    },
    {
      type: "video",
      name: "Jennifer Adams",
      role: "Christmas Gift",
      content: "This was under the Christmas tree for my husband. 25 years of marriage captured in one beautiful song.",
      rating: 5
    },
    {
      type: "text",
      name: "Carlos Martinez",
      role: "New Baby",
      content: "We made this for our newborn son. It's about our hopes and dreams for him. We play it during bedtime every night.",
      rating: 5
    },
    {
      type: "text",
      name: "Amanda Foster",
      role: "Best Friend Gift",
      content: "20 years of friendship deserved something special. This song captures all our adventures and inside jokes perfectly.",
      rating: 5
    },
    {
      type: "video",
      name: "Thomas Lee",
      role: "Retirement Gift",
      content: "We surprised our boss with this for his retirement. 30 years of leadership and friendship captured beautifully.",
      rating: 5
    }
  ];

  return (
    <>
      {/* Top announcement bar */}
      <AnnouncementBar />
      
      {/* Sticky navigation bar */}
      <Navigation />
      
      <main>
        {/* Valentine's Day Offer Banner */}
        <ValentinesBanner />
        
        {/* Reviews Header */}
        <SectionWrapper background="default" spacing="lg">
          <div className="text-center mb-12">
            <SectionHeading level={1}>
              Customer Reviews
            </SectionHeading>
            <SectionDescription>
              Real stories from customers who've gifted personalized songs to their loved ones.
            </SectionDescription>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-3xl shadow-soft-lg hover:shadow-soft border border-white/80 h-full">
                {/* Rating Stars */}
                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>

                {review.type === "video" ? (
                  /* Video Review */
                  <div className="mb-4">
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mb-4 cursor-pointer hover:from-primary/20 hover:to-primary/30 transition-all duration-300">
                      <div className="text-center text-primary">
                        <div className="w-16 h-16 mx-auto mb-2 bg-primary/20 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <p className="font-body text-sm font-semibold">Click to Play Audio</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Text Review with Audio Button */
                  <div className="mb-4">
                    <button
                      onClick={() => handleAudioToggle(index)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 text-primary font-body font-semibold px-3 py-2 rounded-full transition-all duration-300 border border-primary/20 hover:border-primary/30 mb-4"
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
                )}

                {/* Review Content */}
                <blockquote className="font-serif text-base text-text-main mb-6 leading-relaxed">
                  "{review.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-heading font-semibold mr-3">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-body font-semibold text-text-main">
                      {review.name}
                    </div>
                    <div className="font-body text-text-muted text-sm">
                      {review.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionWrapper>

        {/* Emotional Section */}
        <SectionWrapper background="soft" spacing="md">
          <div className="text-center max-w-3xl mx-auto">
            <SectionHeading level={2}>
              Why Custom Songs Touch Hearts
            </SectionHeading>
            <SectionDescription className="mb-8">
              Music has the power to capture emotions that words alone cannot express. When you gift a personalized song, you're giving someone a piece of your heart—a melody that tells your unique story and creates a lasting memory they'll treasure forever.
            </SectionDescription>
          </div>
        </SectionWrapper>

        {/* Submit Review Section */}
        <SectionWrapper background="default" spacing="md">
          <div className="text-center max-w-2xl mx-auto">
            <SectionHeading level={2}>
              Share Your Story
            </SectionHeading>
            <SectionDescription className="mb-8">
              Have you received or gifted a custom song? We'd love to hear about your experience and share your story with others.
            </SectionDescription>
            
            <div className="bg-gradient-to-br from-background-soft to-primary/5 rounded-2xl p-8 border border-primary/10">
              <p className="font-body text-text-main mb-6">
                Email us your review, photos, or video testimonial:
              </p>
              <div className="bg-white px-4 py-3 rounded-xl border border-primary/20 mb-6">
                <span className="font-body font-semibold text-primary">
                  reviews@songgift.com
                </span>
              </div>
              <Button variant="primary" size="lg">
                Send Your Review
              </Button>
            </div>
          </div>
        </SectionWrapper>
      </main>
      
      {/* Footer */}
      <Footer />
    </>
  );
}
