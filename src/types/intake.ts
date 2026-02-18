export interface IntakeData {
  // Step 1: Who is this song meant to move?
  recipientRelationship: string;
  recipientCustomRelation: string;
  recipientName: string;
  recipientNamePronunciation: string;
  songPerspective: string;
  songPerspectiveCustom: string;
  gender: string;
  genderCustom: string;
  
  // Step 2: What language should their heart hear this in?
  primaryLanguage: string;
  languageStyle: string;
  secondaryLanguage: string;
  languageSpecificPhrases: string;
  
  // Step 3: How should this song feel when it plays?
  musicStyle: string[];
  musicStyleCustom: string;
  emotionalVibe: string[];
  emotionalVibeCustom: string;
  voicePreference: string;
  musicInspirationNotes: string;
  
  // Step 4: What makes them unforgettable to you?
  recipientQualities: string;
  sharedMemories: string;
  faithExpressionLevel: string; // Now optional — can be empty string or null
  
  // Step 5: If this song could say one thing for you...
  coreMessage: string;
  aiRephrasingPermission: boolean;
  intakeCompletedAt: string;
  
  // Checkout options
  expressDelivery: boolean;
  
  // Contact information (required for checkout)
  fullName: string;
  email: string;
  phoneNumber: string; // Keep for backward compatibility
  
  // Enhanced phone fields for international support
  customer_phone_e164: string; // E.164 format (e.g., +923001234567)
  customer_phone_display: string; // Display format (e.g., +92 300 1234567)
  customer_phone_country: string; // Country code (e.g., "PK")
  
  // Other steps (keeping existing for now)
  songType: string;
  recipient: string;
  occasion: string;
  personalDetails: string;
  oldMusicStyle: string;
}
