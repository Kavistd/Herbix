import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import Badge from '../common/Badge';

/**
 * Herbix Ingredient Showcase Card (Ginger / Lemon / Black Pepper)
 * 
 * @param {Object} props
 * @param {Object} props.ingredient - Ingredient data item
 * @param {string} [props.className]
 */
export default function IngredientCard({
  ingredient,
  className = ''
}) {
  const isGinger = ingredient.id === 'ginger';
  const isLemon = ingredient.id === 'lemon';
  const isPepper = ingredient.id === 'black-pepper';

  const colorTheme = isGinger
    ? {
        border: 'border-ginger-200/80 hover:border-ginger-400',
        badge: 'ginger',
        accentBg: 'bg-ginger-500/10 text-ginger-700',
        dot: 'bg-ginger-500',
        glow: 'from-ginger-200/40 to-transparent'
      }
    : isLemon
    ? {
        border: 'border-lemon-200/80 hover:border-lemon-400',
        badge: 'lemon',
        accentBg: 'bg-lemon-500/15 text-lemon-800',
        dot: 'bg-lemon-500',
        glow: 'from-lemon-200/40 to-transparent'
      }
    : {
        border: 'border-botanical-200/80 hover:border-botanical-400',
        badge: 'botanical',
        accentBg: 'bg-botanical-900/10 text-botanical-800',
        dot: 'bg-botanical-800',
        glow: 'from-leaf-200/40 to-transparent'
      };

  return (
    <div
      className={`
        group relative flex flex-col justify-between
        bg-white rounded-3xl p-6 sm:p-8
        border ${colorTheme.border}
        shadow-soft hover:shadow-soft-lg
        transition-all duration-300 hover:-translate-y-1.5
        overflow-hidden
        ${className}
      `}
    >
      {/* Ambient background glow */}
      <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br ${colorTheme.glow} blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

      <div>
        {/* Header: Role Badge and Potency Tag */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <Badge variant={colorTheme.badge} size="sm">
            {ingredient.role}
          </Badge>
          <span className="text-[11px] font-mono text-charcoal-400 tracking-tight">
            {ingredient.scientificName}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-2xl text-botanical-950 group-hover:text-ginger-700 transition-colors">
          {ingredient.name}
        </h3>

        {/* Key benefit callout */}
        <div className="mt-3 flex items-start gap-2 text-xs font-semibold text-charcoal-800 bg-cream-100/90 p-3 rounded-xl border border-cream-200/70">
          <Sparkles className="w-4 h-4 shrink-0 text-ginger-600 mt-0.5" />
          <span>{ingredient.keyBenefit}</span>
        </div>

        {/* Description */}
        <p className="mt-4 text-sm text-charcoal-600 leading-relaxed">
          {ingredient.description}
        </p>
      </div>

      {/* Footer Specs: Flavor notes & Sourcing */}
      <div className="mt-6 pt-5 border-t border-cream-200/80 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-charcoal-500">Flavor profile:</span>
          <span className="font-medium text-botanical-900">{ingredient.flavorNotes}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-charcoal-500">Extraction method:</span>
          <span className="font-medium text-botanical-900">{ingredient.potency}</span>
        </div>
      </div>
    </div>
  );
}

