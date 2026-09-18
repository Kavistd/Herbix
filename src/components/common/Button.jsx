import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Herbix Reusable Button Component
 * 
 * @param {Object} props
 * @param {'primary' | 'ginger' | 'secondary' | 'outline' | 'ghost' | 'lemon'} [props.variant='primary']
 * @param {'sm' | 'md' | 'lg' | 'xl'} [props.size='md']
 * @param {'full' | 'xl' | 'lg'} [props.rounded='full']
 * @param {boolean} [props.isLoading=false]
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.to] - If provided, renders as React Router Link
 * @param {string} [props.href] - If provided, renders as <a> tag
 * @param {React.ReactNode} [props.leftIcon]
 * @param {React.ReactNode} [props.rightIcon]
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.children]
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'full',
  isLoading = false,
  disabled = false,
  to,
  href,
  leftIcon,
  rightIcon,
  className = '',
  ...rest
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none disabled:hover:translate-y-0 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]';

  const variantClasses = {
    // Deep botanical green: primary brand button
    primary: 'bg-botanical-900 text-cream-50 hover:bg-botanical-800 focus-visible:ring-botanical-900 shadow-soft hover:shadow-botanical',
    
    // Warm ginger tone: vibrant CTA
    ginger: 'bg-ginger-500 text-white hover:bg-ginger-600 focus-visible:ring-ginger-500 shadow-soft hover:shadow-ginger',
    
    // Warm cream / sand tone
    secondary: 'bg-cream-200/90 text-botanical-950 hover:bg-cream-300 focus-visible:ring-cream-400 border border-cream-300/80',
    
    // Botanical outline
    outline: 'border-2 border-botanical-900 text-botanical-900 bg-transparent hover:bg-botanical-900 hover:text-cream-50 focus-visible:ring-botanical-900',
    
    // Soft ghost
    ghost: 'text-charcoal-700 hover:text-botanical-950 hover:bg-cream-200/70 focus-visible:ring-leaf-500',
    
    // Lemon zest
    lemon: 'bg-lemon-400 text-botanical-950 font-semibold hover:bg-lemon-300 focus-visible:ring-lemon-400 shadow-soft hover:shadow-md'
  }[variant] || '';

  const sizeClasses = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
    xl: 'text-lg px-8 py-4 gap-3 font-semibold'
  }[size];

  const roundedClasses = {
    full: 'rounded-full',
    xl: 'rounded-2xl',
    lg: 'rounded-xl'
  }[rounded];

  const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${roundedClasses} ${className}`;

  const content = (
    <>
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : leftIcon ? (
        <span className="inline-flex shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {!isLoading && rightIcon && (
        <span className="inline-flex shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">{rightIcon}</span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`group ${combinedClasses}`} {...rest}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={`group ${combinedClasses}`} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={`group ${combinedClasses}`}
      {...rest}
    >
      {content}
    </button>
  );
}

