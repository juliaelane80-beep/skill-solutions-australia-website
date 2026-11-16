import { brand, industries, availabilityNote, enquiryOptions, enquiryHref } from './content.mjs';
import { btn, photo } from './helpers.mjs';

const hero = ({ mod, media, eyebrow, title, lead, tag, actions = '' }) => `
<section class="hero hero--${mod}">
  <div class="hero__media">${photo(media, { cls: 'photo--cover', priority: true })}</div>
  <div class="hero__inner wrap">
    <p class="eyebrow eyebrow--light">${eyebrow}</p>
    <h1 class="hero__title">${title}</h1>
    <p class="hero__lead">${lead}</p>
    ${tag ? `<p class="hero__tag">${tag}</p>` : ''}
    ${actions}
  </div>
</section>`;

const band = (title, actionHtml) => `
<section class="band">
  <div class="band__inner wrap">
    <h2 class="band__title">${title}</h2>
    ${actionHtml}
  </div>
</section>`;

const industryList = ({ details = true } = {}) => `
<ul class="industries">
${industries
  .map(
    (i) =>
      `  <li class="industries__item"><span class="industries__name">${i.name}</span>${
        details && i.detail ? `<span class="industries__detail">${i.detail}</span>` : ''
      }</li>`,
  )
  .join('\n')}
</ul>`;

const strip = (keys, labels) => `
<ul class="strip">
${keys
  .map(
    (k, i) =>
      `  <li class="strip__item">${photo(k, { cls: 'photo--cover' })}<span class="strip__label">${labels[i]}</span></li>`,
  )
  .join('\n')}
</ul>`;

const price = (amount, prefix = '') =>
  `<p class="price">${prefix ? `<span class="price__prefix">${prefix}</span> ` : ''}${amount} <small>+ GST</small></p>`;

const ticks = (items) => `<ul class="ticks">${items.map((t) => `<li>${t}</li>`).join('')}</ul>`;

// ---------------------------------------------------------------- Home
const home = {
  file: 'index.html',
  path: '/',
  title: 'Skills Solutions Australia | Build your career. Find the right talent.',
  description:
    'Internships, career coaching and application support for graduates and job seekers, and recruitment and labour hire for employers, across Australia.',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.name,
    url: brand.url,
    logo: `${brand.url}/assets/images/logo.png`,
    email: brand.email,
    telephone: brand.phone,
    areaServed: 'Australia',
    address: { '@type': 'PostalAddress', addressLocality: 'Hobart', addressRegion: 'TAS', addressCountry: 'AU' },
  },
  body: `
${hero({
  mod: 'home',
  media: 'home-hero',
  eyebrow: 'The next chapter',
  title: 'Build your career.<br>Find the right talent.',
  lead: 'Skills Solutions Australia supports graduates and job seekers with internships, career coaching and application support, and helps employers with recruitment and labour hire across Australia.',
  tag: 'Australia-wide',
})}

<section class="pathways wrap" aria-label="Choose your pathway">
  ${btn('For Job Seekers', 'job-seekers.html', 'solid')}
  ${btn('For Employers', 'employers.html', 'outline')}
</section>

<section class="split">
  <div class="split__media">${photo('home-seekers', { cls: 'photo--cover' })}</div>
  <div class="split__body">
    <p class="eyebrow">For job seekers</p>
    <h2 class="display">Practical experience. Personal coaching.</h2>
    <p>Internship placements, one-to-one career coaching and help with applications, interviews and presentations. We work with international graduates, local graduates and career changers.</p>
    ${btn('Explore Job Seeker Services', 'job-seekers.html', 'solid')}
  </div>
</section>

<section class="split split--reverse">
  <div class="split__media">${photo('home-employers', { cls: 'photo--cover' })}</div>
  <div class="split__body">
    <p class="eyebrow">For employers</p>
    <h2 class="display">The right people. Support that works.</h2>
    <p>Host an intern, have us source and screen candidates, or engage workers through labour hire for temporary, project or ongoing needs.</p>
    ${btn('Explore Employer Services', 'employers.html', 'outline')}
  </div>
</section>

<section class="section wrap" id="industries">
  <div class="section__head">
    <p class="eyebrow">Industries</p>
    <h2 class="display">Across industries. Across Australia.</h2>
    <p class="lead">We connect employers with capable candidates and provide workforce support across a wide range of industries.</p>
  </div>
  ${strip(
    ['industry-health', 'industry-education', 'industry-construction', 'industry-engineering'],
    ['Healthcare', 'Education', 'Construction', 'Engineering'],
  )}
  ${industryList()}
  <p class="note">${availabilityNote}</p>
</section>

<section class="split split--reverse split--portrait">
  <div class="split__media split__media--portrait">${photo('julia-lane', { cls: 'photo--cover photo--top' })}</div>
  <div class="split__body">
    <p class="eyebrow">Meet Julia</p>
    <h2 class="display">Julia Lane, Director</h2>
    <p>Julia has worked in the education and ICT sectors for over a decade. She previously led the Professional Year Program across multiple states as State Operations Manager at the Australian College of Applied Professions.</p>
    ${btn('About Skills Solutions Australia', 'about.html', 'outline')}
  </div>
</section>

${band('Let’s talk about your next step.', btn('Book a Call', brand.bookingUrl, 'lime'))}
`,
};

