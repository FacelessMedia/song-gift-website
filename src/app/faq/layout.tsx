import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about our custom song creation service.",
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
