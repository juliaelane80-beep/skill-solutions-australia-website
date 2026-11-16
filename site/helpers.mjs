import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { photos } from './content.mjs';

const photoDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets', 'images', 'photos');

export const arrow =
  '<svg class="btn__arrow" width="22" height="14" viewBox="0 0 22 14" aria-hidden="true" focusable="false"><path d="M1 7h19M14 1l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';

/** Rectangular button/link. variant: solid | outline | lime | light */
export const btn = (label, href, variant = 'solid') =>
  `<a class="btn btn--${variant}" href="${href}">${label}${arrow}</a>`;

/**
 * Render a photo slot. Uses the real file when present, otherwise a labelled
 * placeholder describing the shot required.
 */
export function photo(key, { cls = '', priority = false } = {}) {
  const p = photos[key];
  if (!p) throw new Error(`Unknown photo slot: ${key}`);
  if (p.file) {
    return `<img class="photo ${cls}" src="${p.file}" alt="${p.alt}" width="${p.width}" height="${p.height}" loading="lazy" decoding="async">`;
  }
  const desktop = `assets/images/photos/${key}.jpg`;
  const mobile = `assets/images/photos/${key}-mobile.jpg`;
  if (existsSync(join(photoDir, `${key}.jpg`))) {
    const source = existsSync(join(photoDir, `${key}-mobile.jpg`))
      ? `<source media="(max-width: 760px)" srcset="${mobile}">`
      : '';
    return `<picture>${source}<img class="photo p-${key} ${cls}" src="${desktop}" alt="${p.alt}" ${
      priority ? 'fetchpriority="high"' : 'loading="lazy"'
    } decoding="async"></picture>`;
  }
  return `<div class="photo photo--placeholder ${cls}" role="img" aria-label="${p.alt}"><span>Photo to supply · ${key}</span></div>`;
}

