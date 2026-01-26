import { Metadata } from 'next';
import AnnouncementBar from '@/components/sections/AnnouncementBar';
import Navigation from '@/components/navigation/Navigation';
import Footer from '@/components/sections/Footer';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeading, SectionDescription } from '@/components/ui/Typography';

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Read the terms and conditions for using SongGift's custom song creation services.",
};

export default function Terms() {
  return (
    <>
      <AnnouncementBar />
      <Navigation />
      
      <main>
        <SectionWrapper spacing="lg">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <SectionHeading level={1}>
                Terms & Conditions
              </SectionHeading>
              
              <SectionDescription>
                Please read these terms carefully before using our custom song creation services.
              </SectionDescription>
              
              <p className="font-body text-text-muted mt-4">
                Last updated: January 26, 2025
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="space-y-12">
                <section>
                  <h2 className="font-heading text-2xl font-semibold text-text-main mb-6">
                    Acceptance of Terms
                  </h2>
                  <div className="space-y-4 font-body text-text-muted leading-relaxed">
                    <p>
                      By accessing and using SongGift's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                    </p>
                    <p>
                      These terms apply to all visitors, users, and others who access or use our custom song creation services.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="font-heading text-2xl font-semibold text-text-main mb-6">
                    Service Description
                  </h2>
                  <div className="space-y-4 font-body text-text-muted leading-relaxed">
                    <p>
                      SongGift provides custom song creation services where professional musicians create personalized songs based on your specifications, memories, and preferences.
                    </p>
                    <p>
                      Our services include songwriting, recording, mixing, mastering, and digital delivery of your custom song, along with additional features as described on our website.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="font-heading text-2xl font-semibold text-text-main mb-6">
                    Order Process and Payment
                  </h2>
                  <div className="space-y-4 font-body text-text-muted leading-relaxed">
                    <p>
                      When you place an order, you agree to provide accurate and complete information about your song requirements. Payment is required at the time of order placement.
                    </p>
                    <p>
                      All prices are in USD and include the services specified in your selected package. Additional services may be available for an extra fee.
                    </p>
                    <p>
                      We reserve the right to refuse or cancel orders at our discretion, including but not limited to cases where content violates our content guidelines.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="font-heading text-2xl font-semibold text-text-main mb-6">
                    Content Guidelines
                  </h2>
                  <div className="space-y-4 font-body text-text-muted leading-relaxed">
                    <p>
                      You agree that your song content will not include material that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.
                    </p>
                    <p>
                      We reserve the right to refuse to create songs with content that violates these guidelines or applicable laws.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="font-heading text-2xl font-semibold text-text-main mb-6">
                    Intellectual Property Rights
                  </h2>
                  <div className="space-y-4 font-body text-text-muted leading-relaxed">
                    <p>
                      Upon full payment, you will own the rights to your custom song for personal use. This includes the right to share, gift, and enjoy your song privately.
                    </p>
                    <p>
                      Commercial use, distribution, or resale of the song requires separate licensing agreements. SongGift retains certain rights for portfolio and promotional purposes.
                    </p>
                    <p>
                      You warrant that any content you provide does not infringe on the intellectual property rights of others.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="font-heading text-2xl font-semibold text-text-main mb-6">
                    Delivery and Revisions
                  </h2>
                  <div className="space-y-4 font-body text-text-muted leading-relaxed">
                    <p>
                      We aim to deliver your custom song within the timeframe specified in your order. Delivery times may vary based on complexity and current order volume.
                    </p>
                    <p>
                      We offer unlimited revisions to ensure your satisfaction with the final product. However, major changes to the song concept may require additional fees.
                    </p>
                    <p>
                      Songs are delivered digitally in high-quality formats. Physical delivery options may be available for an additional fee.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="font-heading text-2xl font-semibold text-text-main mb-6">
                    Refund Policy
                  </h2>
                  <div className="space-y-4 font-body text-text-muted leading-relaxed">
                    <p>
                      We offer a satisfaction guarantee. If you're not completely satisfied with your custom song after all revisions, we will provide a full refund.
                    </p>
                    <p>
                      Refund requests must be made within 30 days of final delivery. Refunds will be processed using the original payment method within 5-10 business days.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="font-heading text-2xl font-semibold text-text-main mb-6">
                    Limitation of Liability
                  </h2>
                  <div className="space-y-4 font-body text-text-muted leading-relaxed">
                    <p>
                      SongGift's liability is limited to the amount paid for the specific service. We are not liable for any indirect, incidental, or consequential damages.
                    </p>
                    <p>
                      We make no warranties about the uninterrupted or error-free operation of our services, though we strive to provide the highest quality experience.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="font-heading text-2xl font-semibold text-text-main mb-6">
                    Privacy and Data Protection
                  </h2>
                  <div className="space-y-4 font-body text-text-muted leading-relaxed">
                    <p>
                      Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
                    </p>
                    <p>
                      We implement appropriate security measures to protect your personal and payment information.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="font-heading text-2xl font-semibold text-text-main mb-6">
                    Changes to Terms
                  </h2>
                  <div className="space-y-4 font-body text-text-muted leading-relaxed">
                    <p>
                      We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website.
                    </p>
                    <p>
                      Your continued use of our services after any changes constitutes acceptance of the new terms.
                    </p>
                  </div>
                </section>

                <section className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8">
                  <h2 className="font-heading text-2xl font-semibold text-text-main mb-4">
                    Contact Information
                  </h2>
                  <p className="font-body text-text-muted leading-relaxed">
                    If you have any questions about these Terms & Conditions, please contact us at{' '}
                    <span className="font-semibold text-primary">legal@songgift.app</span> or through our Contact page.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </main>
      
      <Footer />
    </>
  );
}
