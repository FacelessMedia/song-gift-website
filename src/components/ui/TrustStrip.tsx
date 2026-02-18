// Using simple SVG icons instead of lucide-react to avoid dependency issues
const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Clock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Shield = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const Mail = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

interface TrustStripProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export function TrustStrip({ className = "", variant = "default" }: TrustStripProps) {
  const trustItems = [
    {
      icon: Clock,
      text: "24–48 hour delivery"
    },
    {
      icon: Shield,
      text: "30-day money-back guarantee"
    },
    {
      icon: CheckCircle,
      text: "Secure checkout"
    },
    {
      icon: Mail,
      text: "Digital delivery via email"
    }
  ];

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap justify-center gap-4 text-xs text-text-muted ${className}`}>
        {trustItems.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <item.icon className="w-3 h-3 text-primary" />
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`bg-background-soft border border-primary/10 rounded-xl p-4 ${className}`}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {trustItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <item.icon className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium text-text-main">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
