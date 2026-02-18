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
  title: "Custom Song for Girlfriend – A Personalized Song Gift | SongGift",
  description: "Give your girlfriend the most romantic gift imaginable — a custom song written just for her. Turn your relationship into beautiful music.",
};

export default function CustomSongForGirlfriend() {
  // Select relevant testimonials
  const relevantReviews = [
    REVIEWS.find(r => r.name === "Emma Rodriguez"),
    REVIEWS.find(r => r.name === "Lisa Thompson"),
    REVIEWS.find(r => r.name === "Carlos Martinez")
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
              Turn Your Love Story Into a Song Your Girlfriend Will Treasure Forever
            </h1>
            <p className="font-serif text-xl md:text-2xl text-text-muted mb-8 leading-relaxed">
              Every relationship has its own soundtrack of moments. Create a personalized song that captures your journey together — from your first date to all the reasons you can't imagine life without her.
            </p>
            <Link href="/create">
              <Button size="lg" className="text-lg px-8 py-4">
                Create Her Song Now
              </Button>
            </Link>
          </div>
        </SectionWrapper>

        {/* How It Works - Tailored for Girlfriends */}
        <SectionWrapper background="soft" spacing="lg">
          <div className="max-w-5xl mx-auto">
            <SectionHeading level={2} className="text-center mb-12">
              How to Surprise Your Girlfriend With Her Own Song
            </SectionHeading>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">💕</span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Tell Your Story
                </h3>
                <p className="font-body text-text-muted">
                  Share how you met, your favorite memories together, what makes her special, and why you're falling deeper in love every day.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🎶</span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-text-main mb-4">
                  We Create Magic
                </h3>
                <p className="font-body text-text-muted">
                  Professional songwriters and musicians transform your relationship into a beautiful, romantic song that's uniquely yours.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Watch Her Reaction
                </h3>
                <p className="font-body text-text-muted">
                  Present her with a song that tells your love story. Get ready for tears of joy and a moment you'll both remember forever.
                </p>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* Why This Gift Matters */}
        <SectionWrapper spacing="lg">
          <div className="max-w-4xl mx-auto">
            <SectionHeading level={2} className="text-center mb-8">
              Why Your Girlfriend Will Fall in Love With This Gift
            </SectionHeading>
            
            <h3 className="font-heading text-2xl font-semibold text-text-main mb-6 text-center">
              The Most Romantic Gift You Can Give Your Girlfriend
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 rounded-3xl shadow-soft border border-primary/10">
                <h4 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Shows You Really Listen
                </h4>
                <p className="font-body text-text-muted">
                  A custom song proves you pay attention to the little things — her favorite memories, the way she laughs, what makes her feel loved. It's thoughtfulness turned into music.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-3xl shadow-soft border border-primary/10">
                <h4 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Creates a Lasting Memory
                </h4>
                <p className="font-body text-text-muted">
                  Years from now, she'll still get butterflies when she hears "your song." It becomes the soundtrack to your relationship — something only the two of you share.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="font-serif text-lg text-text-muted mb-8">
                Skip the predictable gifts. Give her something that shows how much thought, love, and creativity you put into making her happy.
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
              Girlfriends Are Amazed by Their Custom Songs
            </SectionHeading>
            
            <ReviewsGrid reviews={relevantReviews} variant="reviews-page" />
            
            <div className="text-center mt-12">
              <Link href="/reviews" className="font-body text-primary hover:text-primary-dark underline">
                See more love stories →
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
              Make your next date night unforgettable. Surprise your girlfriend with a personalized song that captures everything you love about her and your relationship.
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
            title: "Custom Song for Wife",
            href: "/custom-song-for-wife",
            description: "Create a romantic song that shows your wife how much she means to you"
          },
          {
            title: "Birthday Song Gift",
            href: "/birthday-song-gift",
            description: "Give them a birthday gift they'll remember forever — their own song"
          },
          {
            title: "Valentine's Day Song Gift",
            href: "/valentines-day-song-gift",
            description: "Give the most romantic Valentine's Day gift — a song written just for them"
          }
        ]}
      />
      
      <Footer />
    </>
  );
}
