import React, { useState } from 'react';
import { Sparkles, X, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AnnouncementBar() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="relative bg-botanical-950 text-cream-100 text-xs py-2 px-4 border-b border-botanical-800 transition-all z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left hint */}
        <div className="hidden lg:flex items-center gap-1.5 text-leaf-300 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Authentic Ceylon Herbal Heritage</span>
        </div>

        {/* Center message */}
        <div className="flex-1 text-center flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-ginger-400 animate-pulse hidden sm:inline-block" />
          <span className="font-normal text-cream-200">
            Herbal comfort in every bite.
          </span>
          <span className="hidden md:inline font-semibold text-white">
            Free islandwide delivery on orders over LKR 2,000.
          </span>
          <Link 
            to="/shop" 
            className="underline underline-offset-2 hover:text-ginger-300 font-medium ml-1 transition-colors"
          >
            Claim yours &rarr;
          </Link>
        </div>

        {/* Dismiss button */}
        <div className="flex items-center justify-end">
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close banner"
            className="p-1 rounded-md text-leaf-300 hover:text-white hover:bg-botanical-900 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

