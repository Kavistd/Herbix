import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Instagram,
  Facebook,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import Logo from '../common/Logo';
import Button from '../common/Button';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="relative bg-botanical-950 text-cream-100 pt-16 pb-12 overflow-hidden border-t border-botanical-900">
      {/* Ambient background botanical glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-leaf-900/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full bg-ginger-900/15 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Subscription Card Banner */}
        <div className="bg-botanical-900/90 rounded-3xl border border-leaf-700/50 p-6 sm:p-10 mb-16 shadow-botanical relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-ginger-500/10 blur-xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-leaf-800/80 text-leaf-300 text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-ginger-400" />
                <span>The Herbal Ritual Newsletter</span>
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
                Everyday throat comfort, straight to your inbox.
              </h3>
              <p className="text-sm text-cream-200/80 mt-2 max-w-xl leading-relaxed">
                Subscribe for herbal wellness tips, exclusive batch drops, and enjoy <strong>15% off</strong> your first pouch of Herbix chewable bites.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-leaf-900/80 border border-leaf-600 text-leaf-200">
                  <CheckCircle2 className="w-5 h-5 text-lemon-400 shrink-0" />
                  <span className="text-sm font-medium">Thank you! Welcome to the Herbix family.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-leaf-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      className="w-full bg-botanical-950/80 text-white placeholder:text-leaf-300/60 pl-11 pr-4 py-3 rounded-full text-sm border border-leaf-700/80 focus:outline-none focus:border-ginger-400 focus:ring-2 focus:ring-ginger-400/20"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="ginger"
                    size="md"
                    className="shrink-0"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-botanical-800">
          {/* Column 1: Brand info (4 cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <Logo variant="light" size="md" showTagline />
            <p className="mt-4 text-sm text-cream-200/80 leading-relaxed max-w-sm">
              "Herbal Comfort in Every Bite."
            </p>
            <p className="mt-2 text-xs text-leaf-200/70 leading-relaxed max-w-sm">
              Natural herbal chewable bites crafted with Ceylon ginger, sun-ripened lemon, and highland black pepper. Designed for instant everyday throat comfort without brewing traditional herbal drinks.
            </p>

            {/* Social media icons */}
            <div className="mt-6 flex items-center gap-3">
              <a 
                href="#instagram" 
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-botanical-900 flex items-center justify-center text-leaf-300 hover:text-white hover:bg-ginger-600 transition-colors border border-leaf-800"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="#facebook" 
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-botanical-900 flex items-center justify-center text-leaf-300 hover:text-white hover:bg-ginger-600 transition-colors border border-leaf-800"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/94112345678"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-botanical-900 flex items-center justify-center text-leaf-300 hover:text-white hover:bg-ginger-600 transition-colors border border-leaf-800"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>

            {/* Sri Lankan Heritage Badge */}
            <div className="mt-6 flex items-center gap-2 text-xs text-leaf-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-lemon-400" />
              <span>Inspired by traditional Sri Lankan herbal wisdom</span>
            </div>
          </div>

          {/* Column 2: Quick links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold text-leaf-300 uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-cream-200/80">
              <li>
                <Link to="/" className="hover:text-white hover:underline transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white hover:underline transition-colors">Shop</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white hover:underline transition-colors">Our Story</Link>
              </li>
              <li>
                <Link to="/about#ingredients" className="hover:text-white hover:underline transition-colors">Ingredients</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white hover:underline transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer links (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold text-leaf-300 uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-sm text-cream-200/80">
              <li>
                <Link to="/contact#faq" className="hover:text-white hover:underline transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact#faq" className="hover:text-white hover:underline transition-colors">
                  Delivery Information
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white hover:underline transition-colors">
                  Herbix Original
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white hover:underline transition-colors">
                  Coming Soon Variants
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white hover:underline transition-colors">
                  View Shopping Bag
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact info (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold text-leaf-300 uppercase tracking-wider mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-xs text-cream-200/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-ginger-400 shrink-0 mt-0.5" />
                <span>Herbix Botanicals, Colombo, Sri Lanka (Available worldwide)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-ginger-400 shrink-0" />
                <a href="mailto:care@herbixcomfort.com" className="hover:text-white transition-colors">
                  care@herbixcomfort.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-ginger-400 shrink-0" />
                <span>+94 11 234 5678 (Mon–Fri, 9am–6pm IST)</span>
              </li>
            </ul>

            <div className="mt-5 p-3 rounded-xl bg-botanical-900 border border-leaf-800 text-[11px] text-leaf-200">
              💡 <strong>Bulk & Corporate:</strong> Special packs for universities, call centers, and vocal studios.
            </div>
          </div>
        </div>

        {/* Bottom row: Copyright & Legal */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-leaf-300/70">
          <p>© {new Date().getFullYear()} Herbix Botanicals Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#shipping" className="hover:text-white transition-colors">Shipping & Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

