import { Metadata } from 'next';
import AnnouncementBar from '@/components/sections/AnnouncementBar';
import Navigation from '@/components/navigation/Navigation';
import Footer from '@/components/sections/Footer';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeading, SectionDescription } from '@/components/ui/Typography';

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how SongGift protects your privacy and handles your personal information when creating custom songs.",
};

export default function PrivacyPolicy() {
  return (
    <>
      <AnnouncementBar />
      <Navigation />
      
      <main>
        <SectionWrapper spacing="lg">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <SectionHeading level={1}>
                Privacy Policy
              </SectionHeading>
              
              <SectionDescription>
                Your privacy is important to us. This policy explains how we collect, use, and protect your information.
              </SectionDescription>
              
              <p className="font-body text-text-muted mt-4">
                Last updated: January 26, 2025
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="space-y-12">
                <section>
                  <h2 className="font-heading text-2xl font-semibold text-text-main mb-6">
                    Information We Collect
                  </h2>
                  <div className="space-y-4 font-body text-text-muted leading-relaxed">
                    <p>
                      We collect information you provide directly to us, such as when you create an account, place an order, or contact us for support. This may include your name, email address, payment information, and details about your custom song request.
                    </p>
                    <p>
                      We also automatically collect certain information about your device and how you interact with our services, including your IP address, browser type, and usage patterns to improve our services.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="font-heading text-2xl font-semibold text-text-main mb-6">
                    How We Use Your Information
                  </h2>
                  <div className="space-y-4 font-body text-text-muted leading-relaxed">
                    <p>
                      We use the information we collect to provide, maintain, and improve our services, including creating your custom songs, processing payments, and communicating with you about your orders.
                    </p>
                    <p>
                      We may also use your information to send you updates about our services, respond to your inquiries, and ensure the security of our platform.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="font-heading text-2xl font-semibold text-text-main mb-6">
                    Information Sharing
                  </h2>
                  <div className="space-y-4 font-body text-text-muted leading-relaxed">
                    <p>
                      We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.
                    </p>
                    <p>
                      We may share your information with trusted service providers who assist us in operating our website and conducting our business, provided they agree to keep your information confidential.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="font-heading text-2xl font-semibold text-text-main mb-6">
                    Data Security
                  </h2>
                  <div className="space-y-4 font-body text-text-muted leading-relaxed">
                    <p>
                      We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption of sensitive data and regular security assessments.
                    </p>
                    <p>
                      However, no method of transmission over the internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="font-heading text-2xl font-semibold text-text-main mb-6">
                    Your Rights
                  </h2>
                  <div className="space-y-4 font-body text-text-muted leading-relaxed">
                    <p>
                      You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us at any time.
                    </p>
                    <p>
                      If you have any questions about your privacy rights or wish to exercise them, please contact us using the information provided in our Contact section.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="font-heading text-2xl font-semibold text-text-main mb-6">
                    Cookies and Tracking
                  </h2>
                  <div className="space-y-4 font-body text-text-muted leading-relaxed">
                    <p>
                      We use cookies and similar tracking technologies to enhance your experience on our website, analyze usage patterns, and provide personalized content.
                    </p>
                    <p>
                      You can control cookie settings through your browser preferences, though disabling cookies may affect some functionality of our services.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="font-heading text-2xl font-semibold text-text-main mb-6">
                    Changes to This Policy
                  </h2>
                  <div className="space-y-4 font-body text-text-muted leading-relaxed">
                    <p>
                      We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
                    </p>
                    <p>
                      Your continued use of our services after any changes indicates your acceptance of the updated policy.
                    </p>
                  </div>
                </section>

                <section className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8">
                  <h2 className="font-heading text-2xl font-semibold text-text-main mb-4">
                    Questions?
                  </h2>
                  <p className="font-body text-text-muted leading-relaxed">
                    If you have any questions about this Privacy Policy or our data practices, please contact us at{' '}
                    <span className="font-semibold text-primary">privacy@songgift.app</span> or through our Contact page.
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
