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
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Valentine's Day Song Gift – A Personalized Song Gift | SongGift",
  description: "Skip the flowers and chocolates. Give a Valentine's Day gift they'll never forget — a personalized song that tells your love story.",
};

export default function ValentinesDaySongGift() {
  // Select relevant testimonials
  const relevantReviews = [
    REVIEWS.find(r => r.name === "Sarah Johnson"),
    REVIEWS.find(r => r.name === "Emma Rodriguez"),
    REVIEWS.find(r => r.name === "Michael Chen")
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
              The Most Romantic Valentine's Day Gift — A Song Written Just for Them
            </h1>
            <p className="font-serif text-xl md:text-2xl text-text-muted mb-8 leading-relaxed">
              This Valentine's Day, give something that comes from the heart. A personalized song that captures your love story, your inside jokes, and all the reasons they make your world brighter.
            </p>
            <Link href="/create">
              <Button size="lg" className="text-lg px-8 py-4">
                Create Their Valentine Song
              </Button>
            </Link>
          </div>
        </SectionWrapper>

        {/* How It Works - Tailored for Valentine's Day */}
        <SectionWrapper background="soft" spacing="lg">
          <div className="max-w-5xl mx-auto">
            <SectionHeading level={2} className="text-center mb-12">
              How to Create the Perfect Valentine's Day Surprise
            </SectionHeading>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">💌</span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Share Your Love Story
                </h3>
                <p className="font-body text-text-muted">
                  Tell us about your relationship — how you met, your favorite moments together, and what makes them the love of your life.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🎵</span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-text-main mb-4">
                  We Write Your Song
                </h3>
                <p className="font-body text-text-muted">
                  Professional songwriters create a romantic, personalized song that tells your unique love story in beautiful music.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">💕</span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Make Valentine's Magic
                </h3>
                <p className="font-body text-text-muted">
                  Present them with a song that's uniquely yours. Watch their face light up as they hear your love story in music.
                </p>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* Why This Gift Matters */}
        <SectionWrapper spacing="lg">
          <div className="max-w-4xl mx-auto">
            <SectionHeading level={2} className="text-center mb-8">
              Why a Custom Song Is the Ultimate Valentine's Day Gift
            </SectionHeading>
            
            <h3 className="font-heading text-2xl font-semibold text-text-main mb-6 text-center">
              More Romantic Than Flowers and Chocolates Combined
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 rounded-3xl shadow-soft border border-primary/10">
                <h4 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Lasts Forever
                </h4>
                <p className="font-body text-text-muted">
                  Flowers wilt, chocolates get eaten, but a personalized song becomes your couple's anthem. Every time they hear it, they'll remember this Valentine's Day and how much you love them.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-3xl shadow-soft border border-primary/10">
                <h4 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Shows Real Thought
                </h4>
                <p className="font-body text-text-muted">
                  Anyone can buy roses at the store. A custom song proves you put time, creativity, and genuine thought into making this Valentine's Day special and memorable.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="font-serif text-lg text-text-muted mb-8">
                This Valentine's Day, give a gift that's as unique and beautiful as your love. Create something they'll treasure long after February 14th is over.
              </p>
              <Link href="/create">
                <Button size="lg">
                  Start Their Valentine Song
                </Button>
              </Link>
            </div>
          </div>
        </SectionWrapper>

        {/* Customer Stories */}
        <SectionWrapper background="soft" spacing="lg">
          <div className="max-w-5xl mx-auto">
            <SectionHeading level={2} className="text-center mb-12">
              Valentine's Day Songs That Melted Hearts
            </SectionHeading>
            
            <ReviewsGrid reviews={relevantReviews} variant="reviews-page" />
            
            <div className="text-center mt-12">
              <Link href="/reviews" className="font-body text-primary hover:text-primary-dark underline">
                Read more romantic stories →
              </Link>
            </div>
          </div>
        </SectionWrapper>

        {/* Final CTA */}
        <SectionWrapper spacing="lg" className="text-center">
          <div className="max-w-3xl mx-auto">
            <SectionHeading level={2} className="mb-6">
              Ready to Create Their Valentine Song?
            </SectionHeading>
            <SectionDescription className="mb-8">
              Don't settle for ordinary Valentine's gifts. Give them something extraordinary — a personalized song that celebrates your love and creates a memory you'll both cherish forever.
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
      </main>

      {/* Related Pages */}
      <RelatedPages 
        title="More Romantic Song Gift Ideas"
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
            title: "Custom Song for Girlfriend",
            href: "/custom-song-for-girlfriend",
            description: "Turn your love story into a song your girlfriend will treasure forever"
          },
          {
            title: "Anniversary Song Gift",
            href: "/anniversary-song-gift",
            description: "Celebrate your journey together with a personalized anniversary song"
          },
          {
            title: "Custom Song for Wife",
            href: "/custom-song-for-wife",
            description: "Create a romantic song that shows your wife how much she means to you"
          }
        ]}
      />
      
      <Footer />
    </>
  );
}
