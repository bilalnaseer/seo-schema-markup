import { mountGenerator } from './core.js';

mountGenerator({
  fileName: 'product-schema.json',
  sample: {
    name: 'Wireless Noise-Cancelling Headphones',
    image: 'https://example.com/images/headphones.jpg',
    description: 'Over-ear Bluetooth headphones with 30-hour battery life.',
    brand: 'Acme Audio',
    sku: 'ACM-WH-100',
    price: '79.99', priceCurrency: 'USD', availability: 'https://schema.org/InStock',
    url: 'https://example.com/products/headphones',
    priceValidUntil: '2026-12-31',
    ratingValue: '4.6', reviewCount: '128', bestRating: '5', worstRating: '1',
    reviewAuthor: 'Jane Doe', reviewRating: '5',
    reviewAuthorUrl: 'https://example.com/reviewers/jane-doe',
    reviewBody: 'Excellent sound quality and the battery easily lasts a full day.',
    reviewDate: '2026-03-04',
  },
  fields: [
    { name: 'name', label: 'Product name', type: 'text', required: true, placeholder: 'Wireless Headphones' },
    { name: 'image', label: 'Image URL', type: 'url', recommended: true, placeholder: 'https://example.com/photo.jpg', hint: 'A high-resolution product image.' },
    { name: 'description', label: 'Description', type: 'textarea', recommended: true, rows: 2 },
    { name: 'price', label: 'Price', type: 'text', recommended: true, placeholder: '79.99', hint: 'Number only, no currency symbol.' },
    { name: 'priceCurrency', label: 'Currency', type: 'text', recommended: true, placeholder: 'USD', hint: '3-letter ISO 4217 code.' },
    { name: 'availability', label: 'Availability', type: 'select', recommended: true, options: [
      { value: '', label: '—' },
      { value: 'https://schema.org/InStock', label: 'In stock' },
      { value: 'https://schema.org/OutOfStock', label: 'Out of stock' },
      { value: 'https://schema.org/PreOrder', label: 'Pre-order' },
      { value: 'https://schema.org/BackOrder', label: 'Back-order' },
    ] },
    { name: 'brand', label: 'Brand', type: 'text', advanced: true },
    { name: 'sku', label: 'SKU', type: 'text', advanced: true },
    { name: 'url', label: 'Product URL', type: 'url', advanced: true },
    { name: 'priceValidUntil', label: 'Price valid until', type: 'date', advanced: true },
    { name: 'ratingValue', label: 'Average rating', type: 'text', advanced: true, hint: 'Only add if you have real reviews on the page.' },
    { name: 'reviewCount', label: 'Number of reviews', type: 'number', advanced: true, hint: 'Required alongside an average rating.' },
    { name: 'bestRating', label: 'Best possible rating', type: 'text', advanced: true, placeholder: '5', hint: 'Highest value on your scale (defaults to 5).' },
    { name: 'worstRating', label: 'Worst possible rating', type: 'text', advanced: true, placeholder: '1', hint: 'Lowest value on your scale (defaults to 1).' },
    { name: 'reviewAuthor', label: 'Review author', type: 'text', advanced: true, hint: 'A single real review. Add author + rating for review snippets.' },
    { name: 'reviewAuthorUrl', label: 'Review author URL', type: 'url', advanced: true, hint: 'Optional profile/bio page that identifies the reviewer.' },
    { name: 'reviewRating', label: 'Review rating given', type: 'text', advanced: true, placeholder: '5' },
    { name: 'reviewBody', label: 'Review text', type: 'textarea', advanced: true, rows: 2 },
    { name: 'reviewDate', label: 'Review date', type: 'date', advanced: true },
  ],
  build(v) {
    const out = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: v.name,
      image: v.image,
      description: v.description,
      sku: v.sku,
      brand: v.brand ? { '@type': 'Brand', name: v.brand } : undefined,
    };
    if (v.price || v.priceCurrency) {
      out.offers = {
        '@type': 'Offer',
        price: v.price,
        priceCurrency: v.priceCurrency,
        availability: v.availability,
        priceValidUntil: v.priceValidUntil,
        url: v.url,
      };
    }
    if (v.reviewAuthor && v.reviewRating) {
      out.review = {
        '@type': 'Review',
        author: { '@type': 'Person', name: v.reviewAuthor, url: v.reviewAuthorUrl },
        datePublished: v.reviewDate,
        reviewBody: v.reviewBody,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: v.reviewRating,
          bestRating: v.bestRating || '5',
          worstRating: v.worstRating || '1',
        },
      };
    }
    if (v.ratingValue && v.reviewCount) {
      out.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: v.ratingValue,
        reviewCount: v.reviewCount,
        bestRating: v.bestRating || '5',
        worstRating: v.worstRating || '1',
      };
    }
    return out;
  },
});
