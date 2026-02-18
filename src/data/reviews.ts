import { getSongByIndex, SONGS } from './songs';

export type Review = {
  id: string;
  type: "video" | "audio";
  name: string;
  relationship: string;
  rating: number;
  reviewText: string;
  mediaFile: string;        // mp4 for video, mp3 for audio
  songName: string;         // derived from filename, no extension
};

// Base review data — only ONE video, all others audio.
// Song assignment happens below: each audio review gets a unique song
// from the alphabetically-sorted SONGS list (index 0, 1, 2, …).
const baseReviews: Omit<Review, 'mediaFile' | 'songName'>[] = [
  {
    id: "sarah-johnson-anniversary",
    type: "video",
    name: "Sarah Johnson",
    relationship: "Anniversary Gift",
    rating: 5,
    reviewText: "The song captured our love story perfectly. My husband cried when he heard it on our 10th anniversary. It's now our most treasured possession."
  },
  {
    id: "michael-chen-wedding",
    type: "audio",
    name: "Michael Chen",
    relationship: "Wedding Surprise",
    rating: 5,
    reviewText: "I surprised my bride with a custom song during our reception. The entire room was in tears. SongGift made our special day even more magical."
  },
  {
    id: "emma-rodriguez-memorial",
    type: "audio",
    name: "Emma Rodriguez",
    relationship: "Memorial Tribute",
    rating: 5,
    reviewText: "They helped me honor my grandmother's memory with a beautiful song. It brought comfort to our whole family during a difficult time."
  },
  {
    id: "david-kim-birthday",
    type: "audio",
    name: "David Kim",
    relationship: "Birthday Surprise",
    rating: 5,
    reviewText: "My daughter's face lit up when she heard her personalized birthday song. The musicians captured her personality perfectly in the melody."
  },
  {
    id: "lisa-thompson-graduation",
    type: "audio",
    name: "Lisa Thompson",
    relationship: "Graduation Gift",
    rating: 5,
    reviewText: "What an incredible way to celebrate my son's graduation! The song tells his journey and achievements beautifully."
  },
  {
    id: "james-wilson-valentine",
    type: "audio",
    name: "James Wilson",
    relationship: "Valentine's Day",
    rating: 5,
    reviewText: "This was the most romantic gift I've ever given. My wife still plays our song every morning. Worth every penny!"
  },
  {
    id: "maria-garcia-memorial",
    type: "audio",
    name: "Maria Garcia",
    relationship: "Memorial Song",
    rating: 5,
    reviewText: "We created this in memory of my father. It helps us feel close to him and celebrates his life in the most beautiful way."
  },
  {
    id: "robert-kim-proposal",
    type: "audio",
    name: "Robert Kim",
    relationship: "Proposal Song",
    rating: 5,
    reviewText: "I proposed with this playing in the background. It told our whole story leading up to that moment. She said yes!"
  },
  {
    id: "jennifer-adams-christmas",
    type: "audio",
    name: "Jennifer Adams",
    relationship: "Christmas Gift",
    rating: 5,
    reviewText: "This was under the Christmas tree for my husband. 25 years of marriage captured in one beautiful song."
  },
  {
    id: "carlos-martinez-newborn",
    type: "audio",
    name: "Carlos Martinez",
    relationship: "New Baby",
    rating: 5,
    reviewText: "We made this for our newborn son. It's about our hopes and dreams for him. We play it during bedtime every night."
  },
  {
    id: "amanda-foster-friendship",
    type: "audio",
    name: "Amanda Foster",
    relationship: "Best Friend Gift",
    rating: 5,
    reviewText: "20 years of friendship deserved something special. This song captures all our adventures and inside jokes perfectly."
  },
  {
    id: "thomas-lee-retirement",
    type: "audio",
    name: "Thomas Lee",
    relationship: "Retirement Gift",
    rating: 5,
    reviewText: "We surprised our boss with this for his retirement. 30 years of leadership and friendship captured beautifully."
  }
];

// Build-time guard: ensure we have enough unique songs for all audio reviews
const audioReviewCount = baseReviews.filter((r) => r.type === "audio").length;
if (audioReviewCount > SONGS.length) {
  throw new Error(
    `Not enough songs for reviews! Need ${audioReviewCount} unique songs but only ${SONGS.length} available. ` +
    `Add more mp3 files to public/Musical-Content/Songs/ and update src/data/songs.ts.`
  );
}

// Build final reviews — each audio review gets a unique song (no duplication)
export const REVIEWS: Review[] = (() => {
  let audioIndex = 0;

  return baseReviews.map((review) => {
    if (review.type === "video") {
      return {
        ...review,
        mediaFile: "/Musical-Content/Videos/reaction1.mp4",
        songName: "Video Testimonial"
      };
    }

    // Audio review — assign next unique song from sorted list
    const song = getSongByIndex(audioIndex);
    audioIndex++;

    return {
      ...review,
      mediaFile: song.src,
      songName: song.title
    };
  });
})();
