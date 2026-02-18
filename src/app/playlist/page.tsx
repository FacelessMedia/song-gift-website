import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import AnnouncementBar from '@/components/sections/AnnouncementBar';
import Navigation from '@/components/navigation/Navigation';
import Footer from '@/components/sections/Footer';
import AudioPlayer from '@/components/ui/AudioPlayer';

export const metadata: Metadata = {
  title: "Song Playlist",
  description: "Listen to sample songs created by SongGift. Hear the quality and emotion our professional musicians bring to every personalized custom song.",
};

// Force dynamic rendering so the file list is always fresh
export const dynamic = 'force-dynamic';

interface Song {
  name: string;
  url: string;
}

function getSongs(): Song[] {
  const musicDir = path.join(process.cwd(), 'public', 'music');
  
  try {
    const files = fs.readdirSync(musicDir);
    
    return files
      .filter((file) => file.toLowerCase().endsWith('.mp3'))
      .sort((a, b) => a.localeCompare(b))
      .map((file) => ({
        name: file.replace(/\.mp3$/i, ''),
        url: `/music/${encodeURIComponent(file)}`,
      }));
  } catch (error) {
    console.error('Error reading music directory:', error);
    return [];
  }
}

export default function PlaylistPage() {
  const songs = getSongs();

  return (
    <>
      <AnnouncementBar />
      <Navigation />
      
      <main className="min-h-screen bg-background-soft">
        {/* Header */}
        <section className="bg-white border-b border-primary/10">
          <div className="max-w-[1400px] mx-auto px-4 py-12 sm:py-16 text-center">
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text-main mb-4">
              Song Playlist
            </h1>
            <p className="font-body text-text-muted text-base sm:text-lg max-w-2xl mx-auto">
              Listen to songs crafted by our musicians. Each one was created from a real love story — yours could sound just as beautiful.
            </p>
            <p className="font-body text-sm text-text-muted mt-3">
              {songs.length} {songs.length === 1 ? 'song' : 'songs'} available
            </p>
          </div>
        </section>

        {/* Songs Grid */}
        <section className="max-w-[1400px] mx-auto px-4 py-8 sm:py-12">
          {songs.length > 0 ? (
            <AudioPlayer songs={songs} />
          ) : (
            <div className="text-center py-16">
              <p className="font-body text-text-muted text-lg">
                No songs available at the moment. Check back soon!
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
