import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { build, loadEnv } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
const env = loadEnv('production', root);
const siteUrl = getSiteUrl(env.VITE_SITE_URL?.trim());

function getSiteUrl(value) {
  if (!value) return;
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
    throw new Error('VITE_SITE_URL must be your public HTTPS homepage URL, with no subpath, query, or fragment.');
  }
  return url.href;
}

const escapeAttr = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const socialTag = (property, content) => `<meta property="${property}" content="${escapeAttr(content)}">`;

await build({ root });
const temporary = await mkdtemp(join(root, '.seo-build-'));
const serverFile = join(temporary, 'entry.mjs');
try {
  await build({
    root,
    build: { ssr: 'src/main.jsx', outDir: temporary, copyPublicDir: false,
      rollupOptions: { output: { entryFileNames: 'entry.mjs' } } },
  });
  const { App, business, justdialListing, mapsListing } = await import(pathToFileURL(serverFile));
  const services = ['Laptop and PC repair', 'Data recovery', 'Computer networking', 'Office IT maintenance and AMC'];
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    telephone: business.phone,
    email: business.email || undefined,
    url: siteUrl,
    '@id': siteUrl ? new URL('#business', siteUrl).href : undefined,
    logo: siteUrl ? new URL('vishwa-logo.svg', siteUrl).href : undefined,
    image: siteUrl ? new URL('social-preview.jpg', siteUrl).href : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.streetAddress,
      addressLocality: business.addressLocality,
      addressRegion: business.addressRegion,
      postalCode: business.postalCode,
      addressCountry: 'IN',
    },
    areaServed: ['Nalasopara East', 'Vasai-Virar'],
    sameAs: business.placeId ? [justdialListing, mapsListing] : [justdialListing],
    hasOfferCatalog: {
      '@type': 'OfferCatalog', name: 'Computer repair and IT services',
      itemListElement: services.map(name => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
    },
  };
  const schemaMarkup = JSON.stringify(schema).replaceAll('<', '\\u003c');
  const indexPath = join(dist, 'index.html');
  const index = await readFile(indexPath, 'utf8');
  const title = index.match(/<title>([^<]+)<\/title>/)[1];
  const description = index.match(/<meta name="description" content="([^"]+)"/)[1];
  const social = [
    ['og:type', 'website'], ['og:locale', 'en_IN'], ['og:site_name', business.name],
    ['og:title', title], ['og:description', description],
  ];
  if (siteUrl) social.push(
    ['og:url', siteUrl], ['og:image', new URL('social-preview.jpg', siteUrl).href],
    ['og:image:width', '1200'], ['og:image:height', '630'],
    ['og:image:alt', 'Laptop motherboard being serviced on a repair bench'],
  );
  const head = [
    ...(siteUrl ? [`<link rel="canonical" href="${escapeAttr(siteUrl)}">`] : []),
    ...social.map(([property, content]) => socialTag(property, content)),
    `<meta name="twitter:card" content="${siteUrl ? 'summary_large_image' : 'summary'}">`,
    `<script type="application/ld+json">${schemaMarkup}</script>`,
  ].join('\n    ');
  const rootMarker = '<div id="root"></div>';
  if (!index.includes(rootMarker)) throw new Error('Cannot find the React root in the generated index.');
  const markup = renderToString(React.createElement(App));
  await writeFile(indexPath, index.replace(rootMarker, () => `<div id="root">${markup}</div>`)
    .replace(/\s*<!-- seo-build -->/, '').replace('</head>', () => `  ${head}\n  </head>`));
  const sitemapUrl = siteUrl ? new URL('sitemap.xml', siteUrl).href : undefined;
  await writeFile(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n${sitemapUrl ? `Sitemap: ${sitemapUrl}\n` : ''}`);
  if (sitemapUrl) {
    await writeFile(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escapeAttr(siteUrl)}</loc></url></urlset>\n`);
  }
  console.log('Pre-rendered homepage with business structured data and search metadata.');
} finally {
  await rm(temporary, { recursive: true, force: true });
}
