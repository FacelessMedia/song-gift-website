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
import { getSessionId } from '@/utils/sessionManager';
import { ProductSchema } from '@/components/schema/ProductSchema';
import { TrustStrip } from '@/components/ui/TrustStrip';


export default function Checkout() {
  const { intakeData, updateIntakeData, isLoaded, getFirstIncompleteStep } = useIntakeData();
  const [isIntakeComplete, setIsIntakeComplete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount_type: string;
    discount_value: number;
    discount_amount: number;
    new_amount: number;
  } | null>(null);

  // Enhanced validation functions
  const validateName = (name: string): string => {
    const trimmed = name.trim();
    if (!trimmed) return 'Full name is required';
    if (trimmed.length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const validateEmail = (email: string): string => {
    const trimmed = email.trim();
    if (!trimmed) return 'Email address is required';
    
    // RFC-style practical email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) return 'Please enter a valid email address';
    return '';
  };

  // Legacy email validation for backward compatibility
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check if contact info is complete and valid
  const isContactInfoValid = () => {
    const nameError = validateName(intakeData.fullName || '');
    const emailError = validateEmail(intakeData.email || '');
    
    // Check phone validation — E.164 format stored by PhoneInput component
    const hasValidPhone = !!(intakeData.customer_phone_e164 || intakeData.phoneNumber);
    
    return !nameError && !emailError && hasValidPhone;
  };

  // Generate personalized message
  const getPersonalizedMessage = () => {
    if (!intakeData.recipientName || !intakeData.recipientRelationship) {
      return "You're about to create a meaningful custom song.";
    }

    const name = intakeData.recipientName;
    const relationship = intakeData.recipientRelationship === 'other' 
      ? intakeData.recipientCustomRelation 
      : intakeData.recipientRelationship;

    return `You're about to create a meaningful song for your ${relationship}, ${name}.`;
  };

  // Generate Order Summary personalized message
  const getOrderSummaryMessage = () => {
    const buyerName = intakeData.fullName;
    const recipientName = intakeData.recipientName;
    const relationship = intakeData.recipientRelationship === 'other' 
      ? intakeData.recipientCustomRelation 
      : intakeData.recipientRelationship;

    // If we have buyer name, recipient name, and relationship
    if (buyerName && recipientName && relationship) {
      return `${buyerName}, you're creating a heartfelt song for your ${relationship}, ${recipientName}.`;
    }
    
    // If we have recipient name and relationship but no buyer name
    if (recipientName && relationship) {
      return `This song is being crafted especially for ${recipientName} — a beautiful gift from you.`;
    }
    
    // If we only have relationship
    if (relationship) {
      return `You're creating something meaningful for your ${relationship}.`;
    }
    
    // Fallback if no personalization data available
    return null;
  };

  useEffect(() => {
    if (isLoaded) {
      setIsIntakeComplete(!!intakeData.intakeCompletedAt);
    }
  }, [isLoaded, intakeData.intakeCompletedAt]);

  // Re-validate coupon when express delivery changes
  useEffect(() => {
    if (appliedCoupon) {
      const newAmountCents = (intakeData.expressDelivery ? 79 + 39 : 79) * 100;
      fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: appliedCoupon.code, original_amount: newAmountCents }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.valid) {
            setAppliedCoupon(prev => prev ? {
              ...prev,
              discount_amount: data.discount_amount,
              new_amount: data.new_amount,
            } : null);
          }
        })
        .catch(() => {});
    }
  }, [intakeData.expressDelivery]);

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
  
  // Calculate subtotal before coupon (in dollars for display)
  const subtotalBeforeCoupon = intakeData.expressDelivery ? discountedPrice + expressDeliveryFee : discountedPrice;
  
  // Calculate coupon discount in dollars for display
  const couponDiscountDisplay = appliedCoupon ? Math.round(appliedCoupon.discount_amount / 100) : 0;
  
  // Final total after coupon
  const finalTotal = appliedCoupon 
    ? Math.round(appliedCoupon.new_amount / 100)
    : subtotalBeforeCoupon;

  // Handle coupon apply
  const handleApplyCoupon = async () => {
    const code = couponCode.trim();
    if (!code) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    setCouponError('');

    try {
      // Calculate the amount in cents for server validation
      const amountInCents = subtotalBeforeCoupon * 100;

      const res = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, original_amount: amountInCents }),
      });

      const data = await res.json();

      if (data.valid) {
        setAppliedCoupon({
          code: data.coupon_code,
          discount_type: data.discount_type,
          discount_value: data.discount_value,
          discount_amount: data.discount_amount,
          new_amount: data.new_amount,
        });
        setCouponError('');
      } else {
        setAppliedCoupon(null);
        setCouponError(data.error || 'Invalid coupon code');
      }
    } catch {
      setCouponError('Failed to validate coupon. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  // Remove applied coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

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

    // Enhanced validation for contact information
    const nameError = validateName(intakeData.fullName || '');
    if (nameError) {
      alert(`Name validation error: ${nameError}`);
      return;
    }

    const emailError = validateEmail(intakeData.email || '');
    if (emailError) {
      alert(`Email validation error: ${emailError}`);
      return;
    }

    // Validate phone using E.164 format if available, fallback to basic validation
    const phoneToValidate = intakeData.customer_phone_e164 || intakeData.phoneNumber;
    if (!phoneToValidate || !phoneToValidate.trim()) {
      alert('Please enter your phone number before proceeding.');
      return;
    }

    // Phone was already validated by the PhoneInput component at intake time
    if (!intakeData.customer_phone_e164 && !intakeData.phoneNumber) {
      alert('Please enter a valid phone number with country code.');
      return;
    }

    setIsProcessingPayment(true);

    try {
      const sessionId = getSessionId();
      
      // Store session data on server before checkout
      const sessionDataResponse = await fetch('/api/session-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          intakeData
        }),
      });

      if (!sessionDataResponse.ok) {
        console.error('Failed to store session data:', sessionDataResponse.status);
        alert('Failed to prepare checkout. Please try again.');
        setIsProcessingPayment(false);
        return;
      }

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          email: intakeData.email,
          delivery_speed: intakeData.expressDelivery ? 'rush' : 'standard',
          coupon_code: appliedCoupon?.code || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Checkout session creation failed:', {
          status: response.status,
          statusText: response.statusText,
          error: data.error,
          details: data.details,
          sessionId,
          email: intakeData.email,
          deliverySpeed: intakeData.expressDelivery ? 'rush' : 'standard'
        });
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
            <p className="font-body text-text-muted mb-4">
              {getPersonalizedMessage()}
            </p>
            <p className="font-body text-text-muted text-sm">
              This is a beautiful gift idea — let's finish it.
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
                
                {/* Personalized Message */}
                {getOrderSummaryMessage() && (
                  <div className="mb-4 pb-4 border-b border-primary/10">
                    <p className="font-body text-text-main text-base leading-relaxed">
                      {getOrderSummaryMessage()}
                    </p>
                  </div>
                )}
                
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
                        <h3 className="font-body font-semibold text-text-main">Standard Delivery</h3>
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
                            <span className="font-body font-semibold text-text-main">Express Delivery</span>
                            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-semibold">+$39</span>
                          </div>
                          <p className="text-sm text-text-muted">
                            Get your song delivered within 24 hours instead of within 48 hours.
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

                  {/* Coupon Code Input */}
                  <div className="border-t border-primary/10 pt-4">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-body font-semibold text-green-800 text-sm">
                            {appliedCoupon.code}
                          </span>
                          <span className="font-body text-green-600 text-sm">
                            {appliedCoupon.discount_type === 'percentage'
                              ? `(${appliedCoupon.discount_value}% off)`
                              : `(-$${(appliedCoupon.discount_value / 100).toFixed(2)})`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-sm text-red-500 hover:text-red-700 font-medium cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <label className="block font-body text-sm font-medium text-text-main mb-2">
                          Have a coupon code?
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => {
                              setCouponCode(e.target.value.toUpperCase());
                              if (couponError) setCouponError('');
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                            placeholder="Enter code"
                            className="flex-1 px-3 py-2.5 text-sm border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white font-body uppercase placeholder:normal-case"
                          />
                          <button
                            type="button"
                            onClick={handleApplyCoupon}
                            disabled={couponLoading || !couponCode.trim()}
                            className="px-4 py-2.5 text-sm font-semibold font-body bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            {couponLoading ? '...' : 'Apply'}
                          </button>
                        </div>
                        {couponError && (
                          <p className="text-sm text-red-500 mt-1.5 font-body">{couponError}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Coupon Discount Line */}
                  {appliedCoupon && couponDiscountDisplay > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="font-body font-semibold text-green-700">Coupon Discount</span>
                      <span className="font-body font-semibold text-green-700">-${couponDiscountDisplay}</span>
                    </div>
                  )}
                  
                  {/* Total */}
                  <div className="border-t border-primary/10 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-heading text-lg font-semibold text-text-main">Total</span>
                      <div className="text-right">
                        {appliedCoupon && (
                          <span className="font-body text-sm text-text-muted line-through mr-2">${subtotalBeforeCoupon}</span>
                        )}
                        <span className="font-heading text-2xl font-bold text-primary">${finalTotal}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Trust Strip */}
                <div className="mt-4 pt-4 border-t border-primary/10">
                  <TrustStrip variant="compact" />
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
      
      {/* Product Schema */}
      <ProductSchema 
        name="Custom Song Gift - Checkout"
        description="Complete your custom song order. Professional musicians will create your personalized song and deliver it via email in 24-48 hours."
      />
    </>
  );
}
