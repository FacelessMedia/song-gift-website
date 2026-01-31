'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import AnnouncementBar from '@/components/sections/AnnouncementBar';
import Navigation from '@/components/navigation/Navigation';
import Footer from '@/components/sections/Footer';
import { ValentinesBanner } from '@/components/ui/ValentinesBanner';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeading, SectionDescription } from '@/components/ui/Typography';


export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How much does it cost?",
      answer: "Our regular price is $199, but we're currently offering a Valentine's Day special for $79. This includes everything you need for your personalized song."
    },
    {
      question: "How long does delivery take?",
      answer: "Standard delivery is within 48 hours and is included in your purchase. For faster delivery, we offer express delivery within 24 hours for an additional $39."
    },
    {
      question: "How will I receive my song?",
      answer: "Your song will be delivered via email. You'll receive a confirmation email after checkout, and another email when your song is ready with download links."
    },
    {
      question: "Can I track my order?",
      answer: "Yes, you can track your order using the Track Order page on our website. You'll need your tracking ID which is provided in your confirmation email."
    },
    {
      question: "Is there a money-back guarantee?",
      answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with your song, contact us within 30 days for a full refund."
    },
    {
      question: "Can I use the song commercially?",
      answer: "Yes, commercial use is allowed. You retain full rights to your personalized song and can use it for any purpose, including commercial applications."
    },
    {
      question: "Do you support languages other than English?",
      answer: "Yes, songs can be created in multiple languages. Our team supports various languages including Spanish, French, Italian, and others. Please specify your language preference when ordering."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {/* Top announcement bar */}
      <AnnouncementBar />
      
      {/* Sticky navigation bar */}
      <Navigation />
      
      <main>
        {/* Valentine's Day Offer Banner */}
        <ValentinesBanner />
        
        {/* FAQ Section */}
        <SectionWrapper background="default" spacing="lg">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <SectionHeading level={1}>
                Frequently Asked Questions
              </SectionHeading>
              <SectionDescription>
                Find answers to common questions about our personalized song service.
              </SectionDescription>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-soft border border-primary/10 overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-background-soft/50 transition-colors"
                    aria-expanded={openIndex === index}
                  >
                    <h3 className="font-heading text-lg font-semibold text-text-main pr-4">
                      {faq.question}
                    </h3>
                    <div className={`flex-shrink-0 transform transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}>
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  
                  {openIndex === index && (
                    <div className="px-8 pb-6">
                      <div className="pt-4 border-t border-primary/10">
                        <p className="font-body text-text-muted leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact Support */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-br from-background-soft to-primary/5 rounded-2xl p-8 border border-primary/10">
                <h3 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Still have questions?
                </h3>
                <p className="font-body text-text-muted mb-6">
                  Our support team is here to help you with any questions about your personalized song.
                </p>
                <div className="bg-white px-4 py-3 rounded-xl border border-primary/20 mb-4 inline-block">
                  <span className="font-body font-semibold text-primary">
                    support@songgift.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </main>
      
      {/* Footer */}
      <Footer />
    </>
  );
}
