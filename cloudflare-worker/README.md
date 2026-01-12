# HTTP Relay CORS Proxy - Cloudflare Worker

This Cloudflare Worker proxies requests to `demo.httprelay.io` and adds CORS headers to enable browser-based Pubky authentication from GitHub Pages.

## Why This Is Needed

- GitHub Pages (static site) cannot proxy requests
- `demo.httprelay.io` doesn't send CORS headers
- Browser blocks requests from `gcomte.github.io` to `demo.httprelay.io`
- This worker acts as a CORS-enabled proxy between the two

## Setup Instructions

### Prerequisites

1. A Cloudflare account (free tier is sufficient)
2. Node.js installed locally
3. npm or yarn package manager

### Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

This will open a browser window for authentication.

### Step 3: Deploy the Worker

From the `cloudflare-worker` directory:

```bash
wrangler deploy
```

### Step 4: Get Your Worker URL

After deployment, Wrangler will output a URL like:

```
https://pubkytecture-httprelay-proxy.<your-subdomain>.workers.dev
```

Copy this URL.

### Step 5: Update the React App

In `/src/components/auth/PubkyLogin.tsx`, replace the HTTP relay URL:

```typescript
// Before
const DEFAULT_HTTP_RELAY = import.meta.env.DEV
  ? '/api/httprelay/link/'
  : 'https://demo.httprelay.io/link/';

// After (use your worker URL)
const DEFAULT_HTTP_RELAY = import.meta.env.DEV
  ? '/api/httprelay/link/'
  : 'https://pubkytecture-httprelay-proxy.<your-subdomain>.workers.dev/link/';
```

### Step 6: Deploy to GitHub Pages

Commit and push your changes, then deploy to GitHub Pages.

## How It Works

```
┌─────────────────┐
│  Browser App    │
│ (GitHub Pages)  │
└────────┬────────┘
         │ 1. Request with Origin: gcomte.github.io
         ▼
┌─────────────────────┐
│ Cloudflare Worker   │
│  (CORS Proxy)       │
│                     │
│ • Adds CORS headers │
│ • Forwards request  │
└────────┬────────────┘
         │ 2. Server-to-server (no CORS)
         ▼
┌─────────────────────┐
│ demo.httprelay.io   │
│  (HTTP Relay)       │
└─────────────────────┘
```

## Cost

**Free Tier Limits:**
- 100,000 requests per day
- 10ms CPU time per request

This should be more than sufficient for a demo/educational project.

## Monitoring

View logs and analytics in the Cloudflare Dashboard:
1. Go to https://dash.cloudflare.com
2. Navigate to Workers & Pages
3. Click on your worker
4. View logs, metrics, and errors

## Troubleshooting

### Worker not found (404)
- Check the worker URL is correct
- Verify deployment succeeded: `wrangler deployments list`

### Still getting CORS errors
- Check browser console for the exact error
- Verify the worker URL is being used (check Network tab)
- Test the worker directly: `curl https://your-worker-url.workers.dev/link/test`

### Worker deployment fails
- Ensure you're logged in: `wrangler whoami`
- Check you have permissions in the Cloudflare account
- Try `wrangler login` again

## Local Development

To test the worker locally:

```bash
wrangler dev
```

This starts a local server at `http://localhost:8787`

## Alternative: Custom Domain (Optional)

If you have a custom domain on Cloudflare:

1. Update `wrangler.toml` routes section
2. Run `wrangler deploy`
3. Your worker will be available at your custom domain

## Updating the Worker

Make changes to `httprelay-proxy.js` and deploy:

```bash
wrangler deploy
```

Changes are live immediately.
