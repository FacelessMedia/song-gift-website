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
  title: "Anniversary Song Gift – A Personalized Song Gift | SongGift",
  description: "Mark your anniversary with something truly special — a custom song that captures every milestone of your journey together.",
};

export default function AnniversarySongGift() {
  // Select relevant testimonials
  const relevantReviews = [
    REVIEWS.find(r => r.name === "Sarah Johnson"),
    REVIEWS.find(r => r.name === "David Kim"),
    REVIEWS.find(r => r.name === "Robert Kim")
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
              Celebrate Your Anniversary With a Song That Tells Your Love Story
            </h1>
            <p className="font-serif text-xl md:text-2xl text-text-muted mb-8 leading-relaxed">
              Another year together deserves more than dinner and flowers. Honor your journey with a personalized song that captures every milestone, memory, and reason you're still choosing each other every day.
            </p>
            <Link href="/create">
              <Button size="lg" className="text-lg px-8 py-4">
                Create Your Anniversary Song
              </Button>
            </Link>
          </div>
        </SectionWrapper>

        {/* How It Works - Tailored for Anniversaries */}
        <SectionWrapper background="soft" spacing="lg">
          <div className="max-w-5xl mx-auto">
            <SectionHeading level={2} className="text-center mb-12">
              How to Create the Perfect Anniversary Gift
            </SectionHeading>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">📖</span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Tell Your Journey
                </h3>
                <p className="font-body text-text-muted">
                  Share your story — from your wedding day to the challenges you've overcome, the dreams you've built, and the love that's grown stronger.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🎶</span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-text-main mb-4">
                  We Honor Your Love
                </h3>
                <p className="font-body text-text-muted">
                  Professional musicians create a heartfelt song that celebrates your unique relationship and the beautiful life you've created together.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🥂</span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Celebrate Together
                </h3>
                <p className="font-body text-text-muted">
                  Listen to your love story in music and remember why you fell in love — and why you keep falling in love — year after year.
                </p>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* Why This Gift Matters */}
        <SectionWrapper spacing="lg">
          <div className="max-w-4xl mx-auto">
            <SectionHeading level={2} className="text-center mb-8">
              Why Your Anniversary Deserves More Than a Restaurant Reservation
            </SectionHeading>
            
            <h3 className="font-heading text-2xl font-semibold text-text-main mb-6 text-center">
              The Perfect Anniversary Gift for Couples Who Have Everything
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 rounded-3xl shadow-soft border border-primary/10">
                <h4 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Celebrates Your Growth
                </h4>
                <p className="font-body text-text-muted">
                  Every anniversary marks another year of choosing each other. A custom song honors not just where you started, but how far you've come and the love that's deepened over time.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-3xl shadow-soft border border-primary/10">
                <h4 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Creates a New Tradition
                </h4>
                <p className="font-body text-text-muted">
                  Your anniversary song becomes something you can listen to every year, remembering this moment and adding new verses to your love story as it continues to unfold.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="font-serif text-lg text-text-muted mb-8">
                Your love story deserves to be celebrated in a way that's as unique and enduring as your relationship. Give yourselves the gift of music.
              </p>
              <Link href="/create">
                <Button size="lg">
                  Start Your Anniversary Song
                </Button>
              </Link>
            </div>
          </div>
        </SectionWrapper>

        {/* Customer Stories */}
        <SectionWrapper background="soft" spacing="lg">
          <div className="max-w-5xl mx-auto">
            <SectionHeading level={2} className="text-center mb-12">
              Anniversary Songs That Brought Tears of Joy
            </SectionHeading>
            
            <ReviewsGrid reviews={relevantReviews} variant="reviews-page" />
            
            <div className="text-center mt-12">
              <Link href="/reviews" className="font-body text-primary hover:text-primary-dark underline">
                Read more anniversary stories →
              </Link>
            </div>
          </div>
        </SectionWrapper>

        {/* Final CTA */}
        <SectionWrapper spacing="lg" className="text-center">
          <div className="max-w-3xl mx-auto">
            <SectionHeading level={2} className="mb-6">
              Ready to Create Your Anniversary Song?
            </SectionHeading>
            <SectionDescription className="mb-8">
              Make this anniversary unforgettable. Create a personalized song that honors your journey together and celebrates the love that keeps growing stronger every year.
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
        title="More Anniversary & Celebration Ideas"
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
            title: "Custom Song for Wife",
            href: "/custom-song-for-wife",
            description: "Create a romantic song that shows your wife how much she means to you"
          },
          {
            title: "Valentine's Day Song Gift",
            href: "/valentines-day-song-gift",
            description: "Give the most romantic Valentine's Day gift — a song written just for them"
          },
          {
            title: "Birthday Song Gift",
            href: "/birthday-song-gift",
            description: "Give them a birthday gift they'll remember forever — their own song"
          }
        ]}
      />
      
      <Footer />
    </>
  );
}
