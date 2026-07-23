# Blog + CMS setup (Sveltia CMS)

The blog lets your content team write posts in a friendly UI at
`https://seoschemamarkup.com/admin` — no Git or code knowledge needed. Sveltia
CMS commits Markdown to `content/blog/`; on deploy, Cloudflare Pages runs
`tools/build-blog.js` to turn each post into a static, crawlable HTML page under
`/blog/`, and `tools/build-sitemap.js` adds it to the sitemap.

Everything in the repo is already wired. The steps below are the one-time
**dashboard** setup that only you can do (accounts, OAuth, Cloudflare settings).

---

## How it works (once set up)

```
Team writes a post at /admin  →  Sveltia commits a .md to content/blog/
   →  (editorial workflow) you approve it in the same /admin UI
   →  Cloudflare Pages runs the build  →  /blog/<slug>/ HTML + sitemap updated
   →  live on seoschemamarkup.com/blog
```

Posts go through **Draft → In review → Ready**. Nothing publishes until you
approve it — and you approve from inside the CMS, so you don't touch GitHub either.

---

## 1. Cloudflare Pages: add the build command

In the Cloudflare dashboard → your Pages project → **Settings → Builds &
deployments**:

- **Build command:**
  ```
  node tools/build-pages.js && node tools/build-blog.js && node tools/build-sitemap.js
  ```
- **Build output directory:** `/`  (the site's HTML lives at the repo root)
- **Framework preset:** None
- **Node version:** set env var `NODE_VERSION` = `20` (or newer)

> The public site still runs as pure static HTML with zero runtime dependencies.
> The build only *generates* that HTML — same idea as the existing tools scripts.

## 2. Create a GitHub OAuth App (so the team logs in without using GitHub)

GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**:

- **Application name:** SEO Schema Markup CMS
- **Homepage URL:** `https://seoschemamarkup.com`
- **Authorization callback URL:** `https://<your-worker-subdomain>.workers.dev/callback`
  (you'll get the worker URL in step 3 — you can come back and edit this)

Save the **Client ID** and generate a **Client Secret**.

## 3. Deploy the auth bridge (Cloudflare Worker)

Sveltia provides a tiny OAuth worker: **`sveltia/sveltia-cms-auth`**
(https://github.com/sveltia/sveltia-cms-auth). Deploy it to your Cloudflare
account (there's a one-click Deploy button in that repo, or use `wrangler`).

Set these Worker environment variables (as **secrets**):

| Variable | Value |
|---|---|
| `GITHUB_CLIENT_ID` | from step 2 |
| `GITHUB_CLIENT_SECRET` | from step 2 |
| `ALLOWED_DOMAINS` | `seoschemamarkup.com` |

Copy the deployed Worker origin (e.g. `https://sveltia-cms-auth.you.workers.dev`)
and put it back into the GitHub OAuth App callback URL (step 2, `/callback`).

## 4. Point the CMS at your worker

Edit **`admin/config.yml`** and replace the placeholder: 

```yaml
backend:
  name: github
  repo: bilalnaseer/seo-schema-markup
  branch: main
  base_url: https://sveltia-cms-auth.you.workers.dev   # <-- your worker origin
```

Commit that change. (Everything else in `config.yml` is already set.)

## 5. Give your team access

Each team member needs a **GitHub account**, invited as a **collaborator** with
write access:

GitHub repo → **Settings → Collaborators → Add people**.

That invite is the *only* time they interact with GitHub. From then on they just
visit `seoschemamarkup.com/admin`, click **Login with GitHub**, and write posts.

---

## Writing a post (for the team)

1. Go to `https://seoschemamarkup.com/admin` and log in.
2. **Blog posts → New Blog post.**
3. Fill in Title, Meta description, Publish date, and write the content.
4. (Optional) add a cover image and tags.
5. Save as **Draft**, move to **In review** when ready.
6. An admin approves it → it publishes automatically in ~1–2 minutes.

---

## Notes & maintenance

- **Approval on/off:** `publish_mode: editorial_workflow` in `admin/config.yml`
  enables the review gate. Remove that line to publish instantly (no approval).
- **Updating Sveltia:** the editor bundle is vendored at `admin/sveltia-cms.js`
  (pinned, no CDN). To update, re-download a pinned version:
  ```
  curl -sL "https://unpkg.com/@sveltia/cms@<version>/dist/sveltia-cms.js" -o admin/sveltia-cms.js
  ```
- **Local preview of the blog:** `node tools/build-blog.js` then open
  `blog/index.html`.
- **Scaling:** a single `sitemap.xml` is fine into the hundreds of URLs. If the
  blog grows very large, split it into a separate `sitemap-blog.xml` + index.
```
