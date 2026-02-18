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
  title: "Birthday Song Gift – A Personalized Song Gift | SongGift",
  description: "Make their birthday unforgettable with a personalized song gift. Celebrate their life, your memories, and your relationship in music.",
};

export default function BirthdaySongGift() {
  // Select relevant testimonials
  const relevantReviews = [
    REVIEWS.find(r => r.name === "Lisa Thompson"),
    REVIEWS.find(r => r.name === "Maria Garcia"),
    REVIEWS.find(r => r.name === "Amanda Foster")
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
              Give Them a Birthday Gift They'll Remember Forever — A Song Made Just for Them
            </h1>
            <p className="font-serif text-xl md:text-2xl text-text-muted mb-8 leading-relaxed">
              Birthdays come once a year, but memories last forever. Create a personalized song that celebrates who they are, the joy they bring to your life, and all the reasons they deserve to be celebrated.
            </p>
            <Link href="/create">
              <Button size="lg" className="text-lg px-8 py-4">
                Create Their Birthday Song
              </Button>
            </Link>
          </div>
        </SectionWrapper>

        {/* How It Works - Tailored for Birthdays */}
        <SectionWrapper background="soft" spacing="lg">
          <div className="max-w-5xl mx-auto">
            <SectionHeading level={2} className="text-center mb-12">
              How to Create an Unforgettable Birthday Surprise
            </SectionHeading>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🎂</span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Celebrate Who They Are
                </h3>
                <p className="font-body text-text-muted">
                  Tell us about their personality, your favorite memories together, what makes them special, and why they deserve to be celebrated.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🎵</span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-text-main mb-4">
                  We Create Their Anthem
                </h3>
                <p className="font-body text-text-muted">
                  Professional musicians craft a joyful, personalized song that celebrates their life and the happiness they bring to everyone around them.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🎉</span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Make Their Day Magic
                </h3>
                <p className="font-body text-text-muted">
                  Watch them light up as they hear a song written just for them — the perfect soundtrack to their special day.
                </p>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* Why This Gift Matters */}
        <SectionWrapper spacing="lg">
          <div className="max-w-4xl mx-auto">
            <SectionHeading level={2} className="text-center mb-8">
              Why a Custom Song Makes the Perfect Birthday Gift
            </SectionHeading>
            
            <h3 className="font-heading text-2xl font-semibold text-text-main mb-6 text-center">
              A Birthday Gift That's Actually About Them
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 rounded-3xl shadow-soft border border-primary/10">
                <h4 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Celebrates Their Uniqueness
                </h4>
                <p className="font-body text-text-muted">
                  A custom song isn't just another gift — it's a celebration of who they are as a person. It captures their quirks, their dreams, and all the things that make them irreplaceable in your life.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-3xl shadow-soft border border-primary/10">
                <h4 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Something They'll Actually Use
                </h4>
                <p className="font-body text-text-muted">
                  Unlike gadgets that break or clothes that go out of style, a personalized song becomes part of their life. They'll listen to it when they need a smile or want to remember how loved they are.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="font-serif text-lg text-text-muted mb-8">
                Give them a birthday gift that shows how much thought you put into celebrating who they are. Create something as special and unique as they are.
              </p>
              <Link href="/create">
                <Button size="lg">
                  Start Their Birthday Song
                </Button>
              </Link>
            </div>
          </div>
        </SectionWrapper>

        {/* Customer Stories */}
        <SectionWrapper background="soft" spacing="lg">
          <div className="max-w-5xl mx-auto">
            <SectionHeading level={2} className="text-center mb-12">
              Birthday Songs That Made Their Day
            </SectionHeading>
            
            <ReviewsGrid reviews={relevantReviews} variant="reviews-page" />
            
            <div className="text-center mt-12">
              <Link href="/reviews" className="font-body text-primary hover:text-primary-dark underline">
                Read more celebration stories →
              </Link>
            </div>
          </div>
        </SectionWrapper>

        {/* Final CTA */}
        <SectionWrapper spacing="lg" className="text-center">
          <div className="max-w-3xl mx-auto">
            <SectionHeading level={2} className="mb-6">
              Ready to Create Their Birthday Song?
            </SectionHeading>
            <SectionDescription className="mb-8">
              Make their next birthday one they'll never forget. Give them a personalized song that celebrates everything wonderful about who they are and the joy they bring to your life.
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
        title="More Birthday & Special Occasion Ideas"
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
            title: "Custom Song for Girlfriend",
            href: "/custom-song-for-girlfriend",
            description: "Turn your love story into a song your girlfriend will treasure forever"
          },
          {
            title: "Custom Song for Husband",
            href: "/custom-song-for-husband",
            description: "Create a meaningful song that captures what your husband means to you"
          }
        ]}
      />
      
      <Footer />
    </>
  );
}