// ---------------------------------------------------------------- Job seekers
const jobSeekers = {
  file: 'job-seekers.html',
  path: '/job-seekers',
  title: 'For Job Seekers',
  description:
    'Internship placement, career coaching, individual career services, graduate program application support and pharmacist career support across Australia.',
  body: `
${hero({
  mod: 'sub',
  media: 'seekers-hero',
  eyebrow: 'The next chapter',
  title: 'Your next career chapter.',
  lead: 'Practical experience. Personal coaching. Stronger applications.',
  tag: 'Australia-wide support',
})}

<section class="intro wrap">
  <p class="lead">Whether you are an international graduate looking for your first Australian role, a local graduate, or changing direction, we shape the support around you.</p>
</section>

<section class="split" id="internship">
  <div class="split__media">${photo('seekers-internship', { cls: 'photo--cover' })}</div>
  <div class="split__body">
    <h2 class="display">I need Australian work experience.</h2>
    <p class="eyebrow">Internship placement &amp; coaching</p>
    <p>A 12-week internship, three days per week, with resume, LinkedIn and interview coaching, including three one-hour coaching sessions.</p>
    ${price('$2,200')}
    <p class="fine">${availabilityNote}</p>
    ${btn('Enquire About an Internship', enquiryHref('internship-placement'), 'solid')}
  </div>
</section>

<section class="duo" id="coaching">
  <div class="duo__a">
    <h2 class="display">I’m applying but not getting results.</h2>
    <p class="eyebrow">Job search &amp; career coaching</p>
    <p>Personal support to get your applications working.</p>
    ${ticks([
      'Resume and ATS support',
      'LinkedIn',
      'Job search strategy',
      'Tailored applications',
      'Interview preparation',
      'Personalised support',
    ])}
    ${price('$2,000')}
    ${btn('Book a Consultation', enquiryHref('job-search-coaching'), 'outline')}
  </div>
  <div class="duo__b" id="individual">
    <h2 class="display display--light">I need help with this application or interview.</h2>
    <p class="eyebrow eyebrow--light">Individual career services</p>
    <p>Targeted help with resumes, applications and interviews, when you need it.</p>
    ${price('$150', 'From')}
    <ul class="chips">
      <li id="video-applications">Video applications</li>
      <li id="interview-presentations">Interview presentations</li>
      <li id="ai-interview-preparation">AI interview preparation</li>
    </ul>
    ${btn('Get Career Support', enquiryHref('individual-career-services'), 'light')}
  </div>
</section>

<section class="split split--reverse" id="graduate-programs">
  <div class="split__media">${photo('seekers-graduate', { cls: 'photo--cover' })}</div>
  <div class="split__body">
    <h2 class="display">Graduate Program Application Support</h2>
    <p class="eyebrow">Step by step, through the process</p>
    <p>Support with written applications, video responses, interviews and presentations.</p>
    ${price('$2,000')}
    ${btn('Discuss Graduate Program Support', enquiryHref('graduate-program-support'), 'outline')}
  </div>
</section>

<section class="split" id="pharmacists">
  <div class="split__media">${photo('seekers-pharmacist', { cls: 'photo--cover' })}</div>
  <div class="split__body">
    <h2 class="display">Career Support for Pharmacists</h2>
    <p class="eyebrow">Individually quoted</p>
    <p>Personalised help with your resume, applications, interviews and Australian workplace expectations.</p>
    <p>Pricing is individual because of the additional support involved.</p>
    ${btn('Discuss Pharmacist Support', enquiryHref('pharmacist-support'), 'outline')}
  </div>
</section>

${band('Let’s discuss your next step.', btn('Book a Call', brand.bookingUrl, 'lime'))}
`,
};

