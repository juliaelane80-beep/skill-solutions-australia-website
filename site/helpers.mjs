import { industryCards } from './content.mjs';

/** Standard arrow used on buttons. */
export const arrow = '<span aria-hidden="true">&rarr;</span>';

/** Button-styled link. `cls` adds modifier classes, e.g. 'ssa-outline'. */
export const btn = (label, href, cls = '', attrs = '') =>
  `<a class="ssa-button${cls ? ' ' + cls : ''}" href="${href}"${attrs ? ' ' + attrs : ''}>${label} ${arrow}</a>`;

/** The seven industry cards used on Job Seekers and Employers. */
export const industryList = () =>
  `<ul class="ssa-jobs-industries">
${industryCards
  .map(
    (c) =>
      `      <li><img src="assets/images/industries/${c.id}.jpg" alt="" width="900" height="600" loading="lazy">
        <h3>${c.title.replace(/&/g, '&amp;')}</h3></li>`,
  )
  .join('\n')}
    </ul>`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

/**
 * Testimonial block with floating cards. With several entries, manual previous/next controls are added
 * by assets/js/ssa.js; without JavaScript every card is shown in order.
 */
export function testimonials({ id, title, items }) {
  const many = items.length > 1;
  const slides = items
    .map((t, i) => {
      const last = t.paras.length - 1;
      const paras = t.paras
        .map((p, n) => `<p>${n === 0 ? '“' : ''}${esc(p)}${n === last ? '”' : ''}</p>`)
        .join('');
      return `<li class="ssa-t-slide"${many ? ` data-index="${i}"` : ''}>
          <figure>
            <blockquote>${paras}</blockquote>
            <figcaption><strong>${esc(t.name)}</strong><span>${esc(t.role)}</span>${t.note ? `<span class="ssa-t-note">${esc(t.note)}</span>` : ''}</figcaption>
          </figure>
        </li>`;
    })
    .join('\n        ');
  const controls = many
    ? `
      <div class="ssa-t-controls" hidden>
        <button class="ssa-t-btn" type="button" data-dir="-1" aria-label="Previous testimonial"><span aria-hidden="true">&larr;</span></button>
        <p class="ssa-t-count" role="status" aria-live="polite"><span data-current>1</span> of ${items.length}</p>
        <button class="ssa-t-btn" type="button" data-dir="1" aria-label="Next testimonial"><span aria-hidden="true">&rarr;</span></button>
      </div>`
    : '';
  return `<section class="ssa-testimonials" aria-labelledby="${id}"${many ? ' data-testimonials' : ''}>
    <div class="ssa-jobs-wrap">
      <h2 id="${id}">${title}</h2>
      <div class="ssa-t-stage">
        <ol class="ssa-t-list">
        ${slides}
        </ol>${controls}
      </div>
    </div>
  </section>`;
}
