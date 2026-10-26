import { mountGenerator } from './core.js';

mountGenerator({
  fileName: 'video-schema.json',
  sample: {
    name: 'How to Bake the Perfect Sourdough Bread',
    description: 'A beginner-friendly tutorial covering every step of sourdough bread making — from starter to scoring. Includes timing, temperatures and troubleshooting tips.',
    thumbnailUrl: 'https://example.com/images/sourdough-tutorial-thumb.jpg',
    uploadDate: '2026-09-15',
    duration: 'PT12M45S',
    contentUrl: 'https://example.com/videos/sourdough-tutorial.mp4',
    embedUrl: 'https://www.youtube.com/embed/abc123xyz',
    url: 'https://example.com/blog/sourdough-bread-recipe/',
    expires: '',
    isFamilyFriendly: 'true',
    regionsAllowed: '',
    publisherName: 'Example Kitchen',
    publisherLogoUrl: 'https://example.com/images/logo.png',
    publisherUrl: 'https://example.com',
    publisherSameAs: 'https://www.youtube.com/@examplekitchen\nhttps://twitter.com/examplekitchen',
    publisherPhone: '+1-555-123-4567',
    publisherContactType: 'customer service',
  },
  fields: [
    { name: 'name', label: 'Video title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true, rows: 3 },
    { name: 'thumbnailUrl', label: 'Thumbnail URL', type: 'url', required: true, hint: 'Image URL for the video thumbnail. Minimum 60×30px, recommended 1280×720px.' },
    { name: 'uploadDate', label: 'Upload / publish date', type: 'date', required: true, hint: 'Date the video was first published (ISO 8601).' },
    { name: 'contentUrl', label: 'Content URL', type: 'url', recommended: true, hint: 'Direct URL to the raw video file (e.g. .mp4).' },
    { name: 'embedUrl', label: 'Embed URL', type: 'url', recommended: true, hint: 'URL of an embeddable player, e.g. a YouTube embed URL.' },
    { name: 'duration', label: 'Duration', type: 'text', recommended: true, placeholder: 'PT8M30S', hint: 'ISO 8601 duration, e.g. PT1M33S = 1 min 33 sec, PT2H = 2 hours.' },
    { name: 'url', label: 'Page URL', type: 'url', advanced: true, hint: 'Canonical URL of the page where the video is embedded.' },
    { name: 'expires', label: 'Expiry date', type: 'date', advanced: true, hint: 'If the video will no longer be available after a certain date.' },
    { name: 'isFamilyFriendly', label: 'Family friendly', type: 'select', advanced: true, options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ] },
    { name: 'regionsAllowed', label: 'Regions allowed', type: 'text', advanced: true, placeholder: 'US GB CA', hint: 'Space-separated ISO 3166 country codes. Leave blank for worldwide.' },
    { name: 'publisherName', label: 'Publisher name', type: 'text', advanced: true, hint: 'Name of the organisation or person who published the video.' },
    { name: 'publisherLogoUrl', label: 'Publisher logo URL', type: 'url', advanced: true },
    { name: 'publisherUrl', label: 'Publisher website URL', type: 'url', advanced: true, hint: 'Official website of the publisher.' },
    { name: 'publisherSameAs', label: 'Publisher social profiles', type: 'textarea', advanced: true, rows: 2, hint: 'One URL per line — YouTube channel, Twitter, LinkedIn, etc.' },
    { name: 'publisherPhone', label: 'Publisher contact phone', type: 'text', advanced: true, placeholder: '+1-555-123-4567' },
    { name: 'publisherContactType', label: 'Contact type', type: 'text', advanced: true, placeholder: 'customer service' },
  ],
  build(v) {
    const out = {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: v.name,
      description: v.description,
      thumbnailUrl: v.thumbnailUrl,
      uploadDate: v.uploadDate,
      duration: v.duration || undefined,
      contentUrl: v.contentUrl || undefined,
      embedUrl: v.embedUrl || undefined,
      url: v.url || undefined,
      expires: v.expires || undefined,
      isFamilyFriendly: v.isFamilyFriendly === 'false' ? false : v.isFamilyFriendly === 'true' ? true : undefined,
      regionsAllowed: v.regionsAllowed
        ? v.regionsAllowed.trim().split(/\s+/).join(' ')
        : undefined,
    };
    if (v.publisherName) {
      out.publisher = {
        '@type': 'Organization',
        name: v.publisherName,
        url: v.publisherUrl || undefined,
        logo: v.publisherLogoUrl
          ? { '@type': 'ImageObject', url: v.publisherLogoUrl }
          : undefined,
        sameAs: v.publisherSameAs
          ? v.publisherSameAs.split(/[\n,]/).map((s) => s.trim()).filter(Boolean)
          : undefined,
        contactPoint: v.publisherPhone ? {
          '@type': 'ContactPoint',
          contactType: v.publisherContactType || 'customer service',
          telephone: v.publisherPhone,
        } : undefined,
      };
    }
    return out;
  },
});
