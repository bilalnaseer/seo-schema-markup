import { mountGenerator } from './core.js';

mountGenerator({
  fileName: 'article-schema.json',
  sample: {
    type: 'Article',
    headline: 'How to Add Schema Markup to Any Website',
    image: 'https://example.com/images/cover.jpg',
    authorName: 'Jane Doe',
    authorUrl: 'https://example.com/author/jane',
    publisher: 'Example Media',
    publisherLogo: 'https://example.com/logo.png',
    datePublished: '2026-01-15',
    dateModified: '2026-02-01',
    url: 'https://example.com/blog/schema-markup',
  },
  fields: [
    { name: 'type', label: 'Article type', type: 'select', options: [
      { value: 'Article', label: 'Article' },
      { value: 'BlogPosting', label: 'BlogPosting' },
      { value: 'NewsArticle', label: 'NewsArticle' },
    ] },
    { name: 'headline', label: 'Headline', type: 'text', required: true, hint: 'Keep under ~110 characters.' },
    { name: 'image', label: 'Image URL', type: 'url', recommended: true },
    { name: 'authorName', label: 'Author name', type: 'text', recommended: true },
    { name: 'datePublished', label: 'Date published', type: 'date', recommended: true },
    { name: 'authorUrl', label: 'Author URL', type: 'url', advanced: true, hint: 'Link to the author bio/profile page.' },
    { name: 'authorType', label: 'Author is a', type: 'select', advanced: true, options: [
      { value: 'Person', label: 'Person' }, { value: 'Organization', label: 'Organization' },
    ] },
    { name: 'dateModified', label: 'Date modified', type: 'date', advanced: true },
    { name: 'publisher', label: 'Publisher name', type: 'text', advanced: true },
    { name: 'publisherLogo', label: 'Publisher logo URL', type: 'url', advanced: true },
    { name: 'url', label: 'Article URL', type: 'url', advanced: true },
  ],
  build(v) {
    return {
      '@context': 'https://schema.org',
      '@type': v.type || 'Article',
      headline: v.headline,
      image: v.image,
      author: v.authorName ? { '@type': v.authorType || 'Person', name: v.authorName, url: v.authorUrl } : undefined,
      publisher: v.publisher ? {
        '@type': 'Organization', name: v.publisher,
        logo: v.publisherLogo ? { '@type': 'ImageObject', url: v.publisherLogo } : undefined,
      } : undefined,
      datePublished: v.datePublished,
      dateModified: v.dateModified || v.datePublished,
      mainEntityOfPage: v.url ? { '@type': 'WebPage', '@id': v.url } : undefined,
    };
  },
});
