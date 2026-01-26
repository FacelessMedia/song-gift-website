import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Custom Song",
  description: "Create your personalized custom song with our step-by-step intake process.",
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
