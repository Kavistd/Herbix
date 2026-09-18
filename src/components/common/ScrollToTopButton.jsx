import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * Floating "back to top" button.
 * Fades in after the page has been scrolled past the fold; smooth-scrolls to top on click.
 * Placed bottom-left so it never collides with the cart toast / mobile CTAs on the right.
 */
export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 480);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-6 left-4 sm:left-6 z-40 w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm border border-cream-200 shadow-soft flex items-center justify-center text-botanical-800 hover:text-white hover:bg-botanical-900 hover:border-botanical-900 hover:-translate-y-0.5 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}
