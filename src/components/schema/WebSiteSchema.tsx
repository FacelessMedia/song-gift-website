export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SongGift",
    "url": "https://songgift.app",
    "description": "Create personalized custom songs from your love stories and memories. Professional musicians craft unique songs delivered in 24-48 hours.",
    "publisher": {
      "@type": "Organization",
      "name": "SongGift"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
