'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (href: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = href;
    }
    closeMobileMenu();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-soft">
      <div className="max-w-[1400px] mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation('/')}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <img
                src="/songgift_logo_black.png"
                alt="SongGift"
                className="h-8 w-auto"
              />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <button 
              onClick={() => handleNavigation('/')}
              className="font-body text-text-main hover:text-primary transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavigation('/create')}
              className="font-body text-text-main hover:text-primary transition-colors"
            >
              Create
            </button>
            <button 
              onClick={() => handleNavigation('/track-order')}
              className="font-body text-text-main hover:text-primary transition-colors"
            >
              Track Order
            </button>
            <button 
              onClick={() => handleNavigation('/reviews')}
              className="font-body text-text-main hover:text-primary transition-colors"
            >
              Reviews
            </button>
            <button 
              onClick={() => handleNavigation('/playlist')}
              className="font-body text-text-main hover:text-primary transition-colors"
            >
              Playlist
            </button>
            <button 
              onClick={() => handleNavigation('/faq')}
              className="font-body text-text-main hover:text-primary transition-colors"
            >
              FAQ
            </button>
            <button 
              onClick={() => handleNavigation('/contact')}
              className="font-body text-text-main hover:text-primary transition-colors"
            >
              Contact
            </button>
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden lg:flex items-center">
            <Button 
              variant="primary" 
              size="md"
              onClick={() => handleNavigation('/create')}
            >
              Gift a Custom Song
            </Button>
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-text-main hover:text-primary transition-colors"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => handleNavigation('/')}
                className="font-body text-text-main hover:text-primary transition-colors text-left py-2"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavigation('/create')}
                className="font-body text-text-main hover:text-primary transition-colors text-left py-2"
              >
                Create / Gift a Custom Song
              </button>
              <button 
                onClick={() => handleNavigation('/track-order')}
                className="font-body text-text-main hover:text-primary transition-colors text-left py-2"
              >
                Track Order
              </button>
              <button 
                onClick={() => handleNavigation('/reviews')}
                className="font-body text-text-main hover:text-primary transition-colors text-left py-2"
              >
                Reviews
              </button>
              <button 
                onClick={() => handleNavigation('/playlist')}
                className="font-body text-text-main hover:text-primary transition-colors text-left py-2"
              >
                Playlist
              </button>
              <button 
                onClick={() => handleNavigation('/faq')}
                className="font-body text-text-main hover:text-primary transition-colors text-left py-2"
              >
                FAQ
              </button>
              <button 
                onClick={() => handleNavigation('/contact')}
                className="font-body text-text-main hover:text-primary transition-colors text-left py-2"
              >
                Contact
              </button>
              
              {/* Mobile CTA Button */}
              <div className="pt-4 border-t border-gray-100">
                <Button 
                  variant="primary" 
                  size="md"
                  fullWidth
                  onClick={() => handleNavigation('/create')}
                >
                  Gift a Custom Song
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
