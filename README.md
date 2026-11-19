# Vishwa IT Solutions

A React storefront for computer repair, annual maintenance contracts (AMC), networking, data recovery, IT support and second-hand computers in Nalasopara East.

## Run locally

Use Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run build
npm run preview
```

Open the local URL printed by Vite. The build creates the static site in `dist/`. Run `npm run dev` for live reload while editing.

## Launch and local search

Set `VITE_SITE_URL` in `.env.local` to your real public HTTPS homepage, then build and deploy `dist/` at that domain’s root. The build writes the storefront into the initial HTML and adds LocalBusiness structured data, a favicon, page metadata and social preview tags. With the public URL set, it also generates a canonical URL, absolute social image and `sitemap.xml` referenced by `robots.txt`.

After deployment, verify the domain in [Google Search Console](https://search.google.com/search-console/), submit `sitemap.xml`, and add the website link to your Google Business Profile and Justdial profile. Confirm that the business name, phone and address across those profiles match the details you want customers to use.

## Contact

The business phone and WhatsApp number are +91 76667 04188. The address is Room no. 2, Chauhan Chawl, Hans Vijay Nagar, Hawai Pada, Nalasopara East, Vasai-Virar, Maharashtra 401209. To add a clickable email address, copy `.env.example` to `.env.local`, set `VITE_BUSINESS_EMAIL`, then restart or rebuild. Contact details and prefilled WhatsApp URLs are centralized in `src/business.js`.

## List laptops and desktops

1. Open the local site with `?inventory=1` appended to its URL.
2. Add devices with model, specs and condition. Price and a photo URL are optional. Change status to **Sold** to hide a device from the public shop.
3. Export the catalog, replace `src/catalog.json` with the downloaded file, and rebuild. The editor saves drafts in that browser. Exporting and rebuilding makes the listings visible to other visitors.

The starter catalog is empty. The public shop shows an availability enquiry until listings are added.

## Show live Google reviews

1. In Google Cloud, enable billing, Maps JavaScript API and the Places APIs required in the [Google setup guide](https://developers.google.com/maps/documentation/javascript/place-get-started).
2. Set `VITE_GOOGLE_MAPS_API_KEY` in `.env.local` to a browser key restricted to your site origins and the required APIs. Add the local preview origin to its restrictions if testing locally. Vite embeds this browser key in the frontend build.
3. Set `VITE_GOOGLE_PLACE_ID` to the verified Place ID for Vishwa IT Solutions. Use [Google’s Place ID finder](https://developers.google.com/maps/documentation/javascript/place-id) and confirm that it matches the business.
4. Restart or rebuild. The page fetches the live rating, rating count and up to five reviews from Google, with reviewer attribution and a link to the listing. If credentials are missing or the request fails, the site displays the supplied Google rating snapshot, the selected customer excerpts in `src/testimonials.js`, and a Google Maps search link. The Justdial card uses the supplied listing snapshot and links to the matching Justdial profile.

If you deploy the site with Google review content, publish the Terms of Use and Privacy Policy required by [Google Maps Platform policies](https://developers.google.com/maps/documentation/javascript/policies).

## Design

The supplied transparent PCB V logo sets the palette. Use burgundy `#63243B` for the brand and main actions, dark wine `#321723` for large dark panels, brass `#AD7625` for logo accent work, and pale gold `#F1C786` on dark areas. The generated workbench photo is illustrative. The reusable implementation brief is in `DESIGN-BRIEF.md`.

WhatsApp links use the unmodified digital glyphs from the [WhatsApp Brand Resource Center](https://www.meta.com/brand/resources/whatsapp/whatsapp-brand/). The five original Lottie illustrations and their static SVG alternatives live in `public/animations/`. The player loads on demand, plays as an icon scrolls into view and uses the static icon when reduced motion is enabled.

The hero image in `public/repair-bench.webp` was created with the built-in image generation tool. Image prompt: “Wide landscape editorial photograph for a premium neighbourhood computer repair shop website hero. Close-up diagonal open black business laptop with its back cover removed, visible green-black motherboard and copper heat pipe, a technician's hands using a precision screwdriver from the upper right, tidy dark charcoal anti-static bench with a couple of repair tools. Warm directional tungsten light, authentic modern hardware, crisp textures, subtle burgundy reflections and brass warmth. Composition hero device fills the middle and lower area, no faces, no logos, no text, no watermark. Photorealistic photography, refined muted palette, wide 3:2.”