// ---------------------------------------------------------------- Employers
const employers = {
  file: 'employers.html',
  path: '/employers',
  title: 'For Employers',
  description:
    'Host an intern, recruit suitable candidates or engage workers through labour hire. Employer services across Australia.',
  body: `
${hero({
  mod: 'sub',
  media: 'employers-hero',
  eyebrow: 'For employers',
  title: 'The right people. Support that works.',
  lead: 'Internships, recruitment and labour hire for employers across Australia.',
  tag: 'Australia-wide',
})}

<section class="split" id="host-an-intern">
  <div class="split__media">${photo('employers-host', { cls: 'photo--cover' })}</div>
  <div class="split__body">
    <p class="eyebrow">Internship hosting</p>
    <h2 class="display">Host an intern. Help potential grow.</h2>
    <p>Give emerging talent practical experience through a structured placement, with preparation and ongoing support from SSA.</p>
    <p>Discuss suitable tasks, supervision and placement arrangements with us.</p>
    ${btn('Host an Intern', enquiryHref('host-intern'), 'solid')}
  </div>
</section>

<section class="duo" id="recruitment">
  <div class="duo__a">
    <p class="eyebrow">Recruitment</p>
    <h2 class="display">Find the right fit for your team.</h2>
    <p>Tell us about your vacancy. We source, screen and coordinate suitable candidates around your role and workplace needs.</p>
    <p class="strong">Quoted to suit your requirements.</p>
    ${btn('Discuss Recruitment', enquiryHref('recruitment'), 'outline')}
  </div>
  <div class="duo__b" id="labour-hire">
    <p class="eyebrow eyebrow--light">Labour hire</p>
    <h2 class="display display--light">Extra support. Flexible staffing.</h2>
    <p>Engage workers for temporary, project or ongoing needs. SSA employs and pays the workers; your business pays SSA for their services.</p>
    <p class="strong strong--light">Request a tailored quote.</p>
    ${btn('Request Labour Hire', enquiryHref('labour-hire'), 'light')}
  </div>
</section>

<section class="section wrap" id="industries">
  <div class="section__head">
    <p class="eyebrow">Industries</p>
    <h2 class="display">Across industries. Across Australia.</h2>
    <p class="lead">We connect employers with capable candidates and provide workforce support across a wide range of industries.</p>
  </div>
  ${industryList()}
  ${strip(
    ['industry-it', 'industry-care', 'industry-finance', 'industry-business'],
    ['IT and digital', 'Community services', 'Accounting and finance', 'Project support'],
  )}
  <p class="note">${availabilityNote}</p>
</section>

<section class="split split--reverse split--cta">
  <div class="split__media">${photo('employers-cta', { cls: 'photo--cover' })}</div>
  <div class="split__body">
    <h2 class="display">Tell us what you need.</h2>
    <p>Your role, locations, skills and timeframe.</p>
    ${btn('Book a Call', brand.bookingUrl, 'outline')}
  </div>
</section>
`,
};

// ---------------------------------------------------------------- About
const about = {
  file: 'about.html',
  path: '/about',
  title: 'About',
  description:
    'Skills Solutions Australia helps graduates and job seekers build careers, and helps employers find the right people, across Australia.',
  body: `
<section class="page-head wrap">
  <p class="eyebrow">About</p>
  <h1 class="display display--xl">Careers and workforces, built carefully.</h1>
  <p class="lead">Skills Solutions Australia supports graduates and job seekers with internships, career coaching and application support, and helps employers with recruitment and labour hire. We are based in Hobart and work Australia-wide.</p>
</section>

<section class="split split--reverse split--portrait" id="julia">
  <div class="split__media split__media--portrait">${photo('julia-lane', { cls: 'photo--cover photo--top' })}</div>
  <div class="split__body">
    <p class="eyebrow">Director</p>
    <h2 class="display">Julia Lane</h2>
    <p>With a decade of experience in the education and ICT sectors, Julia is passionate about empowering the next generation of professionals and connecting them with meaningful career opportunities.</p>
    <p>She previously served as State Operations Manager at the Australian College of Applied Professions, leading the Professional Year Program and managing operations across multiple states, so that each graduate had a clear career development path.</p>
    <p>Her expertise lies in designing programs that address the gap between recent graduates and industry needs, combining tailored support with practical internships. She has a track record in recruitment and talent management, including using LinkedIn to attract and engage talent.</p>
    <p>Julia’s leadership style is respectful, inclusive and dedicated to the growth of the people she works with. Her mission is to improve workforce readiness and create pathways for talented people to thrive in their chosen careers.</p>
  </div>
</section>

<section class="section wrap">
  <div class="section__head">
    <p class="eyebrow">Recognition</p>
    <h2 class="display">Awards</h2>
  </div>
  <ul class="ticks ticks--wide">
    <li>Winner, TAS ICT Awards 2022 – Development of ICT Employment Opportunities</li>
    <li>Winner, Study TAS Industry Partner of the Year 2022 and 2023</li>
  </ul>
</section>

${band('Let’s talk.', btn('Book a Call', brand.bookingUrl, 'lime'))}
`,
};

