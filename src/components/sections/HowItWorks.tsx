'use client';

import { Button } from '@/components/ui/Button';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeading, SectionDescription } from '@/components/ui/Typography';

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Share Your Story",
      description: "Tell us your special moment",
      icon: "💭"
    },
    {
      number: "2", 
      title: "We Create",
      description: "Professional recording & production",
      icon: "🎵"
    },
    {
      number: "3",
      title: "You Receive",
      description: "Digital delivery with cover art",
      icon: "🎁"
    }
  ];

  return (
    <SectionWrapper background="soft" spacing="sm" className="py-8">
      <div className="text-center mb-8">
        <SectionHeading level={2}>
          How It Works
        </SectionHeading>
        <SectionDescription>
          Creating your personalized song is simple and professional.
        </SectionDescription>
      </div>

      {/* Horizontal Steps Layout */}
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          {steps.map((step, index) => (
            <div key={index} className="flex-1 text-center relative">
              {/* Step Circle */}
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-2xl mb-3 shadow-soft">
                {step.icon}
              </div>
              
              {/* Step Number */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-primary">
                <span className="font-heading font-bold text-primary text-sm">
                  {step.number}
                </span>
              </div>

              {/* Content */}
              <h3 className="font-heading text-lg font-bold text-text-main mb-1">
                {step.title}
              </h3>
              <p className="font-body text-sm text-text-muted">
                {step.description}
              </p>

              {/* Connector Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-4 transform -translate-y-1/2">
                  <svg className="w-6 h-6 text-primary/40" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/create';
              }
            }}
          >
            Create a Personal Song
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}
