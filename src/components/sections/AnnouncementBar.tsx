'use client';

export default function AnnouncementBar() {
  const handleClaimOffer = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/create';
    }
  };

  return (
    <div className="bg-primary text-white py-3 px-4 text-center">
      <div className="max-w-[1400px] mx-auto">
        <p className="font-body text-sm md:text-base">
          💕 Valentine's Day Special: 60% Off All Custom Songs!
          <button 
            onClick={handleClaimOffer}
            className="ml-2 underline hover:no-underline font-semibold bg-transparent border-none text-white cursor-pointer"
          >
            Claim Offer →
          </button>
        </p>
      </div>
    </div>
  );
}
