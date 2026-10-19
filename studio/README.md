# Naqsh Studio (headless CMS dashboard)

Sanity Studio where the client manages products, brands, categories, fabrics and colors — no code changes needed.

## One-time setup

1. Create a free project at https://www.sanity.io/manage → copy the **Project ID**.
2. In the project: **API → CORS origins** → add your website URL(s) (e.g. `http://localhost:8080`, your live domain). Credentials not needed.
3. In `studio/`:
   ```bash
   npm install
   npx sanity login
   ```
4. Create `studio/.env`:
   ```
   SANITY_STUDIO_PROJECT_ID=your_project_id
   SANITY_STUDIO_DATASET=production
   ```
5. Import the existing 30 products (optional, once): create an **Editor** token in
   Sanity → API → Tokens, then
   ```powershell
   $env:SANITY_STUDIO_PROJECT_ID="your_project_id"; $env:SANITY_WRITE_TOKEN="sk..."; npm run seed
   ```
6. In the website root `.env` (and in your hosting/Lovable env vars):
   ```
   VITE_SANITY_PROJECT_ID=your_project_id
   VITE_SANITY_DATASET=production
   ```

## Daily use

- Local dashboard: `npm run dev` (http://localhost:3333)
- Hosted dashboard for the client: `npm run deploy` → `https://naqsh-admin.sanity.studio`
  (invite the client under Sanity → Members).
- Edit/add/delete products → click **Publish** → the shop updates within ~1 minute.

If `VITE_SANITY_PROJECT_ID` is not set, the website falls back to the static catalog in `src/data/shopProducts.ts`.
