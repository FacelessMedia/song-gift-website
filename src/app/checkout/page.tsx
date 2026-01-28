'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Metadata } from 'next';
import AnnouncementBar from '@/components/sections/AnnouncementBar';
import Navigation from '@/components/navigation/Navigation';
import Footer from '@/components/sections/Footer';
import { Button } from '@/components/ui/Button';
import { SongDetailsModal } from '@/components/ui/SongDetailsModal';
import { useIntakeData } from '@/hooks/useIntakeData';


export default function Checkout() {
  const { intakeData, updateIntakeData, isLoaded, getFirstIncompleteStep } = useIntakeData();
  const [isIntakeComplete, setIsIntakeComplete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      setIsIntakeComplete(!!intakeData.intakeCompletedAt);
    }
  }, [isLoaded, intakeData.intakeCompletedAt]);

  // Show loading state while data is being loaded
  if (!isLoaded) {
    return (
      <>
        <AnnouncementBar />
        <Navigation />
        <main className="min-h-screen bg-background-soft flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="font-body text-text-muted">Loading your song details...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Redirect to intake if not completed
  if (!isIntakeComplete) {
    const firstIncompleteStep = getFirstIncompleteStep();
    
    return (
      <>
        <AnnouncementBar />
        <Navigation />
        <main className="min-h-screen bg-background-soft">
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <h1 className="font-heading text-3xl font-bold text-text-main mb-4">
              Complete Your Song Details First
            </h1>
            <p className="font-body text-text-muted mb-8">
              Please complete step {firstIncompleteStep} of the intake process to proceed to checkout.
            </p>
            <div className="space-y-4">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => {
                  // Store the target step in sessionStorage for the intake flow to pick up
                  sessionStorage.setItem('targetStep', firstIncompleteStep.toString());
                  window.location.href = '/create';
                }}
              >
                Continue to Step {firstIncompleteStep}
              </Button>
              <Button 
                variant="outline" 
                size="md"
                onClick={() => window.location.href = '/create'}
              >
                Start from Beginning
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const basePrice = 199;
  const discountedPrice = 79;
  const expressDeliveryFee = 39;
  const savings = basePrice - discountedPrice;
  
  // Calculate final total based on express delivery selection
  const finalTotal = intakeData.expressDelivery ? discountedPrice + expressDeliveryFee : discountedPrice;

  // Calculate delivery dates dynamically
  const getDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    
    if (intakeData.expressDelivery) {
      deliveryDate.setDate(today.getDate() + 1); // Today + 1 day
    } else {
      deliveryDate.setDate(today.getDate() + 2); // Today + 2 days
    }
    
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle Stripe checkout
  const handleCheckout = async () => {
    if (!isIntakeComplete) return;

    setIsProcessingPayment(true);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'customer@example.com', // TODO: Get from user input
          delivery_speed: intakeData.expressDelivery ? 'rush' : 'standard',
          intake_payload: intakeData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;

    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to process checkout. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  return (
    <>
      {/* Top announcement bar */}
      <AnnouncementBar />
      
      {/* Sticky navigation bar */}
      <Navigation />
      
      <main className="min-h-screen bg-background-soft">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="font-heading text-3xl font-bold text-text-main mb-2">
              Complete Your Order
            </h1>
            <p className="font-body text-text-muted">
              Review your song details and complete your purchase
            </p>
            
            {/* Back to Intake Button */}
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // Navigate back to the last step of intake
                  sessionStorage.setItem('targetStep', '5');
                  window.location.href = '/create';
                }}
              >
                ← Back to Song Details
              </Button>
            </div>
          </div>

          {/* Two-column layout on desktop, single column on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT COLUMN: Complete Your Order + 100% Satisfaction Guarantee */}
            <div className="space-y-6 order-1 lg:order-1">
              {/* Payment Section */}
              <div className="bg-white rounded-2xl shadow-soft border border-primary/10 p-6">
                <h2 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Complete Your Order
                </h2>
                
                <div className="space-y-4">
                  {/* Secure Payment Placeholder */}
                  <div className="bg-gradient-to-br from-background-soft to-primary/5 rounded-xl p-8 border border-primary/10 text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-text-main mb-2">
                      Secure payment coming next
                    </h3>
                    <p className="font-body text-text-muted text-sm">
                      Payment processing will be integrated soon to complete your custom song order.
                    </p>
                  </div>

                  {/* Trust Signals */}
                  <div className="grid grid-cols-1 gap-3 mb-4">
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <span className="font-body font-semibold text-text-main text-sm">30-day money-back guarantee</span>
                        <p className="text-xs text-text-muted">Not satisfied? Get a full refund</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <span className="font-body font-semibold text-text-main text-sm">Commercial use included</span>
                        <p className="text-xs text-text-muted">Use your song for business purposes</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <span className="font-body font-semibold text-text-main text-sm">Delivered via email</span>
                        <p className="text-xs text-text-muted">High-quality audio files sent directly</p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    variant="primary" 
                    size="lg" 
                    fullWidth
                    disabled={!isIntakeComplete || isProcessingPayment}
                    className={(!isIntakeComplete || isProcessingPayment) ? "opacity-50 cursor-not-allowed" : ""}
                    onClick={handleCheckout}
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      `Complete My Order - $${finalTotal}`
                    )}
                  </Button>
                </div>
              </div>

              {/* Guarantee */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L3.09 8.26L4 21L12 17L20 21L20.91 8.26L12 2Z" />
                    </svg>
                  </div>
                  <h3 className="font-heading font-semibold text-text-main mb-2">
                    100% Satisfaction Guarantee
                  </h3>
                  <p className="font-body text-text-muted text-sm">
                    If you're not completely happy with your custom song, we'll work with you until it's perfect.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Order Summary + Your Song Details */}
            <div className="space-y-6 order-2 lg:order-2">
              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-soft border border-primary/10 p-6">
                <h2 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Order Summary
                </h2>
                
                <div className="space-y-4">
                  {/* Product */}
                  <div className="flex justify-between items-center">
                    <span className="font-body text-text-main">Custom Song – Valentine's Edition</span>
                    <span className="font-body text-text-muted line-through">${basePrice}</span>
                  </div>
                  
                  {/* Discount */}
                  <div className="flex justify-between items-center">
                    <span className="font-body font-semibold text-primary">Valentine's Day Discount</span>
                    <span className="font-body font-semibold text-primary">-${savings}</span>
                  </div>

                  {/* Express Delivery Upsell */}
                  <div className="border-t border-primary/10 pt-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-body font-semibold text-text-main">Standard Delivery (24–48 hours)</h3>
                        <p className="text-sm text-text-muted">Expected song delivery by: {getDeliveryDate()}</p>
                      </div>
                      <span className="font-body text-text-main">Free</span>
                    </div>
                    
                    {/* Express Delivery Upsell */}
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={intakeData.expressDelivery}
                          onChange={(e) => updateIntakeData('expressDelivery', e.target.checked)}
                          className="mt-1 w-5 h-5 text-primary border-primary/30 rounded focus:ring-2 focus:ring-primary focus:ring-offset-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-body font-semibold text-text-main">Express Delivery (12–24 hours)</span>
                            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-semibold">+$39</span>
                          </div>
                          <p className="text-sm text-text-muted">
                            Get your song delivered within 12–24 hours instead of 24–48 hours.
                          </p>
                          {intakeData.expressDelivery && (
                            <p className="text-sm text-primary font-semibold mt-2">
                              ⚡ Express delivery selected - Expected by: {getDeliveryDate()}
                            </p>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  {/* Express Delivery Fee (if selected) */}
                  {intakeData.expressDelivery && (
                    <div className="flex justify-between items-center">
                      <span className="font-body text-text-main">Express Delivery</span>
                      <span className="font-body text-text-main">+${expressDeliveryFee}</span>
                    </div>
                  )}
                  
                  {/* Total */}
                  <div className="border-t border-primary/10 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-heading text-lg font-semibold text-text-main">Total</span>
                      <span className="font-heading text-2xl font-bold text-primary">${finalTotal}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Your Song Details */}
              <div className="bg-white rounded-2xl shadow-soft border border-primary/10 p-6">
                <h2 className="font-heading text-xl font-semibold text-text-main mb-4">
                  Your Song Details
                </h2>
                
                {/* Recipient Information */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-body font-semibold text-text-main mb-2">Song Recipient</h3>
                    <p className="font-body text-text-muted">
                      {intakeData.recipientName}
                      {intakeData.recipientNamePronunciation && (
                        <span className="text-sm"> ({intakeData.recipientNamePronunciation})</span>
                      )}
                    </p>
                    <p className="font-body text-text-muted text-sm">
                      {intakeData.recipientRelationship === 'other' 
                        ? intakeData.recipientCustomRelation 
                        : intakeData.recipientRelationship}
                    </p>
                  </div>

                  {/* Language Preferences */}
                  <div>
                    <h3 className="font-body font-semibold text-text-main mb-2">Language</h3>
                    <p className="font-body text-text-muted">
                      {intakeData.primaryLanguage} 
                      {intakeData.languageStyle === 'bilingual-blend' && intakeData.secondaryLanguage && (
                        <span> & {intakeData.secondaryLanguage} (bilingual blend)</span>
                      )}
                    </p>
                  </div>

                  {/* Music Style */}
                  <div>
                    <h3 className="font-body font-semibold text-text-main mb-2">Music Style</h3>
                    <p className="font-body text-text-muted">
                      {intakeData.musicStyle.join(', ')}
                    </p>
                  </div>

                  {/* Emotional Vibe */}
                  <div>
                    <h3 className="font-body font-semibold text-text-main mb-2">Emotional Vibe</h3>
                    <p className="font-body text-text-muted">
                      {intakeData.emotionalVibe.join(', ')}
                    </p>
                  </div>

                  {/* Voice Preference */}
                  <div>
                    <h3 className="font-body font-semibold text-text-main mb-2">Voice Preference</h3>
                    <p className="font-body text-text-muted">
                      {intakeData.voicePreference}
                    </p>
                  </div>

                  {/* Core Message Preview */}
                  <div>
                    <h3 className="font-body font-semibold text-text-main mb-2">Heart's Message</h3>
                    <div className="bg-background-soft p-4 rounded-xl">
                      <p className="font-body text-text-muted text-sm italic">
                        "{intakeData.coreMessage.substring(0, 150)}
                        {intakeData.coreMessage.length > 150 ? '...' : ''}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="mt-6 pt-4 border-t border-primary/10">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsModalOpen(true)}
                  >
                    View or Edit Your Song Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Song Details Modal */}
      <SongDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
