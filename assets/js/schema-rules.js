/* ==========================================================================
   schema-rules.js — single source of truth for required / recommended
   properties per schema.org type, aligned with Google's structured-data docs.
   Used by BOTH the generators and the validator engine.
   ========================================================================== */

/*
  Each rule entry:
  {
    label:        human name
    generator:    path to matching generator page (for internal links), or null
    docs:         Google doc URL
    required:     [{ prop, note }]      // missing => error
    recommended:  [{ prop, note }]      // missing => warning
    childType:    schema type of the items inside the "collection" prop
    collection:   the property that holds child items (for per-item checks)
  }
*/

export const schemaRules = {
  FAQPage: {
    label: 'FAQ Page',
    generator: '/faq-schema-generator/',
    docs: 'https://developers.google.com/search/docs/appearance/structured-data/faqpage',
    required: [
      { prop: 'mainEntity', note: 'An array of Question items. Each must have a name (the question) and an acceptedAnswer.' },
    ],
    recommended: [],
    collection: 'mainEntity',
    childType: 'Question',
  },
  Question: {
    label: 'Question',
    generator: null,
    required: [
      { prop: 'name', note: 'The full text of the question.' },
      { prop: 'acceptedAnswer', note: 'An Answer object whose text answers the question.' },
    ],
    recommended: [],
  },
  Answer: {
    label: 'Answer',
    generator: null,
    required: [
      { prop: 'text', note: 'The full answer. HTML is allowed for limited formatting.' },
    ],
    recommended: [],
  },

  Product: {
    label: 'Product',
    generator: '/product-schema-generator/',
    docs: 'https://developers.google.com/search/docs/appearance/structured-data/product',
    required: [
      { prop: 'name', note: 'The product name.' },
    ],
    recommended: [
      { prop: 'image', note: 'One or more high-resolution images. Strongly recommended for rich results.' },
      { prop: 'offers', note: 'An Offer (or AggregateOffer) with price and priceCurrency — needed for price rich results.' },
      { prop: 'review', note: 'Individual reviews. Needed (with author + rating) for review snippets.' },
      { prop: 'aggregateRating', note: 'Average rating. Needed for star ratings in search results.' },
      { prop: 'brand', note: 'The product brand (a Brand or Organization).' },
      { prop: 'description', note: 'A short description of the product.' },
      { prop: 'sku', note: 'Merchant-specific product identifier.' },
    ],
  },
  Offer: {
    label: 'Offer',
    generator: null,
    required: [
      { prop: 'price', note: 'The price as a number, e.g. "39.99" (no currency symbol).' },
      { prop: 'priceCurrency', note: 'The 3-letter ISO 4217 currency code, e.g. "USD".' },
    ],
    recommended: [
      { prop: 'availability', note: 'A schema.org availability URL, e.g. https://schema.org/InStock.' },
      { prop: 'priceValidUntil', note: 'Date the price is valid until (ISO 8601).' },
      { prop: 'url', note: 'URL of the product page where the offer can be purchased.' },
    ],
  },
  AggregateRating: {
    label: 'AggregateRating',
    generator: '/review-schema-generator/',
    required: [
      { prop: 'ratingValue', note: 'The average rating value, e.g. 4.6.' },
      { prop: 'reviewCount', note: 'Number of reviews — OR use ratingCount. At least one is required.', oneOf: ['reviewCount', 'ratingCount'] },
    ],
    recommended: [
      { prop: 'bestRating', note: 'Highest value allowed (defaults to 5).' },
      { prop: 'worstRating', note: 'Lowest value allowed (defaults to 1).' },
    ],
  },
  Review: {
    label: 'Review',
    generator: '/review-schema-generator/',
    docs: 'https://developers.google.com/search/docs/appearance/structured-data/review-snippet',
    required: [
      { prop: 'author', note: 'The author of the review (a Person or Organization with a name).' },
      { prop: 'reviewRating', note: 'A Rating object with ratingValue.' },
    ],
    recommended: [
      { prop: 'datePublished', note: 'Date the review was published (ISO 8601).' },
      { prop: 'reviewBody', note: 'The body text of the review.' },
    ],
  },
  Rating: {
    label: 'Rating',
    generator: null,
    required: [
      { prop: 'ratingValue', note: 'The rating given, e.g. 5.' },
    ],
    recommended: [
      { prop: 'bestRating', note: 'Highest value allowed (defaults to 5).' },
      { prop: 'worstRating', note: 'Lowest value allowed (defaults to 1).' },
    ],
  },

  Article: {
    label: 'Article',
    generator: '/article-schema-generator/',
    docs: 'https://developers.google.com/search/docs/appearance/structured-data/article',
    required: [
      { prop: 'headline', note: 'The article title (keep under ~110 characters).' },
    ],
    recommended: [
      { prop: 'image', note: 'One or more representative images.' },
      { prop: 'author', note: 'A Person or Organization. Author markup helps establish E-E-A-T.' },
      { prop: 'datePublished', note: 'When the article was first published (ISO 8601).' },
      { prop: 'dateModified', note: 'When the article was last modified (ISO 8601).' },
      { prop: 'publisher', note: 'The publishing Organization, with a logo.' },
    ],
  },
  // NewsArticle / BlogPosting share Article's rules
  NewsArticle: { alias: 'Article' },
  BlogPosting: { alias: 'Article' },

  Person: {
    label: 'Person',
    generator: null,
    required: [
      { prop: 'name', note: 'The person’s name.' },
    ],
    recommended: [
      { prop: 'url', note: 'A URL that uniquely identifies the person (profile/bio page).' },
    ],
  },

  Organization: {
    label: 'Organization',
    generator: '/organization-schema-generator/',
    docs: 'https://developers.google.com/search/docs/appearance/structured-data/organization',
    required: [
      { prop: 'name', note: 'The organization / brand name.' },
    ],
    recommended: [
      { prop: 'url', note: 'The official website URL.' },
      { prop: 'logo', note: 'A logo URL (or ImageObject). Needed to control the knowledge-panel logo.' },
      { prop: 'sameAs', note: 'Array of social / authoritative profile URLs.' },
      { prop: 'contactPoint', note: 'A ContactPoint with contactType and telephone.' },
    ],
  },

  LocalBusiness: {
    label: 'Local Business',
    generator: '/local-business-schema-generator/',
    docs: 'https://developers.google.com/search/docs/appearance/structured-data/local-business',
    required: [
      { prop: 'name', note: 'The business name.' },
      { prop: 'address', note: 'A PostalAddress with street, locality, region, postal code and country.' },
    ],
    recommended: [
      { prop: 'telephone', note: 'A contact phone number in international format.' },
      { prop: 'openingHoursSpecification', note: 'Structured opening hours.' },
      { prop: 'geo', note: 'GeoCoordinates (latitude/longitude).' },
      { prop: 'image', note: 'A photo of the business.' },
      { prop: 'priceRange', note: 'Relative price level, e.g. "$$".' },
      { prop: 'url', note: 'The business website.' },
    ],
  },
  Restaurant: { alias: 'LocalBusiness' },
  Store: { alias: 'LocalBusiness' },

  PostalAddress: {
    label: 'PostalAddress',
    generator: null,
    required: [
      { prop: 'streetAddress', note: 'Street address line.' },
      { prop: 'addressLocality', note: 'City / town.' },
      { prop: 'addressCountry', note: 'Country (ISO 3166-1 alpha-2 code preferred, e.g. "US").' },
    ],
    recommended: [
      { prop: 'addressRegion', note: 'State / region.' },
      { prop: 'postalCode', note: 'ZIP / postal code.' },
    ],
  },

  BreadcrumbList: {
    label: 'Breadcrumb List',
    generator: '/breadcrumb-schema-generator/',
    docs: 'https://developers.google.com/search/docs/appearance/structured-data/breadcrumb',
    required: [
      { prop: 'itemListElement', note: 'An ordered array of ListItem entries (each with position, name, item).' },
    ],
    recommended: [],
    collection: 'itemListElement',
    childType: 'ListItem',
  },
  ListItem: {
    label: 'ListItem',
    generator: null,
    required: [
      { prop: 'position', note: 'The 1-based position in the trail.' },
      { prop: 'name', note: 'The title of the breadcrumb.' },
    ],
    recommended: [
      { prop: 'item', note: 'The URL of the page. Optional only for the last (current) crumb.' },
    ],
  },

  Event: {
    label: 'Event',
    generator: '/event-schema-generator/',
    docs: 'https://developers.google.com/search/docs/appearance/structured-data/event',
    required: [
      { prop: 'name', note: 'The event name.' },
      { prop: 'startDate', note: 'Start date/time in ISO 8601 (include timezone).' },
      { prop: 'location', note: 'A Place (with address) or a VirtualLocation for online events.' },
    ],
    recommended: [
      { prop: 'endDate', note: 'End date/time in ISO 8601.' },
      { prop: 'image', note: 'One or more event images.' },
      { prop: 'description', note: 'A description of the event.' },
      { prop: 'offers', note: 'Ticket Offer(s) with price, priceCurrency, availability and url.' },
      { prop: 'performer', note: 'The performer(s) — a Person or Organization.' },
      { prop: 'organizer', note: 'The event organizer.' },
      { prop: 'eventStatus', note: 'e.g. https://schema.org/EventScheduled.' },
      { prop: 'eventAttendanceMode', note: 'Online, offline, or mixed attendance mode.' },
    ],
  },

  VideoObject: {
    label: 'Video',
    generator: '/video-schema-generator/',
    docs: 'https://developers.google.com/search/docs/appearance/structured-data/video',
    required: [
      { prop: 'name', note: 'The video title.' },
      { prop: 'description', note: 'A description of the video.' },
      { prop: 'thumbnailUrl', note: 'One or more thumbnail image URLs.' },
      { prop: 'uploadDate', note: 'Date the video was published (ISO 8601).' },
    ],
    recommended: [
      { prop: 'contentUrl', note: 'A URL to the raw video file.' },
      { prop: 'embedUrl', note: 'A URL to an embeddable player.' },
      { prop: 'duration', note: 'Duration in ISO 8601 format, e.g. PT1M33S.' },
    ],
  },

  SoftwareApplication: {
    label: 'Software Application',
    generator: null,
    docs: 'https://developers.google.com/search/docs/appearance/structured-data/software-app',
    required: [
      { prop: 'name', note: 'The application name.' },
    ],
    recommended: [
      { prop: 'applicationCategory', note: 'e.g. DeveloperApplication, BusinessApplication.' },
      { prop: 'operatingSystem', note: 'The OS it runs on, e.g. "Web".' },
      { prop: 'offers', note: 'An Offer with price and priceCurrency (use "0" for free).' },
    ],
  },
};

/* Resolve a type to its rule, following aliases. Returns null if unknown. */
export function getRule(type) {
  if (!type) return null;
  let rule = schemaRules[type];
  if (rule && rule.alias) rule = schemaRules[rule.alias];
  return rule || null;
}

/* List of types that map to a generator page (for the validator's "open generator" links). */
export function generatorFor(type) {
  const rule = getRule(type);
  return rule && rule.generator ? rule.generator : null;
}
