'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface Song {
  name: string;
  url: string;
}

interface AudioPlayerProps {
  songs: Song[];
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Play icon SVG
const PlayIcon = () => (
  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

// Pause icon SVG
const PauseIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

// Music note icon SVG
const MusicNoteIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
  </svg>
);

function SongCard({ 
  song, 
  index, 
  isPlaying, 
  onPlay, 
  onPause 
}: { 
  song: Song; 
  index: number; 
  isPlaying: boolean; 
  onPlay: () => void; 
  onPause: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Play/pause based on parent state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {
        // Browser may block autoplay
        onPause();
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, onPause]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration);
      setIsLoaded(true);
    }
  }, []);

  const handleEnded = useCallback(() => {
    onPause();
    setCurrentTime(0);
  }, [onPause]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar || !isLoaded) return;

    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    audio.currentTime = ratio * duration;
    setCurrentTime(audio.currentTime);
  }, [duration, isLoaded]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 ${
      isPlaying 
        ? 'border-primary/30 shadow-md ring-1 ring-primary/10' 
        : 'border-primary/10 shadow-soft hover:shadow-md hover:border-primary/20'
    }`}>
      <div className="p-4 sm:p-5">
        {/* Song header */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isPlaying ? 'bg-primary/15' : 'bg-primary/5'
          }`}>
            <MusicNoteIcon className={`w-5 h-5 ${isPlaying ? 'text-primary' : 'text-primary/60'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-heading text-sm sm:text-base font-semibold truncate ${
              isPlaying ? 'text-primary' : 'text-text-main'
            }`}>
              {song.name}
            </h3>
            <p className="text-xs text-text-muted mt-0.5">SongGift Original</p>
          </div>
        </div>

        {/* Player controls */}
        <div className="flex items-center gap-3">
          {/* Play/Pause button */}
          <button
            onClick={isPlaying ? onPause : onPlay}
            className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isPlaying
                ? 'bg-primary text-white shadow-sm'
                : 'bg-primary/10 text-primary hover:bg-primary/20'
            }`}
            aria-label={isPlaying ? `Pause ${song.name}` : `Play ${song.name}`}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          {/* Progress section */}
          <div className="flex-1 min-w-0">
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
              {/* Seek handle */}
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
          </div>
        </div>
      </div>

      {/* Hidden audio element — preload none for performance */}
      <audio
        ref={audioRef}
        src={song.url}
        preload="none"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
    </div>
  );
}

export default function AudioPlayer({ songs }: AudioPlayerProps) {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {songs.map((song, index) => (
        <SongCard
          key={song.url}
          song={song}
          index={index}
          isPlaying={playingIndex === index}
          onPlay={() => setPlayingIndex(index)}
          onPause={() => setPlayingIndex(null)}
        />
      ))}
    </div>
  );
}