// ---------------------------------------------------------------- Contact
const optionGroups = ['Job seekers', 'Employers', 'General']
  .map(
    (g) =>
      `<optgroup label="${g}">${enquiryOptions
        .filter((o) => o.group === g)
        .map((o) => `<option value="${o.value}">${o.label}</option>`)
        .join('')}</optgroup>`,
  )
  .join('');

const contact = {
  file: 'contact.html',
  path: '/contact',
  title: 'Contact',
  description:
    'Contact Skills Solutions Australia. Book a call, or send an enquiry about job seeker or employer services.',
  body: `
<section class="page-head wrap">
  <p class="eyebrow">Contact</p>
  <h1 class="display display--xl">Let’s talk.</h1>
  <p class="lead">Tell us what you need and we will come back to you. Prefer to talk it through? Book a call.</p>
  <div class="page-head__actions">${btn('Book a Call', brand.bookingUrl, 'solid')}</div>
</section>

<section class="wrap routes" aria-label="Contact routes">
  <div class="routes__item">
    <h2 class="routes__h">Job seekers</h2>
    <p>Internships, coaching, applications, graduate programs and pharmacist support.</p>
    <a class="textlink" href="job-seekers.html">See job seeker services</a>
  </div>
  <div class="routes__item">
    <h2 class="routes__h">Employers</h2>
    <p>Internship hosting, recruitment and labour hire.</p>
    <a class="textlink" href="employers.html">See employer services</a>
  </div>
  <div class="routes__item">
    <h2 class="routes__h">Direct</h2>
    <p><a href="${brand.phoneHref}">${brand.phone}</a><br><a href="mailto:${brand.email}">${brand.email}</a></p>
    <p class="fine">${brand.locationLine}</p>
  </div>
</section>

<section class="section wrap enquiry" id="enquiry">
  <div class="section__head">
    <h2 class="display">Send an enquiry</h2>
  </div>
  <form id="enquiry-form" class="form" action="/api/enquiry" method="post" novalidate>
    <div class="form__row">
      <div class="field">
        <label for="f-service">What is your enquiry about?</label>
        <select id="f-service" name="service" required>
          <option value="">Choose a service</option>
          ${optionGroups}
        </select>
        <p class="field__error" id="e-service" hidden></p>
      </div>
    </div>
    <div class="form__row form__row--2">
      <div class="field">
        <label for="f-name">Full name</label>
        <input id="f-name" name="name" type="text" autocomplete="name" maxlength="100" required>
        <p class="field__error" id="e-name" hidden></p>
      </div>
      <div class="field">
        <label for="f-email">Email</label>
        <input id="f-email" name="email" type="email" autocomplete="email" maxlength="200" required>
        <p class="field__error" id="e-email" hidden></p>
      </div>
    </div>
    <div class="form__row form__row--2">
      <div class="field">
        <label for="f-phone">Phone <span class="optional">(optional)</span></label>
        <input id="f-phone" name="phone" type="tel" autocomplete="tel" maxlength="30">
        <p class="field__error" id="e-phone" hidden></p>
      </div>
      <div class="field">
        <label for="f-org">Organisation <span class="optional">(optional)</span></label>
        <input id="f-org" name="organisation" type="text" autocomplete="organization" maxlength="150">
      </div>
    </div>
    <div class="form__row">
      <div class="field">
        <label for="f-message">Message</label>
        <textarea id="f-message" name="message" rows="6" maxlength="2000" required></textarea>
        <p class="field__error" id="e-message" hidden></p>
      </div>
    </div>
    <div class="hp" aria-hidden="true">
      <label for="f-website">Leave this field empty</label>
      <input id="f-website" name="website" type="text" tabindex="-1" autocomplete="off">
    </div>
    <p class="fine">We use these details only to respond to your enquiry.</p>
    <div class="form__actions">
      <button class="btn btn--solid" type="submit" id="f-submit"><span class="btn__text">Send enquiry</span></button>
    </div>
    <div id="form-status" class="form__status" role="status" aria-live="polite" tabindex="-1"></div>
    <noscript><p class="form__status form__status--error">This form needs JavaScript. Please email <a href="mailto:${brand.email}">${brand.email}</a> or call ${brand.phone}.</p></noscript>
  </form>
</section>
`,
};

// ---------------------------------------------------------------- 404
const notFound = {
  file: '404.html',
  path: '/404',
  title: 'Page not found',
  description: 'The page you were looking for could not be found.',
  noindex: true,
  body: `
<section class="page-head wrap">
  <p class="eyebrow">404</p>
  <h1 class="display display--xl">That page has moved on.</h1>
  <p class="lead">Try one of the main pages instead.</p>
  <div class="page-head__actions">
    ${btn('For Job Seekers', 'job-seekers.html', 'solid')}
    ${btn('For Employers', 'employers.html', 'outline')}
  </div>
</section>
`,
};

export const pages = [home, jobSeekers, employers, about, contact, notFound];
