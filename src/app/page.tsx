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

export const metadata: Metadata = {
  title: "Home | SongGift",
  description: "Create personalized custom songs for your loved ones. Professional musicians craft unique songs based on your memories, emotions, and stories.",
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
      
      {/* 11. Footer */}
      <Footer />
    </>
  );
}
