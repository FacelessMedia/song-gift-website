'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IntakeData } from '@/types/intake';
import { getSessionData, setSessionData, getIntakeDataKey } from '@/utils/sessionManager';

const defaultIntakeData: IntakeData = {
  // Step 1: Who is this song meant to move?
  recipientRelationship: '',
  recipientCustomRelation: '',
  recipientName: '',
  recipientNamePronunciation: '',
  songPerspective: '',
  songPerspectiveCustom: '',
  gender: '',
  genderCustom: '',
  
  // Step 2: What language should their heart hear this in?
  primaryLanguage: '',
  languageStyle: '',
  secondaryLanguage: '',
  languageSpecificPhrases: '',
  
  // Step 3: How should this song feel when it plays?
  musicStyle: [],
  musicStyleCustom: '',
  emotionalVibe: [],
  emotionalVibeCustom: '',
  voicePreference: '',
  musicInspirationNotes: '',
  
  // Step 4: What makes them unforgettable to you?
  recipientQualities: '',
  sharedMemories: '',
  faithExpressionLevel: '',
  
  // Step 5: If this song could say one thing for you...
  coreMessage: '',
  aiRephrasingPermission: false,
  intakeCompletedAt: '',
  
  // Checkout options
  expressDelivery: false,
  
  // Contact information (required for checkout)
  fullName: '',
  email: '',
  phoneNumber: '',
  
  // Enhanced phone fields for international support
  customer_phone_e164: '',
  customer_phone_display: '',
  customer_phone_country: '',
  
  // Other steps (keeping existing for now)
  songType: '',
  recipient: '',
  occasion: '',
  personalDetails: '',
  oldMusicStyle: ''
};

interface IntakeContextType {
  intakeData: IntakeData;
  updateIntakeData: (field: keyof IntakeData, value: string | boolean | string[]) => void;
  updateMultiSelectData: (field: keyof IntakeData, value: string) => void;
  completeIntake: () => IntakeData;
  isLoaded: boolean;
  getFirstIncompleteStep: () => number;
  isStepValid: (step: number) => boolean;
}

const IntakeContext = createContext<IntakeContextType | undefined>(undefined);

interface IntakeProviderProps {
  children: ReactNode;
}

export function IntakeProvider({ children }: IntakeProviderProps) {
  const [intakeData, setIntakeData] = useState<IntakeData>(defaultIntakeData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from sessionStorage on mount
  useEffect(() => {
    try {
      const storedData = getSessionData(getIntakeDataKey(), defaultIntakeData);
      // Merge with default data to ensure all fields exist
      setIntakeData({
        ...defaultIntakeData,
        ...storedData
      });
    } catch (error) {
      console.error('Error loading intake data from sessionStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save data to sessionStorage whenever it changes
  const updateIntakeData = (field: keyof IntakeData, value: string | boolean | string[]) => {
    setIntakeData(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      
      try {
        setSessionData(getIntakeDataKey(), updated);
      } catch (error) {
        console.error('Error saving intake data to sessionStorage:', error);
      }
      
      return updated;
    });
  };

  // Multi-select helper for arrays
  const updateMultiSelectData = (field: keyof IntakeData, value: string) => {
    setIntakeData(prev => {
      const currentArray = prev[field] as string[];
      let updated: IntakeData;
      
      if (currentArray.includes(value)) {
        // Remove if already selected
        updated = {
          ...prev,
          [field]: currentArray.filter(item => item !== value)
        };
      } else {
        // Add if not selected
        updated = {
          ...prev,
          [field]: [...currentArray, value]
        };
      }
      
      try {
        setSessionData(getIntakeDataKey(), updated);
      } catch (error) {
        console.error('Error saving intake data to sessionStorage:', error);
      }
      
      return updated;
    });
  };

  // Mark intake as completed
  const completeIntake = () => {
    const completedData = {
      ...intakeData,
      intakeCompletedAt: new Date().toISOString()
    };
    
    setIntakeData(completedData);
    
    try {
      setSessionData(getIntakeDataKey(), completedData);
    } catch (error) {
      console.error('Error saving completed intake data:', error);
    }
    
    return completedData;
  };

  // Validate individual steps
  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return intakeData.recipientRelationship !== '' && 
               intakeData.recipientName.trim() !== '' && 
               intakeData.songPerspective !== '' &&
               intakeData.gender !== '' &&
               (intakeData.gender !== 'other' || intakeData.genderCustom.trim() !== '') &&
               (intakeData.recipientRelationship !== 'other' || intakeData.recipientCustomRelation.trim() !== '') &&
               (intakeData.songPerspective !== 'other' || intakeData.songPerspectiveCustom.trim() !== '');
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
        return intakeData.fullName?.trim() !== '' && 
               intakeData.email?.trim() !== '' && 
               intakeData.phoneNumber?.trim() !== '';
      default:
        return false;
    }
  };

  // Find the first incomplete step
  const getFirstIncompleteStep = () => {
    for (let step = 1; step <= 6; step++) {
      if (!isStepValid(step)) {
        return step;
      }
    }
    return 1; // Default to step 1 if all are complete
  };

  const value = {
    intakeData,
    updateIntakeData,
    updateMultiSelectData,
    completeIntake,
    isLoaded,
    getFirstIncompleteStep,
    isStepValid
  };

  return (
    <IntakeContext.Provider value={value}>
      {children}
    </IntakeContext.Provider>
  );
}

export function useIntakeContext() {
  const context = useContext(IntakeContext);
  if (context === undefined) {
    throw new Error('useIntakeContext must be used within an IntakeProvider');
  }
  return context;
}
