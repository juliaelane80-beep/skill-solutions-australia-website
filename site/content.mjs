// Single source of truth for brand details, services, industries and photo slots.
// Edit here, then run `node site/build.mjs` to regenerate public/*.html.

export const brand = {
  name: 'Skills Solutions Australia',
  short: 'SSA',
  url: 'https://skillssolutionsaustralia.com',
  abn: '63 680 331 140',
  phone: '0414 670 863',
  phoneHref: 'tel:0414670863',
  email: 'Julia.lane@skillssolutionsaustralia.com.au',
  // Taken from the existing booking page / HubSpot flow. Confirm still current before launch.
  bookingUrl: 'https://calendly.com/julia-lane-skillssolutionsaustralia/30min',
  locationLine: 'Hobart, supporting Australia-wide.',
  linkedin: 'https://www.linkedin.com/company/skills-solutions-australia/',
};

export const nav = [
  { label: 'For Job Seekers', href: 'job-seekers.html' },
  { label: 'For Employers', href: 'employers.html' },
  { label: 'About', href: 'about.html' },
  { label: 'Contact', href: 'contact.html' },
];

/** Enquiry options. `value` is used in ?service= links and sent to the API. */
export const enquiryOptions = [
  { group: 'Job seekers', value: 'internship-placement', label: 'Internship Placement & Coaching' },
  { group: 'Job seekers', value: 'job-search-coaching', label: 'Job Search & Career Coaching' },
  { group: 'Job seekers', value: 'individual-career-services', label: 'Individual Career Services' },
  { group: 'Job seekers', value: 'graduate-program-support', label: 'Graduate Program Application Support' },
  { group: 'Job seekers', value: 'pharmacist-support', label: 'Career Support for Pharmacists' },
  { group: 'Employers', value: 'host-intern', label: 'Host an Intern' },
  { group: 'Employers', value: 'recruitment', label: 'Recruitment' },
  { group: 'Employers', value: 'labour-hire', label: 'Labour Hire' },
  { group: 'General', value: 'general', label: 'Something else' },
];

export const enquiryHref = (value) => `contact.html?service=${value}#enquiry`;

/** Industries, in the required order. */
export const industries = [
  { name: 'Healthcare, allied health and pharmacy' },
  { name: 'Education and community services' },
  {
    name: 'IT and digital',
    detail:
      'Software development, IT support and service desk, networking, cloud infrastructure, cybersecurity, data analytics, business analysis, testing and QA, systems administration, automation.',
  },
  {
    name: 'Engineering',
    detail:
      'Civil and structural, mechanical, electrical and electronics, environmental, chemical and process, industrial and manufacturing, mechatronics and automation, engineering project management.',
  },
  {
    name: 'Construction and the built environment',
    detail: 'Construction management, estimating, quantity surveying, project coordination.',
  },
  { name: 'Accounting and finance' },
  { name: 'Business, administration and project support' },
  { name: 'Marketing and communications' },
];

export const availabilityNote =
  'Availability depends on the field, role, location and suitable opportunities.';

/**
 * Photo slots. If public/assets/images/photos/<key>.jpg exists it is used
 * (optional <key>-mobile.jpg for a tighter mobile crop); otherwise a labelled
 * placeholder is rendered so layouts can be reviewed before photography lands.
 * Generated or stock people must never be presented as SSA clients or staff.
 */
