import { mountGenerator } from './core.js';

mountGenerator({
  fileName: 'review-schema.json',
  // The reviewed item is a stub (you're rating it, not cataloguing it), and its
  // type is user-selectable — so don't nag about the item's own recommended props.
  skipRootRecommended: true,
  sample: {
    itemType: 'Product',
    itemName: 'Wireless Headphones',
    authorName: 'Jane Doe',
    authorUrl: 'https://example.com/reviewers/jane-doe',
    ratingValue: '5', worstRating: '1',
    reviewBody: 'Fantastic sound and battery life. Highly recommend.',
    datePublished: '2026-03-04',
    aggValue: '4.6', aggCount: '128',
  },
  fields: [
    { name: 'itemType', label: 'Item being reviewed', type: 'select', hint: 'Reviews must attach to a real item type.', options: [
      { value: 'Product', label: 'Product' },
      { value: 'LocalBusiness', label: 'Local Business' },
      { value: 'Book', label: 'Book' },
      { value: 'Movie', label: 'Movie' },
      { value: 'Course', label: 'Course' },
      { value: 'SoftwareApplication', label: 'Software Application' },
    ] },
    { name: 'itemName', label: 'Item name', type: 'text', required: true },
    { name: 'authorName', label: 'Reviewer name', type: 'text', required: true },
    { name: 'authorUrl', label: 'Reviewer URL', type: 'url', advanced: true, hint: 'Optional profile/bio page that identifies the reviewer.' },
    { name: 'ratingValue', label: 'Rating given (1–5)', type: 'text', required: true, placeholder: '5' },
    { name: 'reviewBody', label: 'Review text', type: 'textarea', recommended: true, rows: 3 },
    { name: 'datePublished', label: 'Date published', type: 'date', recommended: true },
    { name: 'bestRating', label: 'Best possible rating', type: 'text', advanced: true, placeholder: '5' },
    { name: 'worstRating', label: 'Worst possible rating', type: 'text', advanced: true, placeholder: '1' },
    { name: 'aggValue', label: 'Aggregate rating value', type: 'text', advanced: true, hint: 'Average across all real reviews on the page.' },
    { name: 'aggCount', label: 'Aggregate review count', type: 'number', advanced: true, hint: 'Total number of real reviews.' },
  ],
  build(v) {
    const out = {
      '@context': 'https://schema.org',
      '@type': v.itemType || 'Product',
      name: v.itemName,
      review: {
        '@type': 'Review',
        author: v.authorName ? { '@type': 'Person', name: v.authorName, url: v.authorUrl } : undefined,
        datePublished: v.datePublished,
        reviewBody: v.reviewBody,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: v.ratingValue,
          bestRating: v.bestRating || '5',
          worstRating: v.worstRating || '1',
        },
      },
    };
    if (v.aggValue && v.aggCount) {
      out.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: v.aggValue,
        reviewCount: v.aggCount,
        bestRating: v.bestRating || '5',
        worstRating: v.worstRating || '1',
      };
    }
    return out;
  },
});
