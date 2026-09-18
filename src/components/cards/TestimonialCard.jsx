import React from 'react';
import { Star, Quote } from 'lucide-react';
import Badge from '../common/Badge';

/**
 * Herbix Customer Testimonial Card
 * 
 * @param {Object} props
 * @param {string} props.quote
 * @param {string} props.author
 * @param {string} props.role - e.g. "University Lecturer", "Soprano Vocalist"
 * @param {string} [props.tag] - e.g. "Throat Comfort"
 * @param {number} [props.rating=5]
 * @param {string} [props.className]
 */
export default function TestimonialCard({
  quote,
  author,
  role,
  tag = 'Throat Comfort',
  rating = 5,
  className = ''
}) {
  return (
    <div className={`relative flex flex-col justify-between bg-white rounded-3xl p-6 md:p-7 border border-cream-200/90 shadow-soft hover:shadow-soft-lg transition-all duration-300 ${className}`}>
      <div>
        {/* Top meta: Stars & Tag */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-lemon-400 text-lemon-400" />
            ))}
          </div>

          <Badge variant="leaf" size="sm">
            {tag}
          </Badge>
        </div>

        {/* Quote text */}
        <p className="text-charcoal-700 text-sm md:text-base leading-relaxed italic">
          "{quote}"
        </p>
      </div>

      {/* Author attribution */}
      <div className="mt-6 pt-4 border-t border-cream-200/80 flex items-center justify-between">
        <div>
          <h4 className="font-display font-bold text-sm text-botanical-950">
            {author}
          </h4>
          <p className="text-xs text-charcoal-500 mt-0.5">
            {role}
          </p>
        </div>

        <div className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-leaf-700 font-display font-bold text-xs border border-cream-200">
          {author.charAt(0)}
        </div>
      </div>
    </div>
  );
}

