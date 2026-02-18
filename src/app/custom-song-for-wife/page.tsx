import { Metadata } from 'next';
import AnnouncementBar from '@/components/sections/AnnouncementBar';
import Navigation from '@/components/navigation/Navigation';
import Footer from '@/components/sections/Footer';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeading, SectionDescription } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { REVIEWS } from '@/data/reviews';
import { ReviewsGrid } from '@/components/reviews/ReviewsGrid';
import { RelatedPages } from '@/components/ui/RelatedPages';
import { TrustStrip } from '@/components/ui/TrustStrip';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Custom Song for Wife – A Personalized Song Gift | SongGift",
  description: "Surprise your wife with a personalized song written from your love story. A romantic gift that celebrates your marriage and creates lasting memories.",
};

export default function CustomSongForWife() {
  // Select relevant testimonials
  const relevantReviews = [
    REVIEWS.find(r => r.name === "Sarah Johnson"),
    REVIEWS.find(r => r.name === "Michael Chen"),
    REVIEWS.find(r => r.name === "David Kim")
  ].filter((review): review is NonNullable<typeof review> => Boolean(review));

  return (
    <>
      <AnnouncementBar />
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <SectionWrapper spacing="lg" className="text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-text-main mb-6 leading-tight">
              Create a Custom Song That Shows Your Wife How Much She Means to You
            </h1>
            <p className="font-serif text-xl md:text-2xl text-text-muted mb-8 leading-relaxed">
              Your marriage is a beautiful story worth celebrating. Turn your shared memories, inside jokes, and deepest feelings into a personalized song that captures the essence of your love.
            </p>
            <Link href="/create">
              <Button size="lg" className="text-lg px-8 py-4">
                Create Her Song Now
              </Button>
            </Link>
          </div>
        </SectionWrapper>

        {/* How It Works - Tailored for Wives */}
        <SectionWrapper background="soft" spacing="lg">
          <div className="max-w-5xl mx-auto">
            <SectionHeading level={2} className="text-center mb-12">
              How to Create the Perfect Song for Your Wife
            </SectionHeading>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">💝</span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Share Your Love Story
                </h3>
                <p className="font-body text-text-muted">
                  Tell us about your journey together — how you met, your wedding day, what makes her laugh, and why you fell in love.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🎵</span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-text-main mb-4">
                  We Craft Your Song
                </h3>
                <p className="font-body text-text-muted">
                  Our professional musicians transform your story into a beautiful, personalized song that captures her heart.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🎁</span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Present Your Gift
                </h3>
                <p className="font-body text-text-muted">
                  Watch her face light up as she hears your love story transformed into a song she'll treasure forever.
                </p>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* Why This Gift Matters */}
        <SectionWrapper spacing="lg">
          <div className="max-w-4xl mx-auto">
            <SectionHeading level={2} className="text-center mb-8">
              Why a Custom Song Is the Perfect Gift for Your Wife
            </SectionHeading>
            
            <h3 className="font-heading text-2xl font-semibold text-text-main mb-6 text-center">
              More Meaningful Than Traditional Anniversary Gifts
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 rounded-3xl shadow-soft border border-primary/10">
                <h4 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Celebrates Your Unique Bond
                </h4>
                <p className="font-body text-text-muted">
                  Unlike generic gifts, a custom song is created specifically from your relationship. It includes your special moments, shared dreams, and the little things that make your marriage extraordinary.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-3xl shadow-soft border border-primary/10">
                <h4 className="font-heading text-xl font-semibold text-text-main mb-4">
                  A Keepsake She'll Treasure
                </h4>
                <p className="font-body text-text-muted">
                  While flowers fade and jewelry can be lost, a song lasts forever. She can listen to it whenever she wants to feel loved and remember why you're perfect together.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="font-serif text-lg text-text-muted mb-8">
                Show your wife that your love deserves more than a store-bought gift. Give her something as unique and beautiful as your relationship.
              </p>
              <Link href="/create">
                <Button size="lg">
                  Start Creating Her Song
                </Button>
              </Link>
            </div>
          </div>
        </SectionWrapper>

        {/* Customer Stories */}
        <SectionWrapper background="soft" spacing="lg">
          <div className="max-w-5xl mx-auto">
            <SectionHeading level={2} className="text-center mb-12">
              Wives Love Their Custom Songs
            </SectionHeading>
            
            <ReviewsGrid reviews={relevantReviews} variant="reviews-page" />
            
            <div className="text-center mt-12">
              <Link href="/reviews" className="font-body text-primary hover:text-primary-dark underline">
                Read more customer stories →
              </Link>
            </div>
          </div>
        </SectionWrapper>

        {/* Final CTA */}
        <SectionWrapper spacing="lg" className="text-center">
          <div className="max-w-3xl mx-auto">
            <SectionHeading level={2} className="mb-6">
              Ready to Create Her Song?
            </SectionHeading>
            <SectionDescription className="mb-8">
              Don't wait for a special occasion. Show your wife how much she means to you with a gift that's as unique and beautiful as your love story.
            </SectionDescription>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link href="/create">
                <Button size="lg" className="w-full sm:w-auto">
                  Create Your Custom Song
                </Button>
              </Link>
              <Link href="/faq">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Have Questions?
                </Button>
              </Link>
            </div>
          </div>
        </SectionWrapper>
        
        {/* Trust Strip */}
        <SectionWrapper spacing="sm">
          <div className="max-w-4xl mx-auto">
            <TrustStrip />
          </div>
        </SectionWrapper>
      </main>

      {/* Related Pages */}
      <RelatedPages 
        title="More Custom Song Gift Ideas"
        pages={[
          {
            title: "Create Your Song",
            href: "/create",
            description: "Start creating your personalized song gift with our step-by-step process"
          },
          {
            title: "Customer Reviews",
            href: "/reviews",
            description: "Read real stories from customers who've created unforgettable song gifts"
          },
          {
            title: "Frequently Asked Questions",
            href: "/faq",
            description: "Get answers to common questions about our custom song creation process"
          },
          {
            title: "Anniversary Song Gift",
            href: "/anniversary-song-gift",
            description: "Celebrate your journey together with a personalized anniversary song"
          },
          {
            title: "Valentine's Day Song Gift",
            href: "/valentines-day-song-gift",
            description: "Give the most romantic Valentine's Day gift — a song written just for them"
          },
          {
            title: "Custom Song for Girlfriend",
            href: "/custom-song-for-girlfriend",
            description: "Turn your love story into a song your girlfriend will treasure forever"
          }
        ]}
      />
      
      <Footer />
    </>
  );
}
