export type Song = {
  file: string;
  title: string;
  src: string;
};

// All 42 mp3 files in public/Musical-Content/Songs/, sorted alphabetically.
// This list is the single source of truth — deterministic order, no randomness.
const MP3_FILES: string[] = [
  "Breathe Again, Kiddo.mp3",
  "Breathe Again.mp3",
  "Chaves no Bolso.mp3",
  "Chili on the Floor.mp3",
  "Coffee Shop Celebrations.mp3",
  "Dieciséis en el Horizonte.mp3",
  "Eighteen Years of You.mp3",
  "En Casa, Mi Vida.mp3",
  "Five Candles at Sunset.mp3",
  "Five Candles, Kiddo.mp3",
  "Front Porch Promise.mp3",
  "Gas Station Bouquet.mp3",
  "Gas Station Flowers.mp3",
  "Ingat Palagi.mp3",
  "Keys in Your Pocket.mp3",
  "Left-Lane Home.mp3",
  "Lluvia en el Porche.mp3",
  "Lost Roads, Blue Hoodie.mp3",
  "Lost Roads, Found Laughter.mp3",
  "Mi Cielo, Aquí Sigues.mp3",
  "Monday Reset.mp3",
  "My Person, Always.mp3",
  "No Crumbs, Only Peace.mp3",
  "No Crumbs, Só Paz.mp3",
  "Parking Lot Goodbyes.mp3",
  "Petites Victoires.mp3",
  "Porchlight Big Guy.mp3",
  "Porchlight Promises.mp3",
  "Quiet Victories, My Person.mp3",
  "Sa Dulo ng Araw.mp3",
  "Still Carrying You.mp3",
  "Still Smiling in the Rain.mp3",
  "Still Smiling, Big Guy.mp3",
  "Still Smiling, Captain.mp3",
  "Still Smiling, Sunshine.mp3",
  "Still Smiling, Sweet Pea.mp3",
  "Sunshine in the Rearview.mp3",
  "Thank God for Funnel Cake.mp3",
  "The First Time I Knew.mp3",
  "The Hoodie You Left Here.mp3",
  "Todavía Aquí.mp3",
  "You Feel Like Home.mp3",
];

export const SONGS: Song[] = MP3_FILES.map((file) => ({
  file,
  title: file.replace(/\.mp3$/i, ''),
  src: `/Musical-Content/Songs/${file}`,
}));

// Get song by index — NO looping, NO modulo. Throws if out of range.
export function getSongByIndex(index: number): Song {
  if (index < 0 || index >= SONGS.length) {
    throw new Error(
      `getSongByIndex: index ${index} out of range. Only ${SONGS.length} songs available. Add more mp3 files to public/Musical-Content/Songs/.`
    );
  }
  return SONGS[index];
}
