/* Content + SEO copy for generated pages. Consumed by build-pages.js. */

const V = { href: '/schema-markup-validator/', title: 'Schema Validator', desc: 'Test &amp; check any JSON-LD for errors.' };
const card = (href, title, desc) => ({ href, title, desc });

const generators = [
  {
    slug: '/faq-schema-generator/',
    crumbName: 'FAQ Schema Generator',
    appName: 'FAQ Schema Generator',
    module: '/assets/js/generators/faq.js',
    title: 'FAQ Schema Generator — Free FAQPage JSON-LD Tool',
    desc: 'Free FAQ schema generator. Create valid FAQPage JSON-LD markup for FAQ rich snippets in seconds. Copy the ready-to-paste script — no signup.',
    h1: 'FAQ Schema Generator',
    lead: 'Create valid <strong>FAQ schema markup</strong> (FAQPage JSON-LD) for your Q&amp;A content and earn FAQ rich results in Google. Add your questions, copy the snippet, done.',
    extraJsonLd: `\n<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Is this FAQ schema generator free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. This FAQ schema markup generator is completely free, with no signup or limits." } },
    { "@type": "Question", "name": "What is FAQ schema markup?", "acceptedAnswer": { "@type": "Answer", "text": "FAQ schema (FAQPage) is structured data that marks up a list of questions and answers so Google can show them as a rich result." } }
  ]
}
</script>`,
    explainer: `<h2>How to use FAQ schema markup</h2>
<p><strong>FAQ schema</strong> (the <code>FAQPage</code> type) is structured data that describes a list of questions and their answers. When you add valid <strong>FAQ schema markup</strong> to a page, Google can display those questions directly in search results as an expandable rich result, which takes up more space and can lift your click-through rate.</p>
<p>This free <strong>FAQ rich snippet generator tool</strong> builds the JSON-LD for you. Type each question and answer in the form on the left and the markup updates live on the right, with required fields validated as you go. When it shows “Valid,” copy the <code>&lt;script&gt;</code> snippet and paste it into the <code>&lt;head&gt;</code> (or anywhere in the body) of the page that shows those FAQs.</p>
<h3>FAQ schema rules to follow</h3>
<ul>
  <li>Only mark up Q&amp;A content that is <strong>actually visible</strong> on the page. Hidden FAQ content violates Google's guidelines.</li>
  <li>Each <code>Question</code> needs a <code>name</code> (the question) and an <code>acceptedAnswer</code> with <code>text</code>.</li>
  <li>FAQ content should be written by the site, not user-submitted (that's the <code>QAPage</code> type instead).</li>
  <li>Don't use FAQ markup for advertising.</li>
</ul>
<h3>A FAQ schema markup example</h3>
<p>The output of this tool is a complete, copy-paste-ready example. Each entry becomes a <code>Question</code> object inside <code>mainEntity</code>, and each answer becomes an <code>Answer</code> object. After you paste it in, confirm it with our <a href="/schema-markup-validator/">schema markup validator</a> and Google's Rich Results Test. New to structured data? Read <a href="/what-is-schema-markup/">what is schema markup</a> first.</p>`,
    siblings: [V, card('/product-schema-generator/', 'Product Schema', 'Price, availability &amp; ratings.'), card('/article-schema-generator/', 'Article Schema', 'Author, publisher &amp; dates.'), card('/breadcrumb-schema-generator/', 'Breadcrumb Schema', 'Show breadcrumb trails.')],
  },
  {
    slug: '/product-schema-generator/',
    crumbName: 'Product Schema Generator',
    appName: 'Product Schema Generator',
    module: '/assets/js/generators/product.js',
    title: 'Product Schema Generator — Free Product JSON-LD Markup',
    desc: 'Free product schema generator. Create valid Product JSON-LD markup with price, availability &amp; ratings for rich snippets. Copy the script — no signup.',
    h1: 'Product Schema Generator',
    lead: 'Generate valid <strong>Product schema markup</strong> (JSON-LD) with price, availability and ratings so your products are eligible for rich snippets in Google Search and Shopping.',
    explainer: `<h2>How to use product schema markup</h2>
<p><strong>Product schema</strong> is structured data that tells search engines the key facts about a product: its name, image, price, availability and review ratings. Valid <strong>product schema markup</strong> makes your pages eligible for product rich results — the listings that show price, stock status and star ratings right in the search results.</p>
<p>This <strong>product schema generator</strong> builds the JSON-LD live as you fill in the form. The product <code>name</code> is the only strictly required field, but to qualify for the most useful rich results you should add an <code>image</code> and an <code>offers</code> block with <code>price</code> and <code>priceCurrency</code>. The validator panel flags anything Google recommends but you've left out.</p>
<h3>Key properties in this product schema example</h3>
<ul>
  <li><code>offers</code> — an <code>Offer</code> with <code>price</code>, <code>priceCurrency</code> and <code>availability</code> (e.g. <code>https://schema.org/InStock</code>).</li>
  <li><code>aggregateRating</code> — average rating and review count. Only add this if you display <strong>real</strong> reviews on the page; fake ratings can trigger a manual action.</li>
  <li><code>brand</code>, <code>sku</code>, <code>description</code> — recommended details that strengthen the markup.</li>
</ul>
<p>Selling on Shopify? See our <a href="/shopify-schema-markup/">Shopify schema markup guide</a> for where to place this in your theme. When you're done, paste your output into the <a href="/schema-markup-validator/">schema validator</a> to confirm it's clean before publishing.</p>`,
    siblings: [V, card('/review-schema-generator/', 'Review Schema', 'Star ratings for items.'), card('/faq-schema-generator/', 'FAQ Schema', 'FAQ rich results.'), card('/organization-schema-generator/', 'Organization Schema', 'Brand &amp; logo markup.')],
  },
  {
    slug: '/article-schema-generator/',
    crumbName: 'Article Schema Generator',
    appName: 'Article Schema Generator',
    module: '/assets/js/generators/article.js',
    title: 'Article Schema Generator — Author &amp; Article JSON-LD',
    desc: 'Free article schema generator with author markup. Create valid Article, BlogPosting &amp; NewsArticle JSON-LD with author, publisher &amp; dates for E-E-A-T.',
    h1: 'Article &amp; Author Schema Generator',
    lead: 'Create valid <strong>Article structured data</strong> with <strong>author schema</strong>, publisher and dates. Choose Article, BlogPosting or NewsArticle and copy the JSON-LD.',
    explainer: `<h2>How to use article &amp; author schema</h2>
<p><strong>Article schema</strong> helps Google understand the details of a news story, blog post or article — the headline, images, when it was published and updated, and crucially, who wrote it. Adding <strong>author schema</strong> (the <code>author</code> property) is one of the clearest ways to signal authorship and support your site's E-E-A-T (experience, expertise, authoritativeness, trust).</p>
<p>This generator supports three common types. Use <strong>Article</strong> for general content, <strong>BlogPosting</strong> for blog posts, and <strong>NewsArticle</strong> for journalism. The only required property is <code>headline</code>, but you should add an <code>image</code>, a <code>datePublished</code>, the <code>author</code>, and a <code>publisher</code> with a logo for the best results.</p>
<h3>Author schema done right</h3>
<p>For <code>schema author</code> markup, set the author as a <code>Person</code> (or <code>Organization</code>) and, where possible, add a <code>url</code> pointing to a real author bio page. That URL helps Google connect the article to a verifiable author entity. The publisher should be the <code>Organization</code> that owns the site, with a <code>logo</code> as an <code>ImageObject</code>.</p>
<h3>Dates matter</h3>
<p>Include both <code>datePublished</code> and <code>dateModified</code> in ISO 8601 format. Keeping <code>dateModified</code> accurate signals freshness when you update content. After generating your <strong>article structured data</strong>, validate it with our <a href="/schema-markup-validator/">schema checker</a>, and pair it with <a href="/breadcrumb-schema-generator/">breadcrumb schema</a> for an even richer result.</p>`,
    siblings: [V, card('/faq-schema-generator/', 'FAQ Schema', 'FAQ rich results.'), card('/breadcrumb-schema-generator/', 'Breadcrumb Schema', 'Show breadcrumb trails.'), card('/organization-schema-generator/', 'Organization Schema', 'Publisher &amp; logo.')],
  },
  {
    slug: '/local-business-schema-generator/',
    crumbName: 'Local Business Schema Generator',
    appName: 'Local Business Schema Generator',
    module: '/assets/js/generators/local-business.js',
    title: 'Local Business Schema Generator — LocalBusiness &amp; Restaurant JSON-LD',
    desc: 'Free local business &amp; restaurant JSON-LD schema generator. Create valid LocalBusiness markup with address, hours, phone &amp; geo for local SEO.',
    h1: 'Local Business Schema Generator',
    lead: 'Generate valid <strong>LocalBusiness schema</strong> markup — including a <strong>restaurant JSON-LD</strong> option — with address, opening hours, phone and geo coordinates for local SEO.',
    explainer: `<h2>How to use local business schema markup</h2>
<p><strong>LocalBusiness schema</strong> is structured data that describes a physical, local business: its name, address, phone number, opening hours and location. Adding <strong>schema markup for local business</strong> pages helps Google connect your site to your business entity and can support your visibility in local search and maps.</p>
<p>This <strong>local business schema generator</strong> includes a <strong>restaurant JSON-LD schema generator</strong> mode plus other common categories like store, cafe, dentist and legal service. Always choose the <em>most specific</em> type that fits your business — <code>Restaurant</code> is better than the generic <code>LocalBusiness</code> when it applies.</p>
<h3>Required and recommended fields</h3>
<ul>
  <li><strong>Required:</strong> <code>name</code> and a complete <code>address</code> (<code>PostalAddress</code> with street, city and country).</li>
  <li><strong>Recommended:</strong> <code>telephone</code>, <code>openingHoursSpecification</code>, <code>geo</code> coordinates, an <code>image</code>, <code>priceRange</code> and your website <code>url</code>.</li>
</ul>
<h3>Keep it consistent</h3>
<p>Your name, address and phone number (NAP) in the markup should exactly match your Google Business Profile and the visible content on your site. Inconsistent details confuse search engines. Once generated, run the markup through our <a href="/schema-markup-validator/">schema validator</a> and add <a href="/organization-schema-generator/">Organization schema</a> on your homepage to round out your entity.</p>`,
    siblings: [V, card('/organization-schema-generator/', 'Organization Schema', 'Brand, logo &amp; socials.'), card('/review-schema-generator/', 'Review Schema', 'Star ratings.'), card('/event-schema-generator/', 'Event Schema', 'Events &amp; tickets.')],
  },
  {
    slug: '/organization-schema-generator/',
    crumbName: 'Organization Schema Generator',
    appName: 'Organization Schema Generator',
    module: '/assets/js/generators/organization.js',
    title: 'Organization Schema Generator — Logo &amp; Brand JSON-LD',
    desc: 'Free organization schema generator. Create valid Organization JSON-LD with logo, URL &amp; social profiles (sameAs) for your Google knowledge panel.',
    h1: 'Organization Schema Generator',
    lead: 'Create valid <strong>Organization schema markup</strong> with your <strong>logo</strong>, website, social profiles and contact point — the markup that helps shape your brand&rsquo;s Google knowledge panel.',
    explainer: `<h2>How to use organization schema markup</h2>
<p><strong>Organization schema</strong> is structured data that describes your company or brand as an entity. The most important reason to add it is the <strong>schema logo</strong>: Google uses the <code>logo</code> property to understand which image represents your organization in search features like the knowledge panel.</p>
<p>This <strong>organization schema generator</strong> outputs clean JSON-LD. The only required field is <code>name</code>, but you should also provide your <code>url</code>, a <code>logo</code> URL, your social and authoritative profile links via <code>sameAs</code>, and a <code>contactPoint</code> for support.</p>
<h3>Why sameAs matters</h3>
<p>The <code>sameAs</code> property is an array of URLs that point to other authoritative profiles for the same entity — your Twitter/X, LinkedIn, Facebook, YouTube and Wikipedia pages. These links help Google reconcile your brand across the web and strengthen your entity.</p>
<h3>Where to place it</h3>
<p>Add this <code>Organization</code> markup once, on your homepage. Use the <a href="/local-business-schema-generator/">Local Business generator</a> instead if you have a physical storefront, and the <a href="/article-schema-generator/">Article generator</a> to mark up the same organization as a content <code>publisher</code>. Verify the final output with our <a href="/schema-markup-validator/">schema markup checker</a>.</p>`,
    siblings: [V, card('/local-business-schema-generator/', 'Local Business Schema', 'Address, hours &amp; geo.'), card('/article-schema-generator/', 'Article Schema', 'Publisher markup.'), card('/breadcrumb-schema-generator/', 'Breadcrumb Schema', 'Breadcrumb trails.')],
  },
  {
    slug: '/breadcrumb-schema-generator/',
    crumbName: 'Breadcrumb Schema Generator',
    appName: 'Breadcrumb Schema Generator',
    module: '/assets/js/generators/breadcrumb.js',
    title: 'Breadcrumb Schema Generator — BreadcrumbList JSON-LD',
    desc: 'Free breadcrumb schema generator. Create valid BreadcrumbList JSON-LD structured data to show breadcrumb trails in Google search results.',
    h1: 'Breadcrumb Schema Generator',
    lead: 'Generate valid <strong>breadcrumb schema markup</strong> (BreadcrumbList JSON-LD) so Google can show a breadcrumb trail instead of a plain URL in your search listings.',
    explainer: `<h2>How to use breadcrumb schema markup</h2>
<p><strong>Breadcrumb schema</strong> (the <code>BreadcrumbList</code> type) is structured data that defines a page's position within your site hierarchy. When you add valid <strong>breadcrumb structured data</strong>, Google can replace the URL in your search result with a clean breadcrumb trail — improving how your listing looks and reads.</p>
<p>This generator builds the <code>itemListElement</code> array for you. Add each step from your homepage down to the current page, in order. Each becomes a <code>ListItem</code> with a <code>position</code>, a <code>name</code>, and an <code>item</code> URL. The URL is optional only on the final (current) page.</p>
<h3>Tips for valid breadcrumbs</h3>
<ul>
  <li>Positions must be sequential starting at 1 — the tool handles this automatically.</li>
  <li>The trail should mirror the breadcrumb a user actually sees on the page.</li>
  <li>Use absolute URLs (including https://) for each <code>item</code>.</li>
</ul>
<p>Breadcrumb markup pairs well with almost everything: add it alongside <a href="/article-schema-generator/">Article</a> or <a href="/product-schema-generator/">Product</a> schema on the same page. Check your final markup with the <a href="/schema-markup-validator/">schema validator</a>.</p>`,
    siblings: [V, card('/article-schema-generator/', 'Article Schema', 'Author &amp; dates.'), card('/product-schema-generator/', 'Product Schema', 'Price &amp; ratings.'), card('/faq-schema-generator/', 'FAQ Schema', 'FAQ rich results.')],
  },
  {
    slug: '/event-schema-generator/',
    crumbName: 'Event Schema Generator',
    appName: 'Event Schema Generator',
    module: '/assets/js/generators/event.js',
    title: 'Event Schema Generator — Free Event JSON-LD Markup',
    desc: 'Free event schema generator. Create valid Event JSON-LD structured data with dates, location, ticket offers &amp; performers for Google event rich results.',
    h1: 'Event Schema Generator',
    lead: 'Create valid <strong>Event schema markup</strong> (JSON-LD) with dates, location, ticket offers and performers to qualify for Google&rsquo;s event rich results and experiences.',
    explainer: `<h2>How to use event schema markup</h2>
<p><strong>Event schema</strong> is structured data that describes a scheduled event — a concert, workshop, webinar or festival. Valid <strong>event structured data</strong> makes your pages eligible for Google's event experiences, where events appear with their date, location and ticket link.</p>
<p>This generator supports in-person, online and mixed events. The required fields are <code>name</code>, <code>startDate</code> and a <code>location</code>. For online events the tool emits a <code>VirtualLocation</code> with your event URL; for in-person events it emits a <code>Place</code> with a full address.</p>
<h3>Recommended event properties</h3>
<ul>
  <li><code>endDate</code>, <code>image</code> and <code>description</code> for a complete listing.</li>
  <li><code>offers</code> — ticket price, currency, availability and a purchase <code>url</code>.</li>
  <li><code>performer</code> and <code>organizer</code> to credit who's involved.</li>
  <li><code>eventStatus</code> and <code>eventAttendanceMode</code> — important for keeping listings accurate.</li>
</ul>
<p>Use ISO 8601 dates with a timezone offset so the times are unambiguous. After building your <strong>Google event schema</strong>, validate it with our <a href="/schema-markup-validator/">schema checker</a> before publishing.</p>`,
    siblings: [V, card('/local-business-schema-generator/', 'Local Business Schema', 'Venue &amp; address.'), card('/organization-schema-generator/', 'Organization Schema', 'Organizer markup.'), card('/review-schema-generator/', 'Review Schema', 'Ratings &amp; reviews.')],
  },
  {
    slug: '/review-schema-generator/',
    crumbName: 'Review Schema Generator',
    appName: 'Review Schema Generator',
    module: '/assets/js/generators/review.js',
    title: 'Review Schema Generator — Review &amp; AggregateRating JSON-LD',
    desc: 'Free review schema generator. Create valid Review &amp; aggregateRating JSON-LD markup for star ratings in Google search results. No fake ratings.',
    h1: 'Review &amp; Rating Schema Generator',
    lead: 'Generate valid <strong>review schema markup</strong> and <strong>aggregateRating</strong> JSON-LD so your products, businesses and other items can show star ratings in search.',
    explainer: `<h2>How to use review &amp; rating schema markup</h2>
<p><strong>Review schema</strong> attaches a rating to an item so search engines can display star ratings — the eye-catching ⭐ ratings that boost click-through rate. This tool generates both a single <code>Review</code> and an <code>aggregateRating</code> summary, attached to the item type you choose (Product, LocalBusiness, Book, Movie, Course or SoftwareApplication).</p>
<p>A valid <code>Review</code> needs an <code>author</code> and a <code>reviewRating</code> with a <code>ratingValue</code>. The <code>aggregateRating</code> needs a <code>ratingValue</code> plus a <code>reviewCount</code> (or <code>ratingCount</code>). This is the core of any <strong>schema markup for reviews</strong>.</p>
<blockquote><strong>Important:</strong> only add review or rating markup for ratings that are <strong>genuinely collected and shown</strong> on the page. Self-serving or fabricated ratings violate Google's guidelines and can trigger a manual action that removes all your rich results.</blockquote>
<h3>Where star ratings can appear</h3>
<p>Review snippets are supported on specific content types — not on a whole website or organization. Attach ratings to the actual thing being reviewed. Pair this with the <a href="/product-schema-generator/">Product generator</a> for ecommerce, or the <a href="/local-business-schema-generator/">Local Business generator</a> for a storefront. Validate the result with our <a href="/schema-markup-validator/">schema markup validator</a>.</p>`,
    siblings: [V, card('/product-schema-generator/', 'Product Schema', 'Price &amp; ratings.'), card('/local-business-schema-generator/', 'Local Business Schema', 'Local ratings.'), card('/faq-schema-generator/', 'FAQ Schema', 'FAQ rich results.')],
  },
];

