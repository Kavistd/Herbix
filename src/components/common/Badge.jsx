import React from 'react';

/**
 * Herbix Reusable Badge & Promotional Label
 * 
 * @param {Object} props
 * @param {'botanical' | 'leaf' | 'ginger' | 'lemon' | 'cream' | 'outline' | 'glass'} [props.variant='botanical']
 * @param {'sm' | 'md' | 'lg'} [props.size='md']
 * @param {boolean} [props.dot=false]
 * @param {React.ReactNode} [props.icon]
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.children]
 */
export default function Badge({
  children,
  variant = 'botanical',
  size = 'md',
  dot = false,
  icon,
  className = '',
  ...rest
}) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full tracking-wide transition-colors';

  const variantClasses = {
    // Botanical deep green
    botanical: 'bg-botanical-900 text-cream-100 border border-botanical-800/80',
    
    // Fresh leaf green
    leaf: 'bg-leaf-100 text-botanical-900 border border-leaf-200/90',
    
    // Warm ginger tone
    ginger: 'bg-ginger-100 text-ginger-800 border border-ginger-200/90',
    
    // Zest lemon
    lemon: 'bg-lemon-100 text-lemon-800 border border-lemon-200/90',
    
    // Warm neutral cream
    cream: 'bg-cream-200/80 text-charcoal-800 border border-cream-300/80',
    
    // Botanical fine outline
    outline: 'bg-transparent text-botanical-900 border border-botanical-800/40',

    // Glassmorphic translucent pill
    glass: 'bg-white/80 backdrop-blur-md text-botanical-950 border border-cream-200/90 shadow-soft-xs'
  }[variant] || '';

  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1.5',
    md: 'text-xs px-3 py-1 gap-1.5',
    lg: 'text-sm px-4 py-1.5 gap-2'
  }[size];

  const dotColor = {
    botanical: 'bg-leaf-400',
    leaf: 'bg-leaf-600',
    ginger: 'bg-ginger-500',
    lemon: 'bg-lemon-500',
    cream: 'bg-charcoal-400',
    outline: 'bg-botanical-700',
    glass: 'bg-leaf-500'
  }[variant] || 'bg-current';

  return (
    <span className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`} {...rest}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 animate-pulse ${dotColor}`} />
      )}
      {icon && (
        <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </span>
  );
}

