'use client';

import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How much does it cost?",
      answer: "Our regular price is $199, but we're currently offering a Valentine's Day special for $79. This includes everything you need for your personalized song."
    },
    {
      question: "How long does delivery take?",
      answer: "Standard delivery is 24–48 hours and is included in your purchase. For faster delivery, we offer express delivery in 12–24 hours for an additional $39."
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
    <section className="py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-text-main mb-6">
            Frequently Asked Questions
          </h2>
          <p className="font-body text-lg md:text-xl text-text-muted max-w-2xl mx-auto">
            Got questions? We've got answers. Find everything you need to know about creating your personalized song.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-soft overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-background-soft/50 transition-colors"
                >
                  <h3 className="font-heading text-lg font-semibold text-text-main pr-4">
                    {faq.question}
                  </h3>
                  <svg
                    className={`w-6 h-6 text-primary transition-transform flex-shrink-0 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {openIndex === index && (
                  <div className="px-8 pb-6">
                    <p className="font-body text-text-muted leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <p className="font-body text-text-muted mb-6">
            Still have questions? We're here to help!
          </p>
          <button className="bg-primary hover:bg-primary-dark text-white font-body font-semibold py-4 px-8 rounded-2xl transition-colors shadow-soft">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}
