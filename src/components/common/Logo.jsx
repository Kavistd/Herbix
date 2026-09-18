import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Herbix Brand Logo
 * Renders the official Herbix badge artwork (icon + wordmark + tagline are
 * baked into the artwork itself, so no separate text lockup is rendered here).
 *
 * @param {Object} props
 * @param {'dark' | 'light' | 'mono'} [props.variant='dark'] - Accepted for backward compatibility; the badge artwork is self-colored and unaffected by this prop.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Sizing
 * @param {boolean} [props.showTagline=false] - Renders the badge slightly larger so its built-in tagline stays legible (used to shrink the mark on scroll)
 * @param {string} [props.className] - Extra class names
 */
export default function Logo({
  variant = 'dark',
  size = 'md',
  showTagline = false,
  className = '',
  ...rest
}) {
  const sizeClasses = {
    sm: showTagline ? 'w-11 h-11' : 'w-9 h-9',
    md: showTagline ? 'w-12 h-12 md:w-14 md:h-14' : 'w-10 h-10 md:w-11 md:h-11',
    lg: showTagline ? 'w-16 h-16 md:w-20 md:h-20' : 'w-12 h-12 md:w-14 md:h-14',
  }[size];

  return (
    <Link
      to="/"
      className={`inline-flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-leaf-500 rounded-full transition-transform duration-200 active:scale-95 ${className}`}
      aria-label="Herbix - Return to homepage"
      {...rest}
    >
      <img
        src="/images/herbix-logo-256.png"
        alt="Herbix — Herbal Comfort in Every Bite"
        className={`${sizeClasses} rounded-full object-contain shadow-soft transition-all duration-300 group-hover:rotate-3`}
      />
    </Link>
  );
}