/* ---------------- Guides + lead-gen ---------------- */
const GEN_CARDS = [
  card('/schema-markup-validator/', 'Schema Validator', 'Test any JSON-LD.'),
  card('/faq-schema-generator/', 'FAQ Schema', 'FAQ rich results.'),
  card('/product-schema-generator/', 'Product Schema', 'Price &amp; ratings.'),
  card('/article-schema-generator/', 'Article Schema', 'Author &amp; dates.'),
];

const CTA = `<div class="cta-box">
  <h3>Need this done for you?</h3>
  <p>WebSensePro builds <strong>Shopify &amp; WordPress SEO and schema markup</strong> implementations that earn rich results — done right, the first time. If you'd rather hand it off, we'll handle the structured data, technical SEO and the rest.</p>
  <p><a class="btn btn-primary" href="https://websensepro.com">Work with WebSensePro →</a></p>
</div>`;

const guides = [
  {
    slug: '/what-is-schema-markup/',
    crumbName: 'What is Schema Markup',
    title: 'What is Schema Markup? Structured Data Explained Simply',
    desc: 'What is schema markup in laymans terms? A plain-English guide to structured data, how it works, and why it matters for SEO and rich results.',
    h1: 'What is Schema Markup?',
    body: `<p><strong>Schema markup</strong> is a small piece of code you add to a web page that helps search engines understand what the page is about. In layman's terms: your page might say “4.6 stars, $79, in stock,” and a human instantly gets it — but a search engine sees just text. Schema markup labels that text so the machine knows “this is a rating, this is a price, this is availability.”</p>
<p>It's also called <strong>structured data</strong>. The vocabulary comes from <a href="https://schema.org" rel="noopener" target="_blank">schema.org</a>, a shared standard backed by Google, Microsoft, Yahoo and Yandex. The recommended format for adding it is <a href="/json-ld/">JSON-LD</a>.</p>
<h2>What is website schema used for?</h2>
<p>When search engines understand your content, they can present it more richly. That's where <strong>rich results</strong> come from — the enhanced listings with star ratings, FAQ dropdowns, breadcrumbs, event dates, recipe cards and more. Rich results take up more space and tend to attract more clicks.</p>
<h2>A simple example</h2>
<p>Here's FAQ schema in JSON-LD:</p>
<pre class="code"><code>&lt;script type="application/ld+json"&gt;
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is schema markup?",
    "acceptedAnswer": { "@type": "Answer", "text": "Code that helps search engines understand your page." }
  }]
}
&lt;/script&gt;</code></pre>
<h2>Does schema markup help SEO?</h2>
<p>Schema markup is not a direct ranking factor, but it makes you eligible for rich results, which improve click-through rate — and it helps search engines understand your site's entities and relationships. Both indirectly support SEO.</p>
<h2>How do I add it?</h2>
<p>The easiest way is to generate it with a tool and paste it in. Start with our <a href="/faq-schema-generator/">FAQ</a>, <a href="/product-schema-generator/">Product</a> or <a href="/article-schema-generator/">Article</a> generators, then read <a href="/how-to-add-schema-markup/">how to add schema markup</a> and explore the <a href="/types-of-schema-markup/">types of schema markup</a> worth using.</p>`,
    siblings: GEN_CARDS,
  },
  {
    slug: '/types-of-schema-markup/',
    crumbName: 'Types of Schema Markup',
    title: 'Types of Schema Markup: The Ones That Earn Rich Results',
    desc: 'The most useful types of schema markup for SEO — FAQ, Product, Article, LocalBusiness, Review, Breadcrumb, Event and more — with examples and generators.',
    h1: 'Types of Schema Markup',
    body: `<p>Schema.org defines hundreds of <strong>types of schema markup</strong>, but only a handful reliably earn rich results in Google. Here are the ones worth your time, what they do, and a generator for each.</p>
<table>
<thead><tr><th>Type</th><th>What it does</th><th>Generator</th></tr></thead>
<tbody>
<tr><td><strong>FAQPage</strong></td><td>Shows expandable Q&amp;A in search</td><td><a href="/faq-schema-generator/">FAQ generator</a></td></tr>
<tr><td><strong>Product</strong></td><td>Price, availability &amp; ratings</td><td><a href="/product-schema-generator/">Product generator</a></td></tr>
<tr><td><strong>Article</strong></td><td>Headline, author, dates</td><td><a href="/article-schema-generator/">Article generator</a></td></tr>
<tr><td><strong>LocalBusiness</strong></td><td>Address, hours, phone</td><td><a href="/local-business-schema-generator/">Local Business generator</a></td></tr>
<tr><td><strong>Organization</strong></td><td>Brand, logo, social profiles</td><td><a href="/organization-schema-generator/">Organization generator</a></td></tr>
<tr><td><strong>BreadcrumbList</strong></td><td>Breadcrumb trail in results</td><td><a href="/breadcrumb-schema-generator/">Breadcrumb generator</a></td></tr>
<tr><td><strong>Event</strong></td><td>Dates, venue, tickets</td><td><a href="/event-schema-generator/">Event generator</a></td></tr>
<tr><td><strong>Review / AggregateRating</strong></td><td>Star ratings</td><td><a href="/review-schema-generator/">Review generator</a></td></tr>
</tbody>
</table>
<h2>How to choose</h2>
<p>Match the type to the page. A product page gets <code>Product</code>; a blog post gets <code>Article</code> (or <code>BlogPosting</code>); a store's contact page gets <code>LocalBusiness</code>. You can — and often should — combine types on one page, for example <code>Article</code> + <code>BreadcrumbList</code>.</p>
<h2>Don't over-mark-up</h2>
<p>Only add markup that reflects content visible on the page, and only types that match your content. If you're new to this, read <a href="/what-is-schema-markup/">what is schema markup</a> and <a href="/how-to-add-schema-markup/">how to add schema markup</a>. Then validate everything with our <a href="/schema-markup-validator/">schema validator</a>.</p>`,
    siblings: GEN_CARDS,
  },
  {
    slug: '/how-to-add-schema-markup/',
    crumbName: 'How to Add Schema Markup',
    title: 'How to Add Schema Markup to Your Website (Step by Step)',
    desc: 'How to add schema markup to a website the right way: generate JSON-LD, paste it into your page, and validate it. Works for any CMS, Shopify or WordPress.',
    h1: 'How to Add Schema Markup to a Website',
    body: `<p>Adding <strong>schema markup</strong> to your website is a three-step process: generate the JSON-LD, paste it into the page, and validate it. You don't need to be a developer. Here's <strong>how to add schema markup</strong> the right way.</p>
<h2>Step 1 — Generate the JSON-LD</h2>
<p>Pick the schema type that matches your page and use a generator to build the markup. For example, use the <a href="/faq-schema-generator/">FAQ generator</a> for an FAQ section, or the <a href="/product-schema-generator/">Product generator</a> for a product page. Fill in the fields and copy the ready-made <code>&lt;script type="application/ld+json"&gt;</code> snippet.</p>
<h2>Step 2 — Paste it into your page</h2>
<p>JSON-LD goes inside a <code>&lt;script&gt;</code> tag. You can place it in the <code>&lt;head&gt;</code> or anywhere in the <code>&lt;body&gt;</code> — Google reads it either way.</p>
<ul>
<li><strong>Any HTML site:</strong> paste the snippet into the page template.</li>
<li><strong>WordPress:</strong> use a code-snippet plugin or your theme's header — see our <a href="/wordpress-schema-markup/">WordPress schema markup guide</a>.</li>
<li><strong>Shopify:</strong> add it to the relevant <code>.liquid</code> template — see the <a href="/shopify-schema-markup/">Shopify schema markup guide</a>.</li>
<li><strong>Google Tag Manager:</strong> inject it via a Custom HTML tag.</li>
</ul>
<h2>Step 3 — Validate it</h2>
<p>Before and after publishing, run your markup through our <a href="/schema-markup-validator/">schema markup validator</a> to catch missing required and recommended fields, then confirm eligibility with Google's <a href="https://search.google.com/test/rich-results" rel="nofollow noopener" target="_blank">Rich Results Test</a>.</p>
<h2>Keep it accurate</h2>
<p>Only mark up content that's actually visible on the page, keep details (prices, hours, ratings) in sync, and re-validate when you change a template. New here? Start with <a href="/what-is-schema-markup/">what is schema markup</a> and the <a href="/types-of-schema-markup/">types of schema markup</a>.</p>`,
    siblings: GEN_CARDS,
  },
  {
    slug: '/json-ld/',
    crumbName: 'What is JSON-LD',
    title: 'What is JSON-LD? Google&rsquo;s Recommended Structured Data Format',
    desc: 'What is JSON-LD? A plain-English guide to the structured data format Google recommends, with JSON-LD examples and how it compares to Microdata.',
    h1: 'What is JSON-LD?',
    body: `<p><strong>JSON-LD</strong> (JSON for Linking Data) is a way to write <a href="/what-is-schema-markup/">structured data</a> using ordinary JSON. It's the format <strong>Google recommends</strong> for schema markup because it's clean, easy to add, and kept entirely in a single <code>&lt;script&gt;</code> block — separate from your visible HTML.</p>
<h2>What does JSON-LD look like?</h2>
<pre class="code"><code>&lt;script type="application/ld+json"&gt;
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Acme Inc.",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png"
}
&lt;/script&gt;</code></pre>
<p>Two special keys do the heavy lifting: <code>@context</code> tells parsers the vocabulary is schema.org, and <code>@type</code> declares what kind of thing you're describing.</p>
<h2>JSON-LD vs Microdata vs RDFa</h2>
<p>There are three ways to add structured data. <strong>Microdata</strong> and <strong>RDFa</strong> weave attributes into your visible HTML, which is fiddly and error-prone. <strong>JSON-LD</strong> keeps everything in one block you can generate, paste and update independently — which is exactly why it won.</p>
<h2>JSON-LD and SEO</h2>
<p>For <strong>JSON-LD SEO</strong>, the format itself doesn't rank you — but it's the most reliable way to become eligible for rich results, and the easiest to maintain at scale. Generate valid JSON-LD with any of our tools (<a href="/faq-schema-generator/">FAQ</a>, <a href="/product-schema-generator/">Product</a>, <a href="/local-business-schema-generator/">Local Business</a>), learn <a href="/how-to-add-schema-markup/">how to add it</a>, then check it with our <a href="/schema-markup-validator/">validator</a>.</p>`,
    siblings: GEN_CARDS,
  },
  {
    slug: '/shopify-schema-markup/',
    crumbName: 'Shopify Schema Markup',
    title: 'Shopify Schema Markup: Implementation Guide (JSON-LD)',
    desc: 'Shopify schema markup implementation guide. Add JSON-LD structured data to your Shopify theme for product, FAQ &amp; breadcrumb rich results — step by step.',
    h1: 'Shopify Schema Markup: Implementation Guide',
    body: `<p>Adding <strong>schema markup to Shopify</strong> is one of the highest-ROI structured-data tasks in ecommerce SEO. Done right, your products become eligible for price, availability and rating rich results. This is a practical <strong>Shopify schema markup implementation guide</strong> using JSON-LD structured data.</p>
<h2>What schema do Shopify stores need?</h2>
<ul>
<li><strong>Product</strong> on product pages — <a href="/product-schema-generator/">generate it here</a>.</li>
<li><strong>BreadcrumbList</strong> on collection and product pages — <a href="/breadcrumb-schema-generator/">generator</a>.</li>
<li><strong>Organization</strong> on the homepage — <a href="/organization-schema-generator/">generator</a>.</li>
<li><strong>FAQPage</strong> on pages with Q&amp;A — <a href="/faq-schema-generator/">generator</a>.</li>
</ul>
<h2>Where to add it in your theme</h2>
<p>Shopify themes use Liquid. To add static markup, edit the relevant template under <strong>Online Store → Themes → Edit code</strong>. Product markup belongs in <code>sections/main-product.liquid</code> (or a snippet it includes); site-wide markup like Organization can go in <code>layout/theme.liquid</code>.</p>
<p>For dynamic product values, replace the static fields from the generator with Liquid variables, for example:</p>
<pre class="code"><code>&lt;script type="application/ld+json"&gt;
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": {{ product.title | json }},
  "image": {{ product.featured_image | image_url: width: 1200 | json }},
  "offers": {
    "@type": "Offer",
    "price": {{ product.price | divided_by: 100.0 | json }},
    "priceCurrency": {{ cart.currency.iso_code | json }},
    "availability": "https://schema.org/{% if product.available %}InStock{% else %}OutOfStock{% endif %}"
  }
}
&lt;/script&gt;</code></pre>
<p>The <code>| json</code> filter safely escapes values. Use our generator to get the structure right, then swap in Liquid.</p>
<h2>A note on Shopify's default markup</h2>
<p>Many themes include some Product markup already — but it's often incomplete or duplicated. Run your live product URL's HTML through our <a href="/schema-markup-validator/">schema validator</a> to see what's there and what's missing before adding more, so you don't end up with conflicting blocks.</p>
<h2>Validate, then ship</h2>
<p>After editing your theme, validate with our checker and Google's Rich Results Test. Re-check after any theme update.</p>`,
    cta: CTA,
    siblings: GEN_CARDS,
  },
  {
    slug: '/wordpress-schema-markup/',
    crumbName: 'WordPress Schema Markup',
    title: 'WordPress Schema Markup: How to Add It (With or Without a Plugin)',
    desc: 'How to add schema markup in WordPress — with a plugin or by hand with JSON-LD. Add Article, FAQ, Product &amp; LocalBusiness structured data the right way.',
    h1: 'WordPress Schema Markup: How to Add It',
    body: `<p>There are two ways to add <strong>schema markup in WordPress</strong>: use a plugin, or paste JSON-LD by hand. This guide covers both so you can pick what fits your site — and avoid the most common mistake, duplicate markup.</p>
<h2>Option 1 — Add WordPress schema markup by hand</h2>
<p>This gives you full control. Generate the JSON-LD with one of our tools — <a href="/article-schema-generator/">Article</a>, <a href="/faq-schema-generator/">FAQ</a>, <a href="/product-schema-generator/">Product</a> or <a href="/local-business-schema-generator/">Local Business</a> — and add the <code>&lt;script&gt;</code> snippet using any of these:</p>
<ul>
<li>A <strong>code-snippet plugin</strong> (e.g. WPCode) — paste the snippet and target specific pages.</li>
<li>Your theme's <strong>header.php</strong> or a block in the template (best via a child theme).</li>
<li><strong>Google Tag Manager</strong> via a Custom HTML tag.</li>
</ul>
<h2>Option 2 — Use a schema markup plugin for WordPress</h2>
<p>SEO plugins like Yoast, Rank Math and Schema Pro can output structured data automatically. They're convenient, but the markup is generic and you have less control over the exact properties. If you use one, don't <em>also</em> paste manual markup for the same type — that creates duplicates.</p>
<h2>Avoiding duplicate schema</h2>
<p>Duplicate or conflicting markup is the number-one WordPress schema problem, because themes and plugins both emit it. The fix: paste your live page's HTML into our <a href="/schema-markup-validator/">schema markup validator</a> to see every JSON-LD block already on the page before you add more.</p>
<h2>Validate your markup</h2>
<p>Whichever route you choose, validate with our checker and Google's Rich Results Test, and re-check after plugin or theme updates. For the fundamentals, see <a href="/how-to-add-schema-markup/">how to add schema markup</a> and <a href="/what-is-schema-markup/">what is schema markup</a>.</p>`,
    cta: CTA,
    siblings: GEN_CARDS,
  },
];

module.exports = { generators, guides };
