'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Review } from '@/data/reviews';

interface ReviewCardProps {
  review: Review;
  variant?: 'homepage' | 'reviews-page';
  onAudioToggle?: (reviewId: string) => void;
  isPlaying?: boolean;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Star rating component
function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'w-6 h-6' : 'w-5 h-5';
  return (
    <div className="flex items-center">
      {[...Array(rating)].map((_, i) => (
        <svg key={i} className={`${cls} text-yellow-400 fill-current`} viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

// Author block component
function AuthorBlock({ name, relationship, size = 'sm' }: { name: string; relationship: string; size?: 'sm' | 'md' }) {
  const avatarCls = size === 'md' ? 'w-14 h-14' : 'w-12 h-12';
  const nameCls = size === 'md' ? 'font-body font-semibold text-text-main text-lg' : 'font-body font-semibold text-text-main';
  const relCls = size === 'md' ? 'font-body text-text-muted' : 'font-body text-text-muted text-sm';
  return (
    <div className="flex items-center">
      <div className={`${avatarCls} bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-heading font-semibold mr-4`}>
        {name.charAt(0)}
      </div>
      <div>
        <div className={nameCls}>{name}</div>
        <div className={relCls}>{relationship}</div>
      </div>
    </div>
  );
}

// Audio player with dynamic progress bar and time
function AudioPlayerInline({
  src,
  songName,
  isPlaying,
  onToggle,
  onEnded,
}: {
  src: string;
  songName: string;
  isPlaying: boolean;
  onToggle: () => void;
  onEnded: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      setIsLoading(true);
      audio.play().then(() => {
        setIsLoading(false);
      }).catch(() => {
        setIsLoading(false);
      });
    } else {
      audio.pause();
      setIsLoading(false);
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (audio) setCurrentTime(audio.currentTime);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (audio) setDuration(audio.duration);
  }, []);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
    setCurrentTime(audio.currentTime);
  }, [duration]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="mb-4">
      {/* Play button + song name */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={onToggle}
          disabled={isLoading}
          className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-primary text-white shadow-sm'
              : 'bg-primary/10 text-primary hover:bg-primary/20'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={isPlaying ? "Pause song" : "Play song"}
        >
          {isLoading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
        <span className="font-body text-sm text-text-muted truncate">{songName}</span>
      </div>

      {/* Progress bar */}
      <div
        ref={progressRef}
        onClick={handleSeek}
        className="w-full h-1.5 bg-gray-100 rounded-full cursor-pointer group relative"
        role="slider"
        aria-label="Song progress"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-100 ${
            isPlaying ? 'bg-primary' : 'bg-primary/40'
          }`}
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          style={{ left: `calc(${progress}% - 6px)` }}
        />
      </div>

      {/* Time display */}
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-text-muted tabular-nums">{formatTime(currentTime)}</span>
        <span className="text-[10px] text-text-muted tabular-nums">{formatTime(duration)}</span>
      </div>

      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onEnded}
      />
    </div>
  );
}

export function ReviewCard({ 
  review, 
  variant = 'reviews-page',
  onAudioToggle,
  isPlaying = false 
}: ReviewCardProps) {
  const handleToggle = () => onAudioToggle?.(review.id);
  const handleEnded = () => onAudioToggle?.(review.id);

  const isHomepage = variant === 'homepage';
  const isVideo = review.type === 'video';

  // --- VIDEO REVIEW ---
  if (isVideo) {
    const wrapperCls = isHomepage
      ? 'flex-shrink-0 w-80 md:w-96 snap-start'
      : '';
    const cardCls = isHomepage
      ? 'bg-gradient-to-br from-white to-background-soft p-8 rounded-3xl shadow-soft-lg hover:shadow-soft border border-white/50 h-full'
      : 'bg-white p-6 rounded-3xl shadow-soft-lg hover:shadow-soft border border-white/80 h-full';

    return (
      <div className={wrapperCls}>
        <div className={cardCls}>
          {/* Video Element */}
          <div className="aspect-video bg-black rounded-2xl mb-6 overflow-hidden">
            <video
              src={review.mediaFile}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>

          <StarRating rating={review.rating} size={isHomepage ? 'sm' : 'sm'} />

          <blockquote className={`font-serif ${isHomepage ? 'text-lg' : 'text-base'} text-text-main my-4 leading-relaxed`}>
            &ldquo;{review.reviewText}&rdquo;
          </blockquote>

          <AuthorBlock name={review.name} relationship={review.relationship} size={isHomepage ? 'md' : 'sm'} />
        </div>
      </div>
    );
  }

  // --- AUDIO REVIEW ---
  const wrapperCls = isHomepage
    ? 'flex-shrink-0 w-80 md:w-96 snap-start'
    : '';
  const cardCls = isHomepage
    ? 'bg-white p-8 rounded-3xl shadow-soft-lg hover:shadow-soft border border-primary/10 h-full'
    : 'bg-white p-6 rounded-3xl shadow-soft-lg hover:shadow-soft border border-white/80 h-full';

  return (
    <div className={wrapperCls}>
      <div className={cardCls}>
        <StarRating rating={review.rating} size={isHomepage ? 'md' : 'sm'} />

        <div className="mt-4">
          <AudioPlayerInline
            src={review.mediaFile}
            songName={review.songName}
            isPlaying={isPlaying}
            onToggle={handleToggle}
            onEnded={handleEnded}
          />
        </div>

        <blockquote className={`font-serif ${isHomepage ? 'text-lg mb-8' : 'text-base mb-6'} text-text-main leading-relaxed`}>
          &ldquo;{review.reviewText}&rdquo;
        </blockquote>

        <AuthorBlock name={review.name} relationship={review.relationship} size={isHomepage ? 'md' : 'sm'} />
      </div>
    </div>
  );
}
