import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your custom song order with secure payment processing.",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
