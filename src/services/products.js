// Adapt MongoDB documents to the existing storefront component contract.
export function normalizeProduct(product) {
  const images = product.images?.length ? product.images : (product.image ? [product.image] : []);
  const isAvailable = product.status === 'ACTIVE' && !product.isComingSoon && product.stock > 0;
  return {
    ...product, id: product._id, images, image: images[0] || '',
    originalPrice: product.originalPrice > product.price ? product.originalPrice : null,
    subtitle: product.shortDescription || '',
    description: product.description || '', ingredients: product.ingredients || [],
    isAvailable,
    availability: product.isComingSoon ? 'Coming Soon' : isAvailable ? 'In Stock' : 'Out of Stock',
    badge: product.isComingSoon ? 'Coming Soon' : !isAvailable ? 'Out of Stock' : product.featured ? 'Featured' : '',
    unitCost: product.bitesCount ? 'LKR ' + (product.price / product.bitesCount).toFixed(2) + ' / bite' : ''
  };
}
