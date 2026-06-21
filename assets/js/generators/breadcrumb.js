import { mountGenerator } from './core.js';

mountGenerator({
  fileName: 'breadcrumb-schema.json',
  sample: {
    crumbs: [
      { name: 'Home', url: 'https://example.com/' },
      { name: 'Blog', url: 'https://example.com/blog/' },
      { name: 'Schema Markup Guide', url: 'https://example.com/blog/schema-markup/' },
    ],
  },
  fields: [
    {
      name: 'crumbs', type: 'list', label: 'Breadcrumb trail', addLabel: 'Add breadcrumb', min: 1,
      hint: 'List each step from your homepage to the current page, in order. The last item is the current page.',
      item: [
        { name: 'name', label: 'Title', type: 'text', required: true, placeholder: 'Blog' },
        { name: 'url', label: 'URL', type: 'url', placeholder: 'https://example.com/blog/', hint: 'Optional for the final (current) page.' },
      ],
    },
  ],
  build(v) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: (v.crumbs || []).map((c, i) => {
        const item = { '@type': 'ListItem', position: i + 1, name: c.name };
        if (c.url) item.item = c.url;
        return item;
      }),
    };
  },
});
