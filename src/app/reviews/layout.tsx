import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Reviews",
  description: "Listen to sample custom songs and read reviews from our happy customers.",
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
