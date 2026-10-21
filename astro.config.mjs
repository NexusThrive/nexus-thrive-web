// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://nexusthrive.com.co',
  // Las capturas ya se guardan optimizadas (WebP, 2400 px escritorio y 780 px
  // móvil): no hace falta Sharp en el build.
  image: { service: passthroughImageService() },
});