export const photos = {
  'home-hero': {
    ratio: '16:9 (min 2400px wide); mobile 4:5',
    alt: 'Colleagues of different ages and backgrounds reviewing plans together at a workbench',
    brief:
      'Candid, mid-task. An engineer in hi-vis and an older woman team leader reviewing plans with a younger colleague in a workshop or site office. Natural light. Nobody looking at camera. Keep the left 45% calm for headline text.',
  },
  'home-seekers': {
    ratio: '4:3; mobile 4:3',
    alt: 'A graduate learning a task from a supervisor in an IT support workspace',
    brief: 'Young international graduate at a hardware bench or service desk, supervisor pointing out a fix. Candid, working.',
  },
  'home-employers': {
    ratio: '4:3; mobile 4:3',
    alt: 'A community care team leader talking with a support worker',
    brief: 'Community or aged-care setting. Team leader (mid-50s) and support worker discussing a roster. Appropriate uniforms.',
  },
  'industry-health': {
    ratio: '3:4; mobile 1:1',
    alt: 'A nurse and a doctor reviewing a patient chart on a hospital ward',
    brief: 'Clinical setting, candid. Mixed ages and backgrounds. Real scrubs and ID.',
  },
  'industry-education': {
    ratio: '3:4; mobile 1:1',
    alt: 'A teacher helping a student at a classroom desk',
    brief: 'Teacher crouched beside a primary or secondary student, mid-explanation. Natural classroom light.',
  },
  'industry-construction': {
    ratio: '3:4; mobile 1:1',
    alt: 'A construction supervisor and apprentice inspecting formwork on site',
    brief: 'Credible site: hi-vis, hard hats, boots, safety glasses. Diverse crew. Work in progress, not posed.',
  },
  'industry-engineering': {
    ratio: '3:4; mobile 1:1',
    alt: 'An engineer measuring a component in a workshop',
    brief: 'Mechanical or electrical workshop, safety glasses, calipers or a test rig. Woman engineer preferred.',
  },
  'industry-it': {
    ratio: '3:4; mobile 1:1',
    alt: 'A network engineer working beside a rack of equipment',
    brief: 'Comms room or data centre, laptop on a rack shelf, cabling. Not a generic office meeting.',
  },
  'industry-care': {
    ratio: '3:4; mobile 1:1',
    alt: 'A support worker assisting a client in a community setting',
    brief: 'Respectful, candid care moment. Avoid faces that identify real clients; use models with consent.',
  },
  'industry-finance': {
    ratio: '3:4; mobile 1:1',
    alt: 'An accountant reviewing figures with a colleague',
    brief: 'Two colleagues over a printed report and a screen. Natural office light, mixed ages and backgrounds.',
  },
  'industry-business': {
    ratio: '3:4; mobile 1:1',
    alt: 'A project coordinator updating a schedule on a wall planner',
    brief: 'Project coordinator at a physical planner or whiteboard, mid-task. Not a staged meeting.',
  },
  'seekers-hero': {
    ratio: '16:9 (min 2400px wide); mobile 4:5',
    alt: 'A young woman pausing thoughtfully at her laptop in a bright workspace',
    brief: 'Candid, thinking rather than smiling at camera. Subject on the right third; left calm for text.',
  },
  'seekers-internship': {
    ratio: '4:5; mobile 4:3',
    alt: 'A graduate in hi-vis talking with a supervisor at a site office',
    brief: 'Graduate in workwear (not just office) learning from a supervisor. Candid, engaged.',
  },
  'seekers-graduate': {
    ratio: '4:3; mobile 4:3',
    alt: 'A graduate rehearsing a video application at a desk',
    brief: 'Young man or woman rehearsing to a laptop camera, notes beside them. Candid.',
  },
  'seekers-pharmacist': {
    ratio: '4:5; mobile 4:3',
    alt: 'A pharmacist checking stock on a tablet in a dispensary',
    brief: 'Pharmacist in a real dispensary, white coat and name badge, using a tablet. Candid.',
  },
  'employers-hero': {
    ratio: '16:9 (min 2400px wide); mobile 4:5',
    alt: 'A manager and two colleagues talking through a plan on site',
    brief: 'Older man of colour as the manager, with a woman and a younger colleague. Mixed hi-vis and office wear. Candid.',
  },
  'employers-host': {
    ratio: '4:5; mobile 4:3',
    alt: 'A supervisor showing an intern how to use workshop equipment',
    brief: 'Intern and supervisor at a workshop machine. PPE worn correctly. Candid, working.',
  },
  'employers-cta': {
    ratio: '16:9; mobile 4:3',
    alt: 'Two colleagues going over a printed spreadsheet in an office',
    brief: 'Business or finance office. Two people mid-conversation over a document. Not looking at camera.',
  },
  'julia-lane': {
    ratio: '1:1 (cropped from supplied photo)',
    alt: 'Julia Lane, Director of Skills Solutions Australia',
    brief: 'Existing genuine photograph supplied by SSA.',
    file: 'assets/images/julia-lane.jpg',
    width: 1000,
    height: 1000,
  },
};
