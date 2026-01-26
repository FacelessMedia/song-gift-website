export default function LimitedOffer() {
  return (
    <section className="py-8 bg-gradient-to-r from-primary to-primary-dark">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="text-center text-white">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="font-body text-sm font-semibold uppercase tracking-wide">Limited Time Offer</span>
          </div>
          
          <h3 className="font-heading text-2xl md:text-3xl font-bold mb-2">
            Save 30% on Your First Song
          </h3>
          
          <p className="font-body text-lg mb-6 opacity-90">
            Use code <span className="font-semibold bg-white/20 px-2 py-1 rounded">FIRST30</span> at checkout. Offer expires in 48 hours!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-white text-primary hover:bg-gray-50 font-body font-semibold py-3 px-8 rounded-2xl transition-colors shadow-soft">
              Begin Your Song
            </button>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1-1h2v6h-2V1zm0 8h2v6h-2V9z"/>
              </svg>
              <span>Only 127 discounts remaining</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
