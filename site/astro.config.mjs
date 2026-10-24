import { defineConfig } from 'astro/config';

export default defineConfig({
  // Canonical/og:url base. Set SITE_URL on the host when serving from a subdomain.
  site: process.env.SITE_URL ?? 'https://assessoriakp.com.br',
  compressHTML: true,
  build: { inlineStylesheets: 'always' },
  image: { responsiveStyles: false },
});
