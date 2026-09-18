import React, { useEffect, useState } from 'react';
import { ZoomIn } from 'lucide-react';
export default function ProductGallery({ product, className = '' }) {
  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [product.id]);
  const images = product.images || [];
  return <div className={'flex flex-col gap-4 ' + className}>
    <div className="relative aspect-square rounded-4xl bg-cream-100 border border-cream-200 shadow-soft overflow-hidden group">
      {images.length ? <img src={images[active] || images[0]} alt={product.name + ' - image ' + (active + 1)} className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-125" /> :
        <div className="h-full flex items-center justify-center text-charcoal-500">No product image available</div>}
      {images.length > 0 && <span className="absolute bottom-4 right-4 flex items-center gap-2 text-xs bg-white rounded-full px-3 py-1"><ZoomIn className="w-4 h-4" />Hover to zoom</span>}
    </div>
    {images.length > 1 && <div className="grid grid-cols-4 gap-3">{images.map((src, index) => <button key={index} type="button" onClick={() => setActive(index)} aria-label={'Show image ' + (index + 1)} aria-pressed={active === index} className={'rounded-2xl overflow-hidden border-2 ' + (active === index ? 'border-leaf-600' : 'border-cream-200')}>
      <img src={src} alt="" className="w-full aspect-square object-cover" />
    </button>)}</div>}
  </div>;
}
