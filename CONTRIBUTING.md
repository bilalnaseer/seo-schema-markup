# Contributing

Thanks for your interest in improving the **SEO Schema Markup Generator & Validator**.

This is a deliberately simple, **vanilla, no-build** static site. Please keep it that way:

- **No frameworks** (React/Vue/etc.), no CSS frameworks, no client-side routing.
- **No build step** — every page is a real `.html` file that runs as-is.
- **No external runtime dependencies / CDNs.** All JS is hand-written vanilla ES modules.
- **No fake ratings/reviews.** `aggregateRating` is only ever emitted from genuine votes.

## How to contribute

1. Fork and create a branch: `git checkout -b fix/your-thing`.
2. Make your change. Test by opening the affected `.html` file in a browser (or `npx serve`).
3. Keep schema output valid — verify against Google's [Rich Results Test](https://search.google.com/test/rich-results) and the [Schema.org validator](https://validator.schema.org/).
4. The single source of truth for required/recommended properties is `assets/js/schema-rules.js`. Update it there — generators and the validator both read from it.
5. Open a PR with a clear description.

## Good first issues

- New schema type generators (HowTo, Recipe, JobPosting, Course…).
- Improved fix-suggestion copy in the validator.
- Accessibility and Lighthouse improvements.

Built and maintained by [Bilal Naseer](https://websensepro.com) / [WebSensePro](https://websensepro.com).
