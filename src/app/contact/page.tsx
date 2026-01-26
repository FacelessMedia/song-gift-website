import { Metadata } from 'next';
import AnnouncementBar from '@/components/sections/AnnouncementBar';
import Navigation from '@/components/navigation/Navigation';
import Footer from '@/components/sections/Footer';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeading, SectionDescription } from '@/components/ui/Typography';

export const metadata: Metadata = {
  title: "Contact",
  description: "Need help with your custom song order? Contact our support team for assistance with your SongGift experience.",
};

export default function Contact() {
  return (
    <>
      <AnnouncementBar />
      <Navigation />
      
      <main>
        <SectionWrapper spacing="lg" className="min-h-[60vh]">
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeading level={1}>
              Need Help?
            </SectionHeading>
            
            <SectionDescription className="mb-12">
              We're here to help make your custom song experience perfect. Whether you have questions about your order, need assistance with the creation process, or want to learn more about our services, our support team is ready to assist you.
            </SectionDescription>

            <div className="bg-gradient-to-br from-white to-background-soft rounded-3xl shadow-soft-lg p-12 border border-white/80">
              <div className="space-y-8">
                <div>
                  <h3 className="font-heading text-2xl font-semibold text-text-main mb-4">
                    Get in Touch
                  </h3>
                  <p className="font-body text-text-muted mb-6">
                    Send us an email and we'll get back to you within 24 hours.
                  </p>
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-2xl">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    <span className="font-body text-lg font-semibold text-primary">
                      support@songgift.app
                    </span>
                  </div>
                </div>

                <div className="border-t border-primary/10 pt-8">
                  <h4 className="font-heading text-lg font-semibold text-text-main mb-4">
                    What can we help you with?
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="font-body text-text-muted">Order status and tracking</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="font-body text-text-muted">Song creation process</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="font-body text-text-muted">Revisions and changes</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="font-body text-text-muted">Technical support</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="font-body text-text-muted">Billing and payments</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="font-body text-text-muted">General questions</span>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span className="font-heading text-lg font-semibold text-text-main">
                      Quick Response Guarantee
                    </span>
                  </div>
                  <p className="font-body text-text-muted">
                    We typically respond to all inquiries within 24 hours, often much sooner. Your satisfaction is our priority.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </main>
      
      <Footer />
    </>
  );
}
