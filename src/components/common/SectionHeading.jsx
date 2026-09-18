import React from 'react';
import Badge from './Badge';

/**
 * Herbix Reusable Section Heading
 * 
 * @param {Object} props
 * @param {string} [props.eyebrow] - Small botanical tag above title
 * @param {'botanical' | 'leaf' | 'ginger' | 'lemon' | 'cream'} [props.eyebrowVariant='leaf']
 * @param {React.ReactNode} props.title - Primary heading text or JSX
 * @param {string} [props.description] - Supporting descriptive text
 * @param {'left' | 'center' | 'right'} [props.align='center']
 * @param {'sm' | 'md' | 'lg' | 'xl'} [props.size='lg']
 * @param {boolean} [props.isDark=false]
 * @param {React.ReactNode} [props.action] - Optional CTA button or link
 * @param {string} [props.className]
 */
export default function SectionHeading({
  eyebrow,
  eyebrowVariant = 'leaf',
  title,
  description,
  align = 'center',
  size = 'lg',
  isDark = false,
  action,
  className = ''
}) {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto'
  }[align];

  const titleSizes = {
    sm: 'text-2xl md:text-3xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-3xl sm:text-4xl md:text-5xl',
    xl: 'text-4xl sm:text-5xl md:text-6xl tracking-tight'
  }[size];

  const maxWidthClass = align === 'center' ? 'max-w-2xl' : 'max-w-xl';

  return (
    <div className={`flex flex-col ${alignClasses} ${className}`}>
      {/* Eyebrow tag */}
      {eyebrow && (
        <div className="mb-3.5">
          <Badge variant={eyebrowVariant} size="md" dot>
            {eyebrow}
          </Badge>
        </div>
      )}

      {/* Main Title */}
      <h2 className={`font-display font-bold leading-[1.15] ${titleSizes} ${isDark ? 'text-white' : 'text-botanical-950'}`}>
        {title}
      </h2>

      {/* Subtitle / Description */}
      {description && (
        <p className={`mt-4 text-base md:text-lg leading-relaxed ${maxWidthClass} ${isDark ? 'text-leaf-200/90' : 'text-charcoal-600'}`}>
          {description}
        </p>
      )}

      {/* Optional action element */}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}

