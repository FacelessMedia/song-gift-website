import Link from 'next/link';
import { SectionWrapper } from './SectionWrapper';
import { SectionHeading } from './Typography';

interface RelatedPage {
  title: string;
  href: string;
  description: string;
}

interface RelatedPagesProps {
  title?: string;
  pages: RelatedPage[];
  className?: string;
}

export function RelatedPages({ 
  title = "Related Pages", 
  pages, 
  className = "" 
}: RelatedPagesProps) {
  return (
    <SectionWrapper spacing="md" className={className}>
      <div className="max-w-5xl mx-auto">
        <SectionHeading level={3} className="text-center mb-8 text-xl">
          {title}
        </SectionHeading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <Link 
              key={page.href}
              href={page.href}
              className="group block p-4 bg-white rounded-2xl border border-primary/10 hover:border-primary/30 hover:shadow-soft transition-all duration-200"
            >
              <h4 className="font-heading text-base font-semibold text-text-main mb-2 group-hover:text-primary transition-colors">
                {page.title}
              </h4>
              <p className="font-body text-sm text-text-muted line-clamp-2">
                {page.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
