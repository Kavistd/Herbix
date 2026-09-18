import React from 'react';
import Button from './Button';
export default function ProductState({ loading, error, retry, empty = 'No products are available yet.' }) {
  return <div className="p-8 text-center rounded-3xl bg-white border border-cream-200" role={error ? 'alert' : 'status'}>
    <p className="text-sm text-charcoal-600">{loading ? 'Loading products...' : error || empty}</p>
    {error && retry && <Button className="mt-4" onClick={retry}>Try again</Button>}
  </div>;
}
