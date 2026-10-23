import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://assessoriakp.com.br',
  compressHTML: true,
  build: { inlineStylesheets: 'always' },
  image: { responsiveStyles: false },
});
