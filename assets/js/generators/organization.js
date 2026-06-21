import { mountGenerator } from './core.js';

mountGenerator({
  fileName: 'organization-schema.json',
  sample: {
    name: 'Acme Inc.',
    url: 'https://example.com',
    logo: 'https://example.com/logo.png',
    sameAs: 'https://twitter.com/acme\nhttps://www.linkedin.com/company/acme\nhttps://www.facebook.com/acme',
    phone: '+1-202-555-0100', contactType: 'customer support', email: 'support@example.com',
  },
  fields: [
    { name: 'name', label: 'Organization name', type: 'text', required: true },
    { name: 'url', label: 'Website URL', type: 'url', recommended: true },
    { name: 'logo', label: 'Logo URL', type: 'url', recommended: true, hint: 'Used for your logo in Google search results.' },
    { name: 'sameAs', label: 'Social / profile URLs', type: 'textarea', recommended: true, rows: 4, hint: 'One URL per line (Twitter, LinkedIn, Facebook, Wikipedia…).' },
    { name: 'phone', label: 'Phone', type: 'text', advanced: true },
    { name: 'contactType', label: 'Contact type', type: 'text', advanced: true, placeholder: 'customer support' },
    { name: 'email', label: 'Email', type: 'email', advanced: true },
    { name: 'description', label: 'Description', type: 'textarea', advanced: true, rows: 2 },
  ],
  build(v) {
    const out = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: v.name,
      url: v.url,
      logo: v.logo,
      description: v.description,
      sameAs: (v.sameAs || '').split('\n').map((s) => s.trim()).filter(Boolean),
    };
    if (v.phone || v.email) {
      out.contactPoint = {
        '@type': 'ContactPoint',
        telephone: v.phone,
        email: v.email,
        contactType: v.contactType || 'customer service',
      };
    }
    return out;
  },
});
