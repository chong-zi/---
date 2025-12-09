<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/158--45jgPLJn0nQyH0K5jv2GqsmX8RSo

## Run Locally

**Prerequisites:** Node.js (>=16)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and set your API key:
   ```bash
   cp .env.example .env.local
   # Edit .env.local and replace the placeholder with your real key
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

## Build / Serve

```bash
# Build a production bundle
npm run build

# Serve the static `dist` directory locally (requires an http server)
# You can install `serve` globally for a quick test:
npx serve -s dist
```

## Deployment (Vercel)

Quick steps to deploy to Vercel (recommended for static frontends):

1. Create a Vercel account at https://vercel.com
2. Import your GitHub repository in Vercel
3. In the Vercel project settings, add an Environment Variable:
   - `VITE_GEMINI_API_KEY` = your API key (set for Production/Preview as needed)
4. Use the default build command: `npm run build` and publish directory: `dist`

Notes:
- Do NOT commit `.env.local` — use the Vercel UI to set project environment variables.
- For production security, consider proxying Gemini requests through a server endpoint instead of exposing the key to the client.

## Long-running / sharing options

- For short demos you can keep the Codespace port public (Ports view → set port `3000` to Public). This requires your Codespace to be running.
- For more stable hosting, deploy to Vercel/Netlify/Cloud Run so the app doesn't depend on your Codespace uptime.

