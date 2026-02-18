'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import AnnouncementBar from '@/components/sections/AnnouncementBar';
import Navigation from '@/components/navigation/Navigation';
import { ProgressHeader, StepContainer, OptionButton, NavigationFooter } from '@/components/ui/intake';
import { useIntakeData } from '@/hooks/useIntakeData';
import PhoneInputComponent from '@/components/ui/PhoneInput';
import { ProductSchema } from '@/components/schema/ProductSchema';
import { TrustStrip } from '@/components/ui/TrustStrip';

// Note: This is a client component, so metadata should be handled in layout.tsx or a parent server component
export default function CreateSong() {
  const [currentStep, setCurrentStep] = useState(1);
  const { intakeData, updateIntakeData, updateMultiSelectData, completeIntake, isLoaded, getFirstIncompleteStep } = useIntakeData();
  
  // Validation state for Step 6
  const [validationErrors, setValidationErrors] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [phoneValidation, setPhoneValidation] = useState({
    isValid: false,
    e164: '',
    display: '',
    country: ''
  });

  // Check for target step from sessionStorage (when redirected from checkout)
  useEffect(() => {
    const targetStep = sessionStorage.getItem('targetStep');
    if (targetStep && isLoaded) {
      const stepNumber = parseInt(targetStep, 10);
      if (stepNumber >= 1 && stepNumber <= 6) {
        setCurrentStep(stepNumber);
      }
      sessionStorage.removeItem('targetStep'); // Clean up
    }
  }, [isLoaded]);

  const totalSteps = 6;

  // Validation functions
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

  const validatePhone = (): string => {
    if (!phoneValidation.isValid) return 'Please enter a valid phone number';
    return '';
  };

  // Handle field validation on blur
  const handleFieldBlur = (field: 'fullName' | 'email' | 'phone') => {
    const errors = { ...validationErrors };
    
    switch (field) {
      case 'fullName':
        errors.fullName = validateName(intakeData.fullName);
        break;
      case 'email':
        errors.email = validateEmail(intakeData.email);
        break;
      case 'phone':
        errors.phone = validatePhone();
        break;
    }
    
    setValidationErrors(errors);
  };

  // Handle phone validation changes
  const handlePhoneValidation = (isValid: boolean, e164?: string, display?: string, country?: string) => {
    setPhoneValidation({
      isValid,
      e164: e164 || '',
      display: display || '',
      country: country || ''
    });

    // Update intake data with enhanced phone fields
    if (isValid && e164 && display && country) {
      updateIntakeData('customer_phone_e164', e164);
      updateIntakeData('customer_phone_display', display);
      updateIntakeData('customer_phone_country', country);
    }

    // Clear phone error if valid
    if (isValid && validationErrors.phone) {
      setValidationErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  // Helper function to generate personalized text based on step and recipient data
  const getPersonalizedText = (step: number) => {
    if (!intakeData.recipientName || !intakeData.recipientRelationship || step === 1) {
      return null;
    }

    const name = intakeData.recipientName;
    const relationship = intakeData.recipientRelationship === 'other' 
      ? intakeData.recipientCustomRelation 
      : intakeData.recipientRelationship;

    switch (step) {
      case 2:
        return `You're creating something special for your ${relationship}, ${name}.`;
      case 3:
        return `${name} is lucky to have someone putting this much thought into a song.`;
      case 4:
        return `Let's capture what makes ${name} so special to you.`;
      case 5:
        return `This is where your heart speaks directly to ${name}.`;
      case 6:
        return `Almost ready to create ${name}'s special song — just need your details.`;
      default:
        return null;
    }
  };

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
      </>
    );
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark intake as completed and redirect to checkout
      completeIntake();
      
      // Redirect to checkout
      window.location.href = '/checkout';
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return intakeData.recipientRelationship !== '' && 
               intakeData.recipientName.trim() !== '' && 
               intakeData.songPerspective !== '' &&
               intakeData.gender !== '' &&
               (intakeData.gender !== 'other' || intakeData.genderCustom.trim() !== '') &&
               (intakeData.recipientRelationship !== 'other' || intakeData.recipientCustomRelation.trim() !== '');
      case 2:
        return intakeData.primaryLanguage !== '' && 
               intakeData.languageStyle !== '' &&
               (intakeData.languageStyle === '100-primary' || intakeData.secondaryLanguage !== '');
      case 3:
        return intakeData.musicStyle.length > 0 && 
               intakeData.emotionalVibe.length > 0 && 
               intakeData.voicePreference !== '' &&
               (!intakeData.musicStyle.includes('other') || intakeData.musicStyleCustom.trim() !== '') &&
               (!intakeData.emotionalVibe.includes('other') || intakeData.emotionalVibeCustom.trim() !== '');
      case 4:
        return intakeData.recipientQualities.trim() !== '' && 
               intakeData.sharedMemories.trim() !== '';
      case 5:
        return intakeData.coreMessage.trim() !== '';
      case 6:
        // Enhanced validation for Step 6
        const nameError = validateName(intakeData.fullName || '');
        const emailError = validateEmail(intakeData.email || '');
        const phoneError = validatePhone();
        
        return !nameError && !emailError && !phoneError && phoneValidation.isValid;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepContainer
            title="Who is this song meant to move?"
            subtitle="Who is this song for — whose heart are you hoping to touch when they hear it?"
          >
            <div className="space-y-6">
              {/* Recipient Relationship */}
              <div>
                <label className="block font-body font-semibold text-text-main mb-3">
                  What is your relationship to them? <span className="text-primary">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: 'husband', label: 'Husband' },
                    { value: 'wife', label: 'Wife' },
                    { value: 'daughter', label: 'Daughter' },
                    { value: 'mother', label: 'Mother' },
                    { value: 'father', label: 'Father' },
                    { value: 'spouse', label: 'Spouse' },
                    { value: 'partner', label: 'Partner' },
                    { value: 'son', label: 'Son' },
                    { value: 'friend', label: 'Friend' },
                    { value: 'myself', label: 'Myself' },
                    { value: 'other', label: 'Other' }
                  ].map((option) => (
                    <OptionButton
                      key={option.value}
                      value={option.value}
                      label={option.label}
                      isSelected={intakeData.recipientRelationship === option.value}
                      onClick={(value) => updateIntakeData('recipientRelationship', value)}
                    />
                  ))}
                </div>
              </div>

              {/* Custom Relationship (conditional) */}
              {intakeData.recipientRelationship === 'other' && (
                <div>
                  <label htmlFor="custom-relation" className="block font-body font-semibold text-text-main mb-3">
                    Please specify your relationship <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    id="custom-relation"
                    value={intakeData.recipientCustomRelation}
                    onChange={(e) => updateIntakeData('recipientCustomRelation', e.target.value)}
                    placeholder="e.g., Grandmother, Best Friend, etc."
                    className="w-full px-4 py-3 text-base border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-soft"
                  />
                </div>
              )}

              {/* Recipient Name */}
              <div>
                <label htmlFor="recipient-name" className="block font-body font-semibold text-text-main mb-3">
                  What is their name? <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  id="recipient-name"
                  value={intakeData.recipientName}
                  onChange={(e) => updateIntakeData('recipientName', e.target.value)}
                  placeholder="Enter their name"
                  className="w-full px-4 py-3 text-base border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-soft"
                  required
                />
              </div>

              {/* Name Pronunciation (optional) */}
              <div>
                <label htmlFor="name-pronunciation" className="block font-body font-semibold text-text-main mb-3">
                  How do you pronounce their name? <span className="text-text-muted text-sm font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  id="name-pronunciation"
                  value={intakeData.recipientNamePronunciation}
                  onChange={(e) => updateIntakeData('recipientNamePronunciation', e.target.value)}
                  placeholder="e.g., Sarah (SAIR-uh) or leave blank if obvious"
                  className="w-full px-4 py-3 text-base border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-soft"
                />
                <p className="text-sm text-text-muted mt-2">
                  This helps our musicians sing their name correctly in the song.
                </p>
              </div>

              {/* Song Perspective */}
              <div>
                <label className="block font-body font-semibold text-text-main mb-3">
                  From whose perspective should the song be written? <span className="text-primary">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: 'from-me', label: 'From me' },
                    { value: 'from-our-family', label: 'From our family' },
                    { value: 'from-our-children', label: 'From our children' },
                    { value: 'other', label: 'Other' }
                  ].map((option) => (
                    <OptionButton
                      key={option.value}
                      value={option.value}
                      label={option.label}
                      isSelected={intakeData.songPerspective === option.value}
                      onClick={(value) => updateIntakeData('songPerspective', value)}
                    />
                  ))}
                </div>

                {/* Custom Perspective (conditional) */}
                {intakeData.songPerspective === 'other' && (
                  <div className="mt-4">
                    <label htmlFor="custom-perspective" className="block font-body font-semibold text-text-main mb-3">
                      Please specify the perspective <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      id="custom-perspective"
                      value={intakeData.songPerspectiveCustom}
                      onChange={(e) => updateIntakeData('songPerspectiveCustom', e.target.value)}
                      placeholder="e.g. From our grandparents, From their children, From my future self"
                      className="w-full px-4 py-3 text-base border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-soft"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block font-body font-semibold text-text-main mb-3">
                  What is their gender? <span className="text-primary">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'prefer-not-to-say', label: 'Prefer not to say' },
                    { value: 'other', label: 'Other' }
                  ].map((option) => (
                    <OptionButton
                      key={option.value}
                      value={option.value}
                      label={option.label}
                      isSelected={intakeData.gender === option.value}
                      onClick={(value) => {
                        updateIntakeData('gender', value);
                        if (value !== 'other') {
                          updateIntakeData('genderCustom', '');
                        }
                      }}
                    />
                  ))}
                </div>

                {/* Custom Gender (conditional) */}
                {intakeData.gender === 'other' && (
                  <div className="mt-4">
                    <label htmlFor="custom-gender" className="block font-body font-semibold text-text-main mb-3">
                      Please specify <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      id="custom-gender"
                      value={intakeData.genderCustom}
                      onChange={(e) => updateIntakeData('genderCustom', e.target.value)}
                      placeholder="Enter your gender"
                      className="w-full px-4 py-3 text-base border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-soft"
                      required
                    />
                  </div>
                )}
              </div>
            </div>
          </StepContainer>
        );

      case 2:
        return (
          <StepContainer
            title="What language should their heart hear this in?"
            subtitle="What language would feel most natural and meaningful for them to hear this song in?"
          >
            {getPersonalizedText(2) && (
              <div className="mb-4 px-4 py-3 bg-primary/5 rounded-xl border border-primary/10">
                <p className="text-sm font-body text-primary font-medium text-center">
                  {getPersonalizedText(2)}
                </p>
              </div>
            )}
            <div className="space-y-6">
              {/* Primary Language */}
              <div>
                <label htmlFor="primary-language" className="block font-body font-semibold text-text-main mb-3">
                  Primary language <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  id="primary-language"
                  value={intakeData.primaryLanguage}
                  onChange={(e) => updateIntakeData('primaryLanguage', e.target.value)}
                  placeholder="e.g., English, Spanish, French, etc."
                  className="w-full px-4 py-2.5 text-base border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-soft"
                  required
                />
              </div>

              {/* Language Style */}
              <div>
                <label className="block font-body font-semibold text-text-main mb-3">
                  Language style <span className="text-primary">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    { value: '100-primary', label: '100% Primary' },
                    { value: 'mostly-primary', label: 'Mostly Primary with Some Secondary' },
                    { value: 'bilingual-blend', label: 'Bilingual Blend' }
                  ].map((option) => (
                    <OptionButton
                      key={option.value}
                      value={option.value}
                      label={option.label}
                      isSelected={intakeData.languageStyle === option.value}
                      onClick={(value) => updateIntakeData('languageStyle', value)}
                      className="p-3"
                    />
                  ))}
                </div>
              </div>

              {/* Secondary Language (conditional) */}
              {(intakeData.languageStyle === 'mostly-primary' || intakeData.languageStyle === 'bilingual-blend') && (
                <div>
                  <label htmlFor="secondary-language" className="block font-body font-semibold text-text-main mb-3">
                    Secondary language <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    id="secondary-language"
                    value={intakeData.secondaryLanguage}
                    onChange={(e) => updateIntakeData('secondaryLanguage', e.target.value)}
                    placeholder="e.g., English, Spanish, French, etc."
                    className="w-full px-4 py-2.5 text-base border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-soft"
                    required
                  />
                </div>
              )}

              {/* Language Specific Phrases (optional) */}
              <div>
                <label htmlFor="language-phrases" className="block font-body font-semibold text-text-main mb-3">
                  Special phrases or words <span className="text-text-muted text-sm font-normal">(optional)</span>
                </label>
                <textarea
                  id="language-phrases"
                  value={intakeData.languageSpecificPhrases}
                  onChange={(e) => updateIntakeData('languageSpecificPhrases', e.target.value)}
                  placeholder="Any specific phrases, nicknames, or words in their language that would make the song more meaningful..."
                  rows={4}
                  className="w-full px-4 py-3 text-base border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-soft resize-none"
                />
                <p className="text-sm text-text-muted mt-2">
                  Include any special terms of endearment, cultural phrases, or meaningful words.
                </p>
              </div>
            </div>
          </StepContainer>
        );

      case 3:
        return (
          <StepContainer
            title="How should this song feel when it plays?"
            subtitle="When they hear this song, what kind of sound or atmosphere do you imagine?"
          >
            {getPersonalizedText(3) && (
              <div className="mb-4 px-4 py-3 bg-primary/5 rounded-xl border border-primary/10">
                <p className="text-sm font-body text-primary font-medium text-center">
                  {getPersonalizedText(3)}
                </p>
              </div>
            )}
            <div className="space-y-6">
              {/* Music Style (multi-select) */}
              <div>
                <label className="block font-body font-semibold text-text-main mb-3">
                  Music style <span className="text-primary">*</span> <span className="text-text-muted text-sm font-normal">(select all that apply)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'worship', label: 'Worship' },
                    { value: 'acoustic', label: 'Acoustic' },
                    { value: 'pop', label: 'Pop' },
                    { value: 'rap-spoken-word', label: 'Rap / Spoken Word' },
                    { value: 'r&b-soul', label: 'R&B / Soul' },
                    { value: 'country', label: 'Country' },
                    { value: 'cinematic', label: 'Cinematic' },
                    { value: 'other', label: 'Other' }
                  ].map((option) => (
                    <OptionButton
                      key={option.value}
                      value={option.value}
                      label={option.label}
                      isSelected={intakeData.musicStyle.includes(option.value)}
                      onClick={(value) => {
                        updateMultiSelectData('musicStyle', value);
                        if (value === 'other' && intakeData.musicStyle.includes('other')) {
                          updateIntakeData('musicStyleCustom', '');
                        }
                      }}
                      multiSelect={true}
                      className="p-3"
                    />
                  ))}
                </div>

                {/* Custom Music Style (conditional) */}
                {intakeData.musicStyle.includes('other') && (
                  <div className="mt-4">
                    <label htmlFor="custom-music-style" className="block font-body font-semibold text-text-main mb-3">
                      Describe your preferred music style <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      id="custom-music-style"
                      value={intakeData.musicStyleCustom}
                      onChange={(e) => updateIntakeData('musicStyleCustom', e.target.value)}
                      placeholder="e.g., Afrobeats, Lo-fi, Jazz, etc."
                      className="w-full px-4 py-3 text-base border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-soft"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Emotional Vibe (multi-select) */}
              <div>
                <label className="block font-body font-semibold text-text-main mb-3">
                  Emotional vibe <span className="text-primary">*</span> <span className="text-text-muted text-sm font-normal">(select all that apply)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'hopeful', label: 'Hopeful' },
                    { value: 'gentle', label: 'Gentle' },
                    { value: 'joyful', label: 'Joyful' },
                    { value: 'reflective', label: 'Reflective' },
                    { value: 'comforting', label: 'Comforting' },
                    { value: 'victorious', label: 'Victorious' },
                    { value: 'other', label: 'Other' }
                  ].map((option) => (
                    <OptionButton
                      key={option.value}
                      value={option.value}
                      label={option.label}
                      isSelected={intakeData.emotionalVibe.includes(option.value)}
                      onClick={(value) => {
                        updateMultiSelectData('emotionalVibe', value);
                        if (value === 'other' && intakeData.emotionalVibe.includes('other')) {
                          updateIntakeData('emotionalVibeCustom', '');
                        }
                      }}
                      multiSelect={true}
                      className="p-3"
                    />
                  ))}
                </div>

                {/* Custom Emotional Vibe (conditional) */}
                {intakeData.emotionalVibe.includes('other') && (
                  <div className="mt-4">
                    <label htmlFor="custom-emotional-vibe" className="block font-body font-semibold text-text-main mb-3">
                      Describe the emotional vibe you want <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      id="custom-emotional-vibe"
                      value={intakeData.emotionalVibeCustom}
                      onChange={(e) => updateIntakeData('emotionalVibeCustom', e.target.value)}
                      placeholder="e.g., Nostalgic, Bittersweet, Empowering, etc."
                      className="w-full px-4 py-3 text-base border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-soft"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Voice Preference */}
              <div>
                <label className="block font-body font-semibold text-text-main mb-3">
                  Voice preference <span className="text-primary">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'no-preference', label: 'No preference' }
                  ].map((option) => (
                    <OptionButton
                      key={option.value}
                      value={option.value}
                      label={option.label}
                      isSelected={intakeData.voicePreference === option.value}
                      onClick={(value) => updateIntakeData('voicePreference', value)}
                      className="p-3"
                    />
                  ))}
                </div>
              </div>

              {/* Music Inspiration Notes */}
              <div>
                <label htmlFor="music-inspiration" className="block font-body font-semibold text-text-main mb-3">
                  Musical inspiration <span className="text-text-muted text-sm font-normal">(optional)</span>
                </label>
                <textarea
                  id="music-inspiration"
                  value={intakeData.musicInspirationNotes}
                  onChange={(e) => updateIntakeData('musicInspirationNotes', e.target.value)}
                  placeholder="Share artists, genres, or styles you enjoy..."
                  rows={4}
                  className="w-full px-4 py-3 text-base border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-soft resize-none"
                />
                <p className="text-sm text-text-muted mt-2">
                  You can share artists, genres, or styles you enjoy. We won't copy melodies or lyrics — this simply helps us understand the sound you love.
                </p>
              </div>
            </div>
          </StepContainer>
        );

      case 4:
        return (
          <StepContainer
            title="What makes them unforgettable to you?"
            subtitle="Help us capture what makes this person so special in your heart"
          >
            {getPersonalizedText(4) && (
              <div className="mb-4 px-4 py-3 bg-primary/5 rounded-xl border border-primary/10">
                <p className="text-sm font-body text-primary font-medium text-center">
                  {getPersonalizedText(4)}
                </p>
              </div>
            )}
            <div className="space-y-6">
              {/* Recipient Qualities */}
              <div>
                <label htmlFor="recipient-qualities" className="block font-body font-semibold text-text-main mb-3">
                  What qualities do you love most about them? <span className="text-primary">*</span>
                </label>
                <textarea
                  id="recipient-qualities"
                  value={intakeData.recipientQualities}
                  onChange={(e) => updateIntakeData('recipientQualities', e.target.value)}
                  placeholder="Their kindness, strength, humor, wisdom, the way they make you feel..."
                  rows={4}
                  className="w-full px-4 py-3 text-base border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-soft resize-none"
                />
              </div>

              {/* Shared Memories */}
              <div>
                <label htmlFor="shared-memories" className="block font-body font-semibold text-text-main mb-3">
                  Is there a moment or journey that shaped your bond? <span className="text-primary">*</span>
                </label>
                <textarea
                  id="shared-memories"
                  value={intakeData.sharedMemories}
                  onChange={(e) => updateIntakeData('sharedMemories', e.target.value)}
                  placeholder="A special memory, challenge you overcame together, milestone you shared, or how your relationship grew..."
                  rows={4}
                  className="w-full px-4 py-3 text-base border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-soft resize-none"
                />
              </div>

              {/* Faith Expression Level (optional) */}
              <div>
                <label className="block font-body font-semibold text-text-main mb-3">
                  Would you like faith reflected in a specific way? <span className="text-text-muted text-sm font-normal">(optional)</span>
                </label>
                <div className="step-4-faith-cards flex flex-col gap-4">
                  {[
                    { value: 'subtle', label: 'Subtle', description: 'Gentle references that feel natural' },
                    { value: 'clear', label: 'Clear', description: 'Obvious but not overwhelming' },
                    { value: 'central', label: 'Central', description: 'Faith as the main theme' }
                  ].map((option) => (
                    <div key={option.value} className="w-full">
                      <OptionButton
                        value={option.value}
                        label={option.label}
                        description={option.description}
                        isSelected={intakeData.faithExpressionLevel === option.value}
                        onClick={(value) => {
                          // Toggle off if already selected (since it's optional)
                          if (intakeData.faithExpressionLevel === value) {
                            updateIntakeData('faithExpressionLevel', '');
                          } else {
                            updateIntakeData('faithExpressionLevel', value);
                          }
                        }}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-text-muted mt-2">
                  You can skip this if faith isn't relevant to your song.
                </p>
              </div>
            </div>
          </StepContainer>
        );

      case 5:
        return (
          <StepContainer
            title="If this song could say one thing for you…"
            subtitle="If they could only hear one message from your heart, what would you want them to know?"
          >
            {getPersonalizedText(5) && (
              <div className="mb-4 px-4 py-3 bg-primary/5 rounded-xl border border-primary/10">
                <p className="text-sm font-body text-primary font-medium text-center">
                  {getPersonalizedText(5)}
                </p>
              </div>
            )}
            <div className="space-y-6">
              {/* Core Message */}
              <div>
                <label htmlFor="core-message" className="block font-body font-semibold text-text-main mb-3">
                  Your heart's message <span className="text-primary">*</span>
                </label>
                <textarea
                  id="core-message"
                  value={intakeData.coreMessage}
                  onChange={(e) => updateIntakeData('coreMessage', e.target.value)}
                  placeholder="What would you want them to know? This could be how much they mean to you, what you're grateful for, hopes for their future, or anything that comes from your heart..."
                  rows={6}
                  className="w-full px-4 py-3 text-base border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-soft resize-none"
                  required
                />
                <p className="text-sm text-text-muted mt-2">
                  This is the heart of your song. Take your time and speak from the soul.
                </p>
              </div>

              {/* AI Rephrasing Permission */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={intakeData.aiRephrasingPermission}
                    onChange={(e) => updateIntakeData('aiRephrasingPermission', e.target.checked)}
                    className="mt-1 w-5 h-5 text-primary border-primary/30 rounded focus:ring-2 focus:ring-primary focus:ring-offset-0"
                  />
                  <div>
                    <span className="font-body font-semibold text-text-main">
                      It's okay to rephrase this beautifully
                    </span>
                    <p className="text-sm text-text-muted mt-1">
                      Our songwriters can enhance the flow and poetry while keeping your authentic message intact.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </StepContainer>
        );

      case 6:
        return (
          <StepContainer
            title="How can we deliver your song?"
            subtitle="We need your contact details to send you the finished song and keep you updated on progress."
          >
            {getPersonalizedText(6) && (
              <div className="mb-4 px-4 py-3 bg-primary/5 rounded-xl border border-primary/10">
                <p className="text-sm font-body text-primary font-medium text-center">
                  {getPersonalizedText(6)}
                </p>
              </div>
            )}
            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="contact-full-name" className="block font-body font-semibold text-text-main mb-3">
                  Full Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  id="contact-full-name"
                  value={intakeData.fullName}
                  onChange={(e) => {
                    const trimmed = e.target.value.trimStart(); // Prevent leading spaces
                    updateIntakeData('fullName', trimmed);
                    // Clear error on change
                    if (validationErrors.fullName) {
                      setValidationErrors(prev => ({ ...prev, fullName: '' }));
                    }
                  }}
                  onBlur={() => handleFieldBlur('fullName')}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 text-base border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-soft ${
                    validationErrors.fullName ? 'border-red-500' : 'border-primary/20'
                  }`}
                  required
                />
                {validationErrors.fullName && (
                  <p className="text-sm text-red-600 mt-2">{validationErrors.fullName}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="contact-email" className="block font-body font-semibold text-text-main mb-3">
                  Email Address <span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  id="contact-email"
                  value={intakeData.email}
                  onChange={(e) => {
                    const trimmed = e.target.value.trim();
                    updateIntakeData('email', trimmed);
                    // Clear error on change
                    if (validationErrors.email) {
                      setValidationErrors(prev => ({ ...prev, email: '' }));
                    }
                  }}
                  onBlur={() => handleFieldBlur('email')}
                  placeholder="Enter your email address"
                  className={`w-full px-4 py-3 text-base border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-soft ${
                    validationErrors.email ? 'border-red-500' : 'border-primary/20'
                  }`}
                  required
                />
                {validationErrors.email && (
                  <p className="text-sm text-red-600 mt-2">{validationErrors.email}</p>
                )}
                {!validationErrors.email && (
                  <p className="text-sm text-text-muted mt-2">
                    We'll send your custom song and order updates to this email.
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="contact-phone" className="block font-body font-semibold text-text-main mb-3">
                  Phone Number <span className="text-primary">*</span>
                </label>
                <PhoneInputComponent
                  value={intakeData.phoneNumber}
                  onChange={(value) => updateIntakeData('phoneNumber', value)}
                  onValidationChange={handlePhoneValidation}
                  onBlur={() => handleFieldBlur('phone')}
                  placeholder="Enter your phone number"
                  error={validationErrors.phone}
                />
                {!validationErrors.phone && (
                  <p className="text-sm text-text-muted mt-2">
                    For important updates about your order (we won't spam you).
                  </p>
                )}
                {phoneValidation.isValid && phoneValidation.display && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {phoneValidation.display} ({phoneValidation.country})
                  </p>
                )}
              </div>
            </div>
          </StepContainer>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Top announcement bar */}
      <AnnouncementBar />
      
      {/* Sticky navigation bar */}
      <Navigation />
      
      <main className="min-h-screen bg-background-soft">
        <div className="max-w-xl mx-auto px-4 py-8">
          <ProgressHeader currentStep={currentStep} totalSteps={totalSteps} />
          
          {renderStep()}
          
          <NavigationFooter
            currentStep={currentStep}
            totalSteps={totalSteps}
            isStepValid={isStepValid()}
            onBack={handleBack}
            onNext={handleNext}
          />
        </div>
      </main>
      <ProductSchema 
        name="Custom Song Creation Service"
        description="Create your personalized song with our step-by-step process. Professional musicians craft unique songs from your love story in 24-48 hours."
      />
    </>
  );
}
