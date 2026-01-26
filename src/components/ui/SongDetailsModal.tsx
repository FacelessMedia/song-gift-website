'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { OptionButton } from '@/components/ui/intake';
import { useIntakeData } from '@/hooks/useIntakeData';

interface SongDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SongDetailsModal({ isOpen, onClose }: SongDetailsModalProps) {
  const { intakeData, updateIntakeData, updateMultiSelectData } = useIntakeData();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary/10">
          <h2 className="font-heading text-2xl font-bold text-text-main">
            Your Song Details
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-8">
          {/* Step 1: Who is this song meant to move? */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold text-text-main border-b border-primary/10 pb-2">
              Step 1: Who is this song meant to move?
            </h3>
            
            {/* Recipient Relationship */}
            <div>
              <label className="block font-body font-semibold text-text-main mb-2 text-sm">
                What is your relationship to them?
              </label>
              <div className="flex flex-wrap gap-2">
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

            {/* Custom Relationship */}
            {intakeData.recipientRelationship === 'other' && (
              <div>
                <label className="block font-body font-semibold text-text-main mb-2 text-sm">
                  Please specify your relationship
                </label>
                <input
                  type="text"
                  value={intakeData.recipientCustomRelation}
                  onChange={(e) => updateIntakeData('recipientCustomRelation', e.target.value)}
                  placeholder="e.g., Grandmother, Best Friend, etc."
                  className="w-full px-3 py-2 text-sm border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            )}

            {/* Recipient Name */}
            <div>
              <label className="block font-body font-semibold text-text-main mb-2 text-sm">
                What is their name?
              </label>
              <input
                type="text"
                value={intakeData.recipientName}
                onChange={(e) => updateIntakeData('recipientName', e.target.value)}
                placeholder="Enter their name"
                className="w-full px-3 py-2 text-sm border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Name Pronunciation */}
            <div>
              <label className="block font-body font-semibold text-text-main mb-2 text-sm">
                How do you pronounce their name? <span className="text-text-muted font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={intakeData.recipientNamePronunciation}
                onChange={(e) => updateIntakeData('recipientNamePronunciation', e.target.value)}
                placeholder="e.g., Sarah (SAIR-uh)"
                className="w-full px-3 py-2 text-sm border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Song Perspective */}
            <div>
              <label className="block font-body font-semibold text-text-main mb-2 text-sm">
                From whose perspective should the song be written?
              </label>
              <div className="space-y-2">
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
                    className="p-2 text-sm"
                  />
                ))}
              </div>

