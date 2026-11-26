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
  { slot: 'Home hero', final: 'sydney-harbour-office', placeholder: 'photos/sydney-harbour-office.jpg (final)', css: '.ssa-hero' },
  { slot: 'Job Seekers hero', final: 'job-seekers-office', placeholder: 'photos/job-seekers-office.jpg (final)', css: '.ssa-jobs-hero' },
  { slot: 'Employers hero', final: 'employers-office', placeholder: 'photos/employers-office.jpg (final)', css: '.ssa-employers .ssa-jobs-hero' },
  { slot: 'Industries hero', final: 'industries-team', placeholder: 'photos/industries-team.jpg (final)', css: '.ssa-industries .ssa-jobs-hero' },
  { slot: 'About hero', final: 'about-office', placeholder: 'photos/about-office.jpg (final)', css: '.ssa-about-hero' },
  { slot: 'Contact hero', final: 'contact-hobart-waterfront', placeholder: 'photos/contact-hobart-waterfront.jpg (final)', css: '.ssa-contact-hero' },
  ...['it-digital', 'engineering', 'healthcare', 'accounting', 'business', 'marketing', 'ai'].map((id) => ({
    slot: `Industry card: ${id}`,
    final: `industries/${id}`,
    placeholder: `industries/${id}.jpg (final, 396px wide source)`,
    css: 'public/assets/js/industries.js',
  })),
  { slot: 'Founder portrait', final: 'julia-lane-founder', placeholder: 'images/julia-lane-founder.jpg (final)', css: 'about.html' },
];
