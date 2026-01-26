'use client';

import { Button } from '@/components/ui/Button';

export default function UseCaseGrid() {
  const useCases = [
    {
      title: "Wedding Songs",
      description: "Celebrate your special day with a custom song that tells your love story",
      category: "Romance"
    },
    {
      title: "Anniversary Gifts",
      description: "Mark milestone moments with personalized music that captures your journey together",
      category: "Romance"
    },
    {
      title: "Birthday Surprises",
      description: "Create unforgettable birthday memories with a song made just for them",
      category: "Celebration"
    },
    {
      title: "Memorial Tributes",
      description: "Honor loved ones with beautiful musical tributes that celebrate their life",
      category: "Memorial"
    },
    {
      title: "Baby Announcements",
      description: "Welcome your little one with a custom lullaby that tells their story",
      category: "Family"
    },
    {
      title: "Graduation Songs",
      description: "Celebrate achievements and new beginnings with inspiring personalized music",
      category: "Celebration"
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-background-soft via-background-main to-background-soft">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-text-main mb-6">
            Perfect for Every Occasion
          </h2>
          <p className="font-serif text-xl md:text-2xl text-text-muted max-w-3xl mx-auto leading-relaxed">
            From life's biggest moments to everyday celebrations.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {useCases.slice(0, 4).map((useCase, index) => (
            <div key={index} className="group text-center">
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl mb-4 flex items-center justify-center overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300">
                <div className="text-primary/60">
                  <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <span className="inline-block bg-primary/10 text-primary font-body font-semibold px-3 py-1 rounded-full text-xs mb-2">
                  {useCase.category}
                </span>
                <h3 className="font-heading text-base font-bold text-text-main mb-2 group-hover:text-primary transition-colors">
                  {useCase.title}
                </h3>
                <p className="font-body text-xs text-text-muted leading-relaxed">
                  {useCase.description.split('.')[0]}.
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
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
    </section>
  );
}
