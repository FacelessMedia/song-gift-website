'use client';

import { useState } from 'react';

export default function WhatYouGet() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control actual audio playback
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-background-main to-background-soft">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-text-main mb-6">
            What You Get
          </h2>
          <p className="font-serif text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
            Everything you need for your perfect personalized song.
          </p>
        </div>

        {/* Audio Player Vinyl Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-white via-background-soft to-primary/5 rounded-3xl p-8 shadow-soft-lg border border-white/50">
            
            {/* Vinyl Record */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-64 h-64 bg-gradient-to-br from-text-main to-text-main/80 rounded-full p-4 shadow-soft-lg">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center relative">
                    {/* Vinyl grooves */}
                    <div className="absolute inset-4 border border-text-main/20 rounded-full"></div>
                    <div className="absolute inset-8 border border-text-main/20 rounded-full"></div>
                    <div className="absolute inset-12 border border-text-main/20 rounded-full"></div>
                    
                    {/* Center hole */}
                    <div className="w-8 h-8 bg-text-main rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    
                    {/* Play/Pause Button */}
                    <button 
                      onClick={handlePlayPause}
                      className="absolute inset-0 w-full h-full rounded-full hover:bg-black/10 transition-colors flex items-center justify-center group"
                    >
                      <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-soft-lg group-hover:bg-white transition-colors">
                        {isPlaying ? (
                          <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Song Information */}
            <div className="text-center mb-6">
              <h3 className="font-heading text-2xl font-semibold text-text-main mb-2">
                "Your Love Story"
              </h3>
              <p className="font-body text-text-muted mb-4">
                Custom Song for Sarah & Michael
              </p>
              
              {/* Waveform */}
              <div className="flex items-center justify-center gap-1 mb-6">
                {[12, 24, 18, 32, 28, 16, 36, 20, 14, 30, 22, 26, 34, 18, 24, 12, 28, 20, 16, 32].map((height, i) => (
                  <div 
                    key={i} 
                    className={`rounded-full transition-colors ${
                      isPlaying ? 'bg-primary animate-pulse' : 'bg-primary/40'
                    }`}
                    style={{
                      width: '3px',
                      height: `${height}px`
                    }}
                  ></div>
                ))}
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-primary h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
              
              {/* Time */}
              <div className="flex justify-between text-sm text-text-muted">
                <span>1:24</span>
                <span>3:47</span>
              </div>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-primary text-lg">🎵</span>
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-text-main text-sm">Professional Recording</h4>
                  <p className="text-xs text-text-muted">Studio-quality production</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-primary text-lg">📱</span>
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-text-main text-sm">Digital Delivery</h4>
                  <p className="text-xs text-text-muted">MP3 & WAV files</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-primary text-lg">🎨</span>
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-text-main text-sm">Custom Artwork</h4>
                  <p className="text-xs text-text-muted">Personalized cover art</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-primary text-lg">🔄</span>
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-text-main text-sm">Unlimited Revisions</h4>
                  <p className="text-xs text-text-muted">Until it's perfect</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
