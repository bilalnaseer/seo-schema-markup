import { mountGenerator } from './core.js';

mountGenerator({
  fileName: 'event-schema.json',
  sample: {
    name: 'Schema Markup Workshop 2026',
    startDate: '2026-09-12T09:00',
    endDate: '2026-09-12T17:00',
    mode: 'https://schema.org/OfflineEventAttendanceMode',
    status: 'https://schema.org/EventScheduled',
    image: 'https://example.com/images/event.jpg',
    description: 'A hands-on workshop on structured data for SEO.',
    venue: 'Austin Convention Center', street: '500 E Cesar Chavez St', city: 'Austin', region: 'TX', postal: '78701', country: 'US',
    price: '49.00', priceCurrency: 'USD', ticketUrl: 'https://example.com/tickets',
    priceValidUntil: '2026-09-01',
    performer: 'Bilal Naseer', performerUrl: 'https://example.com/speakers/bilal-naseer',
    organizer: 'WebSensePro', organizerUrl: 'https://websensepro.com',
    organizerLogo: 'https://websensepro.com/logo.png',
    organizerSameAs: 'https://twitter.com/websensepro\nhttps://www.linkedin.com/company/websensepro',
    organizerPhone: '+1-555-123-4567', organizerContactType: 'customer service',
  },
  fields: [
    { name: 'name', label: 'Event name', type: 'text', required: true },
    { name: 'startDate', label: 'Start date & time', type: 'datetime-local', required: true },
    { name: 'mode', label: 'Attendance mode', type: 'select', recommended: true, options: [
      { value: 'https://schema.org/OfflineEventAttendanceMode', label: 'In person' },
      { value: 'https://schema.org/OnlineEventAttendanceMode', label: 'Online' },
      { value: 'https://schema.org/MixedEventAttendanceMode', label: 'Mixed' },
    ] },
    { name: 'venue', label: 'Venue / location name', type: 'text', required: true, hint: 'For online events, enter the platform name (e.g. Zoom).' },
    { name: 'endDate', label: 'End date & time', type: 'datetime-local', advanced: true },
    { name: 'status', label: 'Event status', type: 'select', advanced: true, options: [
      { value: 'https://schema.org/EventScheduled', label: 'Scheduled' },
      { value: 'https://schema.org/EventPostponed', label: 'Postponed' },
      { value: 'https://schema.org/EventCancelled', label: 'Cancelled' },
      { value: 'https://schema.org/EventMovedOnline', label: 'Moved online' },
    ] },
    { name: 'image', label: 'Image URL', type: 'url', advanced: true },
    { name: 'description', label: 'Description', type: 'textarea', advanced: true, rows: 2 },
    { name: 'onlineUrl', label: 'Online event URL', type: 'url', advanced: true, hint: 'For online/mixed events.' },
    { name: 'street', label: 'Street address', type: 'text', advanced: true },
    { name: 'city', label: 'City', type: 'text', advanced: true },
    { name: 'region', label: 'State / region', type: 'text', advanced: true },
    { name: 'postal', label: 'Postal code', type: 'text', advanced: true },
    { name: 'country', label: 'Country code', type: 'text', advanced: true, placeholder: 'US' },
    { name: 'price', label: 'Ticket price', type: 'text', advanced: true },
    { name: 'priceCurrency', label: 'Currency', type: 'text', advanced: true, placeholder: 'USD' },
    { name: 'ticketUrl', label: 'Ticket URL', type: 'url', advanced: true },
    { name: 'priceValidUntil', label: 'Price valid until', type: 'date', advanced: true, hint: 'Date the ticket price is valid until (ISO 8601).' },
    { name: 'performer', label: 'Performer', type: 'text', advanced: true },
    { name: 'performerUrl', label: 'Performer URL', type: 'url', advanced: true, hint: 'Profile/bio page that identifies the performer.' },
    { name: 'organizer', label: 'Organizer', type: 'text', advanced: true },
    { name: 'organizerUrl', label: 'Organizer URL', type: 'url', advanced: true },
    { name: 'organizerLogo', label: 'Organizer logo URL', type: 'url', advanced: true },
    { name: 'organizerSameAs', label: 'Organizer social profiles', type: 'textarea', advanced: true, rows: 2, hint: 'One profile URL per line (Twitter, LinkedIn, etc.).' },
    { name: 'organizerPhone', label: 'Organizer contact phone', type: 'text', advanced: true, placeholder: '+1-555-123-4567' },
    { name: 'organizerContactType', label: 'Contact type', type: 'text', advanced: true, placeholder: 'customer service' },
  ],
  build(v) {
    const online = v.mode && v.mode.indexOf('Online') > -1;
    const out = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: v.name,
      startDate: v.startDate,
      endDate: v.endDate,
      eventAttendanceMode: v.mode,
      eventStatus: v.status,
      image: v.image,
      description: v.description,
    };
    if (online && v.onlineUrl) {
      out.location = { '@type': 'VirtualLocation', url: v.onlineUrl };
    } else {
      out.location = {
        '@type': 'Place',
        name: v.venue,
        address: {
          '@type': 'PostalAddress',
          streetAddress: v.street, addressLocality: v.city, addressRegion: v.region,
          postalCode: v.postal, addressCountry: v.country,
        },
      };
    }
    if (v.price || v.ticketUrl) {
      out.offers = {
        '@type': 'Offer', price: v.price, priceCurrency: v.priceCurrency,
        url: v.ticketUrl, availability: 'https://schema.org/InStock',
        priceValidUntil: v.priceValidUntil,
      };
    }
    if (v.performer) out.performer = { '@type': 'Person', name: v.performer, url: v.performerUrl };
    if (v.organizer) out.organizer = {
      '@type': 'Organization', name: v.organizer, url: v.organizerUrl,
      logo: v.organizerLogo ? { '@type': 'ImageObject', url: v.organizerLogo } : undefined,
      sameAs: (v.organizerSameAs || '').split(/[\n,]/).map((s) => s.trim()).filter(Boolean),
      contactPoint: v.organizerPhone ? {
        '@type': 'ContactPoint',
        contactType: v.organizerContactType || 'customer service',
        telephone: v.organizerPhone,
      } : undefined,
    };
    return out;
  },
});