              {/* Custom Perspective (conditional) */}
              {intakeData.songPerspective === 'other' && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={intakeData.songPerspectiveCustom}
                    onChange={(e) => updateIntakeData('songPerspectiveCustom', e.target.value)}
                    placeholder="e.g. From our grandparents, From their children, From my future self"
                    className="w-full px-3 py-2 text-sm border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Language */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold text-text-main border-b border-primary/10 pb-2">
              Step 2: What language should their heart hear this in?
            </h3>
            
            {/* Primary Language */}
            <div>
              <label htmlFor="modal-primary-language" className="block font-body font-semibold text-text-main mb-2 text-sm">
                Primary language
              </label>
              <select
                id="modal-primary-language"
                value={intakeData.primaryLanguage}
                onChange={(e) => updateIntakeData('primaryLanguage', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Select a language</option>
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="portuguese">Portuguese</option>
                <option value="french">French</option>
              </select>
            </div>

            {/* Language Style */}
            <div>
              <label className="block font-body font-semibold text-text-main mb-2 text-sm">
                Language style
              </label>
              <div className="space-y-2">
                {[
                  { value: '100-primary', label: '100% primary' },
                  { value: 'mostly-primary', label: 'Mostly primary with some secondary' },
                  { value: 'bilingual-blend', label: 'Bilingual blend' }
                ].map((option) => (
                  <OptionButton
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    isSelected={intakeData.languageStyle === option.value}
                    onClick={(value) => updateIntakeData('languageStyle', value)}
                    className="p-2 text-sm"
                  />
                ))}
              </div>
            </div>

            {/* Secondary Language */}
            {intakeData.languageStyle === 'bilingual-blend' && (
              <div>
                <label htmlFor="modal-secondary-language" className="block font-body font-semibold text-text-main mb-2 text-sm">
                  Secondary language
                </label>
                <select
                  id="modal-secondary-language"
                  value={intakeData.secondaryLanguage}
                  onChange={(e) => updateIntakeData('secondaryLanguage', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Select a secondary language</option>
                  {[
                    { value: 'english', label: 'English' },
                    { value: 'spanish', label: 'Spanish' },
                    { value: 'portuguese', label: 'Portuguese' },
                    { value: 'french', label: 'French' }
                  ].filter(lang => lang.value !== intakeData.primaryLanguage).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Language Specific Phrases */}
            <div>
              <label className="block font-body font-semibold text-text-main mb-2 text-sm">
                Special phrases or words <span className="text-text-muted font-normal">(optional)</span>
              </label>
              <textarea
                value={intakeData.languageSpecificPhrases}
                onChange={(e) => updateIntakeData('languageSpecificPhrases', e.target.value)}
                placeholder="Any specific phrases, nicknames, or words..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Step 3: Music Style */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold text-text-main border-b border-primary/10 pb-2">
              Step 3: How should this song feel when it plays?
            </h3>
            
            {/* Music Style */}
            <div>
              <label className="block font-body font-semibold text-text-main mb-2 text-sm">
                Music style <span className="text-text-muted font-normal">(select all that apply)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'worship', label: 'Worship' },
                  { value: 'acoustic', label: 'Acoustic' },
                  { value: 'pop', label: 'Pop' },
                  { value: 'rap-spoken-word', label: 'Rap / Spoken Word' },
                  { value: 'r&b-soul', label: 'R&B / Soul' },
                  { value: 'country', label: 'Country' },
                  { value: 'cinematic', label: 'Cinematic' }
                ].map((option) => (
                  <OptionButton
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    isSelected={intakeData.musicStyle.includes(option.value)}
                    onClick={(value) => updateMultiSelectData('musicStyle', value)}
                    multiSelect={true}
                    className="p-2 text-sm"
                  />
                ))}
              </div>
            </div>

            {/* Emotional Vibe */}
            <div>
              <label className="block font-body font-semibold text-text-main mb-2 text-sm">
                Emotional vibe <span className="text-text-muted font-normal">(select all that apply)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'hopeful', label: 'Hopeful' },
                  { value: 'gentle', label: 'Gentle' },
                  { value: 'joyful', label: 'Joyful' },
                  { value: 'reflective', label: 'Reflective' },
                  { value: 'comforting', label: 'Comforting' },
                  { value: 'victorious', label: 'Victorious' }
                ].map((option) => (
                  <OptionButton
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    isSelected={intakeData.emotionalVibe.includes(option.value)}
                    onClick={(value) => updateMultiSelectData('emotionalVibe', value)}
                    multiSelect={true}
                    className="p-2 text-sm"
                  />
                ))}
              </div>
            </div>

            {/* Voice Preference */}
            <div>
              <label className="block font-body font-semibold text-text-main mb-2 text-sm">
                Voice preference
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
                    className="p-2 text-sm"
                  />
                ))}
              </div>
            </div>

            {/* Music Inspiration Notes */}
            <div>
              <label className="block font-body font-semibold text-text-main mb-2 text-sm">
                Musical inspiration <span className="text-text-muted font-normal">(optional)</span>
              </label>
              <textarea
                value={intakeData.musicInspirationNotes}
                onChange={(e) => updateIntakeData('musicInspirationNotes', e.target.value)}
                placeholder="Share artists, genres, or styles you enjoy..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Step 4: Personal Details */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold text-text-main border-b border-primary/10 pb-2">
              Step 4: What makes them unforgettable to you?
            </h3>
            
            {/* Recipient Qualities */}
            <div>
              <label className="block font-body font-semibold text-text-main mb-2 text-sm">
                What qualities do you love most about them?
              </label>
              <textarea
                value={intakeData.recipientQualities}
                onChange={(e) => updateIntakeData('recipientQualities', e.target.value)}
                placeholder="Their kindness, strength, humor, wisdom..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            {/* Shared Memories */}
            <div>
              <label className="block font-body font-semibold text-text-main mb-2 text-sm">
                Is there a moment or journey that shaped your bond?
              </label>
              <textarea
                value={intakeData.sharedMemories}
                onChange={(e) => updateIntakeData('sharedMemories', e.target.value)}
                placeholder="A special memory, challenge you overcame together..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            {/* Faith Expression Level */}
            <div>
              <label className="block font-body font-semibold text-text-main mb-2 text-sm">
                Would you like faith reflected in a specific way?
              </label>
              <div className="space-y-2">
                {[
                  { value: 'subtle', label: 'Subtle', description: 'Gentle references that feel natural' },
                  { value: 'clear', label: 'Clear', description: 'Obvious but not overwhelming' },
                  { value: 'central', label: 'Central', description: 'Faith as the main theme' }
                ].map((option) => (
                  <OptionButton
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    description={option.description}
                    isSelected={intakeData.faithExpressionLevel === option.value}
                    onClick={(value) => updateIntakeData('faithExpressionLevel', value)}
                    className="p-3 text-sm"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Step 5: Core Message */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold text-text-main border-b border-primary/10 pb-2">
              Step 5: If this song could say one thing for you…
            </h3>
            
            {/* Core Message */}
            <div>
              <label className="block font-body font-semibold text-text-main mb-2 text-sm">
                Your heart's message
              </label>
              <textarea
                value={intakeData.coreMessage}
                onChange={(e) => updateIntakeData('coreMessage', e.target.value)}
                placeholder="What would you want them to know?..."
                rows={4}
                className="w-full px-3 py-2 text-sm border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            {/* AI Rephrasing Permission */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={intakeData.aiRephrasingPermission}
                  onChange={(e) => updateIntakeData('aiRephrasingPermission', e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary border-primary/30 rounded focus:ring-2 focus:ring-primary focus:ring-offset-0"
                />
                <div>
                  <span className="font-body font-semibold text-text-main text-sm">
                    It's okay to rephrase this beautifully
                  </span>
                  <p className="text-xs text-text-muted mt-1">
                    Our songwriters can enhance the flow and poetry while keeping your authentic message intact.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-primary/10">
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={onClose}>
            Save & Close
          </Button>
        </div>
      </div>
    </div>
  );
}
