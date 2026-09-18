import React from 'react';

/**
 * Herbix Reusable Feature Card
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Lucide icon or custom SVG
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} [props.tag] - Optional small badge/tag
 * @param {'cream' | 'botanical' | 'ginger' | 'leaf'} [props.variant='cream']
 * @param {string} [props.className]
 */
export default function FeatureCard({
  icon,
  title,
  description,
  tag,
  variant = 'cream',
  className = ''
}) {
  const isBotanical = variant === 'botanical';
  const isGinger = variant === 'ginger';

  const containerClasses = {
    cream: 'bg-white/80 border border-cream-200/90 text-charcoal-900 hover:border-leaf-300 shadow-soft',
    botanical: 'bg-botanical-900 border border-botanical-800 text-cream-50 shadow-botanical',
    ginger: 'bg-ginger-50/80 border border-ginger-200/80 text-charcoal-900 shadow-soft',
    leaf: 'bg-leaf-50/80 border border-leaf-200/80 text-charcoal-900 shadow-soft',
  }[variant];

  const iconBgClasses = {
    cream: 'bg-cream-100 text-botanical-800 border border-cream-200',
    botanical: 'bg-botanical-800 text-lemon-300 border border-botanical-700',
    ginger: 'bg-ginger-100 text-ginger-700 border border-ginger-200',
    leaf: 'bg-leaf-100 text-leaf-700 border border-leaf-200',
  }[variant];

  return (
    <div
      className={`
        relative flex flex-col p-6 md:p-8 rounded-3xl
        transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg
        ${containerClasses}
        ${className}
      `}
    >
      {/* Top row: Icon and optional tag */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${iconBgClasses}`}>
          {icon}
        </div>

        {tag && (
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
            isBotanical 
              ? 'bg-botanical-800 text-leaf-300 border border-botanical-700' 
              : 'bg-cream-100 text-charcoal-600 border border-cream-300/80'
          }`}>
            {tag}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className={`font-display font-bold text-xl mb-2.5 ${isBotanical ? 'text-white' : 'text-botanical-950'}`}>
        {title}
      </h3>

      {/* Description */}
      <p className={`text-sm leading-relaxed ${isBotanical ? 'text-leaf-100/85' : 'text-charcoal-600'}`}>
        {description}
      </p>

      {/* Subtle organic botanical accent dot */}
      <div className="mt-5 flex items-center gap-1.5 opacity-60">
        <span className={`w-1.5 h-1.5 rounded-full ${isBotanical ? 'bg-leaf-400' : 'bg-ginger-500'}`} />
        <span className={`w-1 h-1 rounded-full ${isBotanical ? 'bg-leaf-600' : 'bg-lemon-500'}`} />
        <span className={`w-1 h-1 rounded-full ${isBotanical ? 'bg-leaf-800' : 'bg-charcoal-300'}`} />
      </div>
    </div>
  );
}

