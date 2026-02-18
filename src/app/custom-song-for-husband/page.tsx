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
  title: "Custom Song for Husband – A Personalized Song Gift | SongGift",
  description: "Create a personalized song for your husband that celebrates your journey together. A heartfelt gift that shows how much he means to you.",
};

export default function CustomSongForHusband() {
  // Select relevant testimonials
  const relevantReviews = [
    REVIEWS.find(r => r.name === "Jennifer Adams"),
    REVIEWS.find(r => r.name === "Amanda Foster"),
    REVIEWS.find(r => r.name === "Thomas Lee")
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
              Create a Custom Song That Captures What Your Husband Means to You
            </h1>
            <p className="font-serif text-xl md:text-2xl text-text-muted mb-8 leading-relaxed">
              He's your partner, your best friend, your rock. Show your husband how grateful you are for everything he does with a personalized song that celebrates the man you married and the life you've built together.
            </p>
            <Link href="/create">
              <Button size="lg" className="text-lg px-8 py-4">
                Create His Song Now
              </Button>
            </Link>
          </div>
        </SectionWrapper>

        {/* How It Works - Tailored for Husbands */}
        <SectionWrapper background="soft" spacing="lg">
          <div className="max-w-5xl mx-auto">
            <SectionHeading level={2} className="text-center mb-12">
              How to Create a Meaningful Song for Your Husband
            </SectionHeading>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">❤️</span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Share Your Appreciation
                </h3>
                <p className="font-body text-text-muted">
                  Tell us what makes him special — his strength, his humor, how he supports you, and all the reasons you're proud to call him your husband.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🎼</span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-text-main mb-4">
                  We Create His Song
                </h3>
                <p className="font-body text-text-muted">
                  Professional musicians craft a heartfelt song that honors your husband and expresses everything you want him to know.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Give Him the Surprise
                </h3>
                <p className="font-body text-text-muted">
                  Watch him be moved by a song that celebrates who he is and how much he means to you and your family.
                </p>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* Why This Gift Matters */}
        <SectionWrapper spacing="lg">
          <div className="max-w-4xl mx-auto">
            <SectionHeading level={2} className="text-center mb-8">
              Why Your Husband Will Be Touched by This Gift
            </SectionHeading>
            
            <h3 className="font-heading text-2xl font-semibold text-text-main mb-6 text-center">
              A Heartfelt Way to Show Your Husband He's Appreciated
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 rounded-3xl shadow-soft border border-primary/10">
                <h4 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Recognizes His Efforts
                </h4>
                <p className="font-body text-text-muted">
                  Men often don't hear enough appreciation for all they do. A custom song acknowledges his hard work, his love for the family, and the ways he makes your life better every day.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-3xl shadow-soft border border-primary/10">
                <h4 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Something He'll Actually Keep
                </h4>
                <p className="font-body text-text-muted">
                  Unlike ties or gadgets, a personalized song becomes something he's genuinely proud of. He'll share it with friends and listen to it whenever he needs a reminder of how loved he is.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="font-serif text-lg text-text-muted mb-8">
                Show your husband that he deserves recognition for being the amazing man, partner, and father he is. Give him a gift that honors everything he does.
              </p>
              <Link href="/create">
                <Button size="lg">
                  Start Creating His Song
                </Button>
              </Link>
            </div>
          </div>
        </SectionWrapper>

        {/* Customer Stories */}
        <SectionWrapper background="soft" spacing="lg">
          <div className="max-w-5xl mx-auto">
            <SectionHeading level={2} className="text-center mb-12">
              Husbands Are Moved by Their Custom Songs
            </SectionHeading>
            
            <ReviewsGrid reviews={relevantReviews} variant="reviews-page" />
            
            <div className="text-center mt-12">
              <Link href="/reviews" className="font-body text-primary hover:text-primary-dark underline">
                Read more heartfelt stories →
              </Link>
            </div>
          </div>
        </SectionWrapper>

        {/* Final CTA */}
        <SectionWrapper spacing="lg" className="text-center">
          <div className="max-w-3xl mx-auto">
            <SectionHeading level={2} className="mb-6">
              Ready to Create His Song?
            </SectionHeading>
            <SectionDescription className="mb-8">
              Your husband works hard for your family every day. Surprise him with a personalized song that shows how much you notice, appreciate, and love him.
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
            title: "Anniversary Song Gift",
            href: "/anniversary-song-gift",
            description: "Celebrate your journey together with a personalized anniversary song"
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
