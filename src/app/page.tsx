import { Metadata } from 'next';
import AnnouncementBar from '@/components/sections/AnnouncementBar';
import Navigation from '@/components/navigation/Navigation';
import Hero from '@/components/sections/Hero';
import HowItWorks from '@/components/sections/HowItWorks';
import Testimonials from '@/components/sections/Testimonials';
import WhatYouGet from '@/components/sections/WhatYouGet';
import Pricing from '@/components/sections/Pricing';
import Footer from '@/components/sections/Footer';
import { ValentinesBanner } from '@/components/ui/ValentinesBanner';
import { RelatedPages } from '@/components/ui/RelatedPages';
import { ProductSchema } from '@/components/schema/ProductSchema';

export const metadata: Metadata = {
  title: "Custom Song Gift",
  description: "Turn your love story into a personalized song gift. Professional musicians create unique songs from your memories in just days.",
};


export default function Home() {
  return (
    <>
      {/* 1. Top announcement bar (clickable) */}
      <AnnouncementBar />
      
      {/* 2. Sticky navigation bar */}
      <Navigation />
      
      <main>
        {/* 3. Hero section */}
        <Hero />
        
        {/* Valentine's Day Offer Banner - After Hero */}
        <ValentinesBanner />
        
        {/* 4. How It Works section */}
        <HowItWorks />
        
        {/* 5. Testimonials section */}
        <Testimonials />
        
        
        {/* 7. "What You Get" section */}
        <WhatYouGet />
        
        {/* Valentine's Day Offer Banner - Before Pricing */}
        <ValentinesBanner />
        
        {/* 8. Pricing section */}
        <Pricing />
      </main>
      
      {/* 9. Related Pages */}
      <RelatedPages 
        title="Explore Our Custom Song Gifts"
        pages={[
          {
            title: "Custom Song for Wife",
            href: "/custom-song-for-wife",
            description: "Create a romantic song that shows your wife how much she means to you"
          },
          {
            title: "Valentine's Day Song Gift",
            href: "/valentines-day-song-gift", 
            description: "The most romantic Valentine's Day gift — a personalized song"
          },
          {
            title: "Anniversary Song Gift",
            href: "/anniversary-song-gift",
            description: "Celebrate your anniversary with a song that tells your love story"
          },
          {
            title: "Custom Song for Girlfriend",
            href: "/custom-song-for-girlfriend",
            description: "Turn your love story into a song your girlfriend will treasure forever"
          },
          {
            title: "Birthday Song Gift", 
            href: "/birthday-song-gift",
            description: "Give them a birthday gift they'll remember forever — their own song"
          },
          {
            title: "Customer Reviews",
            href: "/reviews",
            description: "See what our customers say about their custom song experiences"
          }
        ]}
      />

      {/* 10. Footer */}
      <Footer />
      
      {/* Product Schema */}
      <ProductSchema 
        name="Custom Song Gift"
        description="Turn your love story into a personalized song gift. Professional musicians create unique songs from your memories in just days."
      />
    </>
  );
}
