// Existing basic information only. Unknown inventory starts at zero.
// No estimated variants, weight, shelf life, dosage, or unverified formulation claims.
const products = [{
  name: 'Herbix Original', slug: 'herbix-original',
  shortDescription: 'Ginger + Lemon + Black Pepper',
  description: 'A convenient herbal chewable bite combining ginger, lemon and black pepper.',
  ingredients: ['Ginger', 'Lemon', 'Black Pepper'],
  price: 850, stock: 0, images: ['/images/product.jpg'], category: 'Classic',
  status: 'ACTIVE', featured: true, isComingSoon: false
}];
module.exports = { products };
