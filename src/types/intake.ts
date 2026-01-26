export interface IntakeData {
  // Step 1: Who is this song meant to move?
  recipientRelationship: string;
  recipientCustomRelation: string;
  recipientName: string;
  recipientNamePronunciation: string;
  songPerspective: string;
  songPerspectiveCustom: string;
  
  // Step 2: What language should their heart hear this in?
  primaryLanguage: string;
  languageStyle: string;
  secondaryLanguage: string;
  languageSpecificPhrases: string;
  
  // Step 3: How should this song feel when it plays?
  musicStyle: string[];
  emotionalVibe: string[];
  voicePreference: string;
  musicInspirationNotes: string;
  
  // Step 4: What makes them unforgettable to you?
  recipientQualities: string;
  sharedMemories: string;
  faithExpressionLevel: string;
  
  // Step 5: If this song could say one thing for you...
  coreMessage: string;
  aiRephrasingPermission: boolean;
  intakeCompletedAt: string;
  
  // Checkout options
  expressDelivery: boolean;
  
  // Other steps (keeping existing for now)
  songType: string;
  recipient: string;
  occasion: string;
  personalDetails: string;
  oldMusicStyle: string;
}
