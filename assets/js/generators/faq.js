import { mountGenerator } from './core.js';

mountGenerator({
  fileName: 'faq-schema.json',
  sample: {
    faqs: [
      { q: 'Is the schema markup generator free?', a: 'Yes. Every generator on this site is 100% free, with no signup required.' },
      { q: 'What format does it output?', a: 'It outputs JSON-LD, the structured data format Google recommends.' },
    ],
  },
  fields: [
    {
      name: 'faqs', type: 'list', label: 'Questions & answers', addLabel: 'Add question', min: 1,
      hint: 'Add each frequently-asked question and its answer. Only include Q&As that are visible on the page.',
      item: [
        { name: 'q', label: 'Question', type: 'text', required: true, placeholder: 'How do I add schema markup?' },
        { name: 'a', label: 'Answer', type: 'textarea', required: true, rows: 3, placeholder: 'Paste the JSON-LD into your page <head>…' },
      ],
    },
  ],
  build(v) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: (v.faqs || []).map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    };
  },
});
