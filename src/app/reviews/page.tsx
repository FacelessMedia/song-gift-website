import { Metadata } from 'next';
import AnnouncementBar from '@/components/sections/AnnouncementBar';
import Navigation from '@/components/navigation/Navigation';
import Footer from '@/components/sections/Footer';
import { ValentinesBanner } from '@/components/ui/ValentinesBanner';
import { Button } from '@/components/ui/Button';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeading, SectionDescription } from '@/components/ui/Typography';
import { REVIEWS } from '@/data/reviews';
import { ReviewsGrid } from '@/components/reviews/ReviewsGrid';
import { RelatedPages } from '@/components/ui/RelatedPages';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Customer Reviews & Stories",
  description: "Real stories from people who've gifted custom songs to their loved ones. See how personalized music creates unforgettable moments.",
};

export default function Reviews() {

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
          <ReviewsGrid reviews={REVIEWS} variant="reviews-page" />
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

      {/* Related Pages */}
      <RelatedPages 
        title="Create Your Perfect Song Gift"
        pages={[
          {
            title: "Create Your Song",
            href: "/create",
            description: "Start creating your personalized song gift with our step-by-step process"
          },
          {
            title: "Custom Song for Wife",
            href: "/custom-song-for-wife",
            description: "Show your wife how much she means to you with a personalized song"
          },
          {
            title: "Valentine's Day Song Gift",
            href: "/valentines-day-song-gift",
            description: "Give the most romantic Valentine's Day gift — a song written just for them"
          },
          {
            title: "Anniversary Song Gift",
            href: "/anniversary-song-gift",
            description: "Celebrate your love story with a custom anniversary song"
          },
          {
            title: "Frequently Asked Questions",
            href: "/faq",
            description: "Get answers to common questions about our custom song creation process"
          },
          {
            title: "Birthday Song Gift",
            href: "/birthday-song-gift",
            description: "Make their birthday unforgettable with a personalized song gift"
          }
        ]}
      />
      
      {/* Footer */}
      <Footer />
    </>
  );
}
