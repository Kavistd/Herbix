import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowLeft, ShoppingBag, Sparkles, MessageSquare } from 'lucide-react';
import Button from '../components/common/Button';
import Reveal from '../components/common/Reveal';

const QUICK_LINKS = [
  { to: '/shop', label: 'Shop Herbix', icon: ShoppingBag },
  { to: '/about', label: 'Our Story', icon: Sparkles },
  { to: '/contact', label: 'Contact Us', icon: MessageSquare }
];

export default function NotFoundPage() {
  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <Reveal className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-3xl bg-cream-100 border border-cream-200 flex items-center justify-center text-leaf-600 mb-6 shadow-soft">
          <Leaf className="w-8 h-8" />
        </div>
        <span className="font-display font-black text-6xl sm:text-7xl text-cream-300 leading-none select-none">
          404
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-botanical-950 mt-2">
          Page Not Found
        </h1>
        <p className="text-charcoal-600 mt-3 text-base max-w-md">
          The herbal pathway you are looking for might have moved or is taking a restorative rest.
        </p>
        <Button to="/" variant="ginger" size="md" className="mt-8" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Return to Herbix Home
        </Button>

        {/* Quick links to keep the visit going */}
        <div className="mt-10 pt-8 border-t border-cream-200 w-full max-w-sm">
          <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-widest">
            Or explore
          </span>
          <div className="mt-4 flex flex-col gap-2">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-cream-200 text-sm font-medium text-charcoal-700 hover:text-botanical-950 hover:border-leaf-300 hover:-translate-y-0.5 transition-all duration-200 shadow-soft-xs"
                >
                  <Icon className="w-4 h-4 text-leaf-600 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

