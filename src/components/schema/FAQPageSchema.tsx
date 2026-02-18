export function FAQPageSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much does it cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our regular price is $199, but we're currently offering a Valentine's Day special for $79. This includes everything you need for your personalized song."
        }
      },
      {
        "@type": "Question",
        "name": "How long does delivery take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Standard delivery is within 48 hours and is included in your purchase. For faster delivery, we offer express delivery within 24 hours for an additional $39."
        }
      },
      {
        "@type": "Question",
        "name": "How will I receive my song?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Your song will be delivered via email. You'll receive a confirmation email after checkout, and another email when your song is ready with download links."
        }
      },
      {
        "@type": "Question",
        "name": "Can I track my order?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can track your order using the Track Order page on our website. You'll need your tracking ID which is provided in your confirmation email."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a money-back guarantee?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with your song, contact us within 30 days for a full refund."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use the song commercially?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, commercial use is allowed. You retain full rights to your personalized song and can use it for any purpose, including commercial applications."
        }
      },
      {
        "@type": "Question",
        "name": "Do you support languages other than English?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, songs can be created in multiple languages. Our team supports various languages including Spanish, French, Italian, and others. Please specify your language preference when ordering."
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
