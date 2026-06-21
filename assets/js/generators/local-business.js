import { mountGenerator } from './core.js';

mountGenerator({
  fileName: 'local-business-schema.json',
  sample: {
    type: 'Restaurant',
    name: 'The Corner Bistro',
    image: 'https://example.com/images/bistro.jpg',
    url: 'https://example.com',
    telephone: '+1-202-555-0148',
    priceRange: '$$',
    street: '123 Main St', city: 'Austin', region: 'TX', postal: '78701', country: 'US',
    lat: '30.2672', lng: '-97.7431',
    days: 'Mo,Tu,We,Th,Fr', opens: '09:00', closes: '22:00',
  },
  fields: [
    { name: 'type', label: 'Business type', type: 'select', hint: 'Use the most specific schema.org type that fits.', options: [
      { value: 'LocalBusiness', label: 'LocalBusiness (generic)' },
      { value: 'Restaurant', label: 'Restaurant' },
      { value: 'Store', label: 'Store' },
      { value: 'CafeOrCoffeeShop', label: 'Cafe / Coffee Shop' },
      { value: 'Dentist', label: 'Dentist' },
      { value: 'LegalService', label: 'Legal Service' },
      { value: 'AutoRepair', label: 'Auto Repair' },
    ] },
    { name: 'name', label: 'Business name', type: 'text', required: true },
    { name: 'street', label: 'Street address', type: 'text', required: true },
    { name: 'city', label: 'City', type: 'text', required: true },
    { name: 'country', label: 'Country code', type: 'text', required: true, placeholder: 'US', hint: 'ISO 3166-1 alpha-2.' },
    { name: 'telephone', label: 'Phone', type: 'text', recommended: true, placeholder: '+1-202-555-0148' },
    { name: 'region', label: 'State / region', type: 'text', advanced: true },
    { name: 'postal', label: 'Postal code', type: 'text', advanced: true },
    { name: 'image', label: 'Image URL', type: 'url', advanced: true },
    { name: 'url', label: 'Website URL', type: 'url', advanced: true },
    { name: 'priceRange', label: 'Price range', type: 'text', advanced: true, placeholder: '$$' },
    { name: 'lat', label: 'Latitude', type: 'text', advanced: true },
    { name: 'lng', label: 'Longitude', type: 'text', advanced: true },
    { name: 'days', label: 'Open days', type: 'text', advanced: true, placeholder: 'Mo,Tu,We,Th,Fr', hint: 'Comma-separated: Mo,Tu,We,Th,Fr,Sa,Su' },
    { name: 'opens', label: 'Opening time', type: 'text', advanced: true, placeholder: '09:00' },
    { name: 'closes', label: 'Closing time', type: 'text', advanced: true, placeholder: '17:00' },
  ],
  build(v) {
    const out = {
      '@context': 'https://schema.org',
      '@type': v.type || 'LocalBusiness',
      name: v.name,
      image: v.image,
      url: v.url,
      telephone: v.telephone,
      priceRange: v.priceRange,
      address: {
        '@type': 'PostalAddress',
        streetAddress: v.street,
        addressLocality: v.city,
        addressRegion: v.region,
        postalCode: v.postal,
        addressCountry: v.country,
      },
    };
    if (v.lat && v.lng) out.geo = { '@type': 'GeoCoordinates', latitude: v.lat, longitude: v.lng };
    if (v.days && v.opens && v.closes) {
      out.openingHoursSpecification = {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: v.days.split(',').map((d) => d.trim()).filter(Boolean),
        opens: v.opens,
        closes: v.closes,
      };
    }
    return out;
  },
});
