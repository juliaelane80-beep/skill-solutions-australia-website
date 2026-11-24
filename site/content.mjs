// Single source of truth for brand details, navigation and enquiry topics.
// Edit here, then run `node site/build.mjs` to regenerate public/*.html.

export const brand = {
  name: 'Skills Solutions Australia',
  url: 'https://skillssolutionsaustralia.com',
  abn: '63 680 331 140',
  phone: '0414 670 863',
  phoneHref: 'tel:+61414670863',
  email: 'julia.lane@skillssolutionsaustralia.com.au',
  // Julia's supplied LinkedIn URL (contact handoff).
  linkedin: 'https://www.linkedin.com/in/julialane80/',
};

/** Shared six-link header, in the approved order. `key` matches the page file name. */
export const nav = [
  { key: 'index', label: 'Home', href: 'index.html' },
  { key: 'job-seekers', label: 'Job Seekers', href: 'job-seekers.html' },
  { key: 'employers', label: 'Employers', href: 'employers.html' },
  { key: 'industries', label: 'Industries', href: 'industries.html' },
  { key: 'about', label: 'About Us', href: 'about.html' },
  { key: 'contact', label: 'Contact', href: 'contact.html' },
];

/** Topics in the Contact form. `value` is used in ?service= links and sent to /api/enquiry. */
export const enquiryOptions = [
  { value: 'career-support', label: 'Career Support' },
  { value: 'job-search-coaching', label: 'Job Search & Career Coaching' },
  { value: 'individual-coaching', label: 'Individual Career Coaching' },
  { value: 'internship-coaching', label: 'Internship Placement & Coaching' },
  { value: 'employer', label: 'Workforce Needs' },
  { value: 'recruitment', label: 'Recruitment & Talent Sourcing' },
  { value: 'internship-hosting', label: 'Internship Hosting' },
  { value: 'labour-hire', label: 'Contract & Labour Hire' },
  { value: 'other', label: 'Other Enquiry' },
];

/** Link to the Contact form, optionally preselecting a topic. */
export const enquiryHref = (value) => (value ? `contact.html?service=${value}#enquiry` : 'contact.html#enquiry');

/** The seven industry cards, in the approved order. Images live in public/assets/images/industries/<id>.jpg. */
export const industryCards = [
  { id: 'it-digital', title: 'IT & Digital' },
  { id: 'engineering', title: 'Engineering' },
  { id: 'healthcare', title: 'Healthcare' },
  { id: 'accounting', title: 'Accounting & Finance' },
  { id: 'business', title: 'Business Administration & Project Support' },
  { id: 'marketing', title: 'Marketing & Communications' },
  { id: 'ai', title: 'AI Transformation & Implementation' },
];

/**
 * Images Julia has offered to supply. Until the finals arrive, the build uses the generated
 * placeholders named in `placeholder`. Replace the file and keep the slot's CSS in sync.
 */
export const imageSlots = [
  { slot: 'Home hero', final: 'sydney-harbour-office.webp', placeholder: 'photos/home-hero.jpg', css: '.ssa-hero' },
  { slot: 'Job Seekers hero', final: 'job-seekers-office.webp', placeholder: 'photos/seekers-hero.jpg', css: '.ssa-jobs-hero' },
  { slot: 'Employers hero', final: 'employers-office.webp', placeholder: 'photos/employers-hero.jpg', css: '.ssa-employers .ssa-jobs-hero' },
  { slot: 'Industries hero', final: 'industries-team.webp', placeholder: 'photos/home-hero.jpg (reused)', css: '.ssa-industries .ssa-jobs-hero' },
  { slot: 'About hero', final: 'about-office.webp', placeholder: 'photos/employers-cta.jpg', css: '.ssa-about-hero' },
  { slot: 'Contact hero', final: 'contact-hobart-waterfront.webp', placeholder: 'photos/home-employers.jpg', css: '.ssa-contact-hero' },
  ...[
    ['it-digital', 'industry-it'],
    ['engineering', 'industry-engineering'],
    ['healthcare', 'industry-health'],
    ['accounting', 'industry-finance'],
    ['business', 'industry-business'],
    ['marketing', 'seekers-graduate (stand-in)'],
    ['ai', 'home-seekers (stand-in)'],
  ].map(([id, from]) => ({
    slot: `Industry card: ${id}`,
    final: `industries/${id}.webp`,
    placeholder: `industries/${id}.jpg (cropped from photos/${from}.jpg)`,
    css: 'images/industries/' + id + '.jpg',
  })),
  { slot: 'Founder portrait', final: 'julia-lane-founder.webp', placeholder: 'images/julia-lane-founder.jpg (final portrait, in use)', css: 'about.html' },
];
