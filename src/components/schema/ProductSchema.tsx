interface ProductSchemaProps {
  name?: string;
  description?: string;
}

export function ProductSchema({ 
  name = "Custom Song Gift",
  description = "A personalized song created from your love story and memories by professional musicians. Delivered digitally in 24-48 hours."
}: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "brand": {
      "@type": "Brand",
      "name": "SongGift"
    },
    "category": "Digital Music",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": "79",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "SongGift"
      },
      "validFrom": new Date().toISOString(),
      "priceValidUntil": "2026-12-31"
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Delivery Time",
        "value": "24-48 hours"
      },
      {
        "@type": "PropertyValue",
        "name": "Express Upgrade",
        "value": "+$39 for 12-24 hours"
      },
      {
        "@type": "PropertyValue",
        "name": "Digital Delivery",
        "value": "Email"
      },
      {
        "@type": "PropertyValue",
        "name": "Guarantee",
        "value": "30 days money-back"
      },
      {
        "@type": "PropertyValue",
        "name": "Commercial Use",
        "value": "Allowed"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
