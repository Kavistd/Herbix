import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Herbix Reusable Accordion (single-open, e.g. for FAQs)
 *
 * @param {Object} props
 * @param {{question: string, answer: string}[]} props.items
 * @param {number} [props.defaultOpenIndex=-1] - Index open by default, -1 for none
 * @param {string} [props.className]
 */
export default function Accordion({ items = [], defaultOpenIndex = -1, className = '' }) {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

  return (
    <div className={`divide-y divide-cream-200 ${className}`}>
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : idx)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 text-left py-4 group focus:outline-none"
            >
              <span className="font-display font-bold text-sm sm:text-base text-botanical-950 group-hover:text-ginger-600 transition-colors">
                {item.question}
              </span>
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isOpen
                    ? 'bg-leaf-100 text-leaf-700 rotate-180'
                    : 'bg-cream-100 text-charcoal-600 group-hover:bg-cream-200'
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </span>
            </button>

            {/* Smooth height transition via CSS grid trick (no JS height measuring) */}
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="pb-4 pr-8 sm:pr-10 text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
