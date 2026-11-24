// Page definitions. Layout and copy follow Julia's final developer handoffs (Home, Job Seekers,
// Employers, Industries, About Us, Contact, Testimonials). Links use relative .html paths so the
// pages also work from a plain file server; staticwebapp.config.json maps the clean URLs.
import { brand, enquiryOptions, enquiryHref } from './content.mjs';
import { btn, industryList, testimonials } from './helpers.mjs';
import { jobSeekerFaqs } from './faqs.mjs';
import { homeTestimonial, seekerTestimonials, partnerTestimonials } from './testimonials.mjs';

const heroIntro = (text) => `<p class="ssa-jobs-intro">${text}</p>`;

const home = {
  file: 'index.html',
  path: '/',
  key: 'index',
  title: 'Skills Solutions Australia | Build your career. Find the right talent.',
  description:
    'Personalised career coaching, job application support and internships for job seekers, plus recruitment and labour hire for employers. Australia-wide.',
  cta: enquiryHref(),
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.name,
    url: brand.url,
    email: brand.email,
    telephone: '+61414670863',
    sameAs: [brand.linkedin],
  },
  body: `  <div class="ssa-home">
  <section class="ssa-hero" aria-labelledby="ssa-title">
    <div class="ssa-hero-inner">
      <h1 id="ssa-title">
        <span>Build your career.</span>
        <span>Find the right talent.</span>
      </h1>
      <p>Move your career forward with personalised coaching, support with job applications and hands-on internships. Find the right people for your team with recruitment and labour hire support.</p>
      <p class="ssa-location">Australia-wide</p>
    </div>
  </section>

  <nav class="ssa-pathways" aria-label="Choose your pathway">
    ${btn('For Job Seekers', 'job-seekers.html')}
    ${btn('For Employers', 'employers.html', 'ssa-outline')}
  </nav>

  ${testimonials({ id: 'home-testimonial-title', title: 'Success Stories', items: [homeTestimonial] })}
  </div>`,
};

const jobSeekers = {
  file: 'job-seekers.html',
  path: '/job-seekers',
  key: 'job-seekers',
  title: 'For Job Seekers',
  description:
    'Personalised coaching, practical job-search support and industry connections for graduates, experienced professionals and career changers.',
  cta: enquiryHref('career-support'),
  body: `  <div class="ssa-jobs">
  <section class="ssa-jobs-hero" aria-labelledby="jobs-title">
    <div class="ssa-jobs-wrap">
      <p class="ssa-jobs-eyebrow">For Job Seekers</p>
      <h1 id="jobs-title">Your next career chapter starts here.</h1>
      ${heroIntro('Whether you’re a recent graduate, an experienced professional or ready for a career change, Skills Solutions Australia provides personalised coaching, practical job-search support and industry connections to help you take your next step.')}
      <div class="ssa-jobs-actions">
        ${btn('Explore Career Services', '#career-services', 'ssa-jobs-explore')}
        ${btn('Enquire Now', enquiryHref('career-support'), 'ssa-jobs-outline')}
      </div>
    </div>
  </section>

  <section class="ssa-jobs-wrap ssa-jobs-section" aria-labelledby="jobs-industries-title">
    <h2 id="jobs-industries-title">Industries We Support</h2>
    <p>Supporting graduates and professionals across a range of industries to build their careers and access new opportunities.</p>
    ${industryList()}
  </section>

  <section class="ssa-jobs-benefits" aria-labelledby="jobs-benefits-title">
    <div class="ssa-jobs-wrap ssa-jobs-benefits-inner">
      <h2 id="jobs-benefits-title">Why Skills Solutions Australia?</h2>
      <ul>
        <li><h3>Personalised Support</h3>
          <p>Tailored guidance to help you achieve your career goals.</p></li>
        <li><h3>Industry Experience</h3>
          <p>Real-world insight and knowledge of what employers need.</p></li>
        <li><h3>Professional Connections</h3>
          <p>Access to our extensive industry and employer networks.</p></li>
        <li><h3>Practical Outcomes</h3>
          <p>Build your skills, confidence and job opportunities faster.</p></li>
      </ul>
    </div>
  </section>

  <section class="ssa-jobs-wrap ssa-jobs-section" id="career-services" aria-labelledby="jobs-services-title">
    <h2 id="jobs-services-title">Career Coaching &amp; Job Search Services</h2>
    <p>Practical, personalised support to help you stand out, find opportunities and secure the right role.</p>
    <div class="ssa-jobs-services">
      <article>
        <h3>Job Search &amp; Career Coaching Program</h3>
        <p>A comprehensive, personalised program to build your job-search strategy, enhance your applications and prepare for interviews.</p>
        <a class="ssa-button" href="${enquiryHref('job-search-coaching')}" aria-label="Enquire Now about the Job Search and Career Coaching Program">Enquire Now</a>
      </article>
      <article>
        <h3>Individual Career Coaching</h3>
        <p>Flexible, on-demand support tailored to your needs, including job-search advice, interview preparation and career planning.</p>
        <a class="ssa-button" href="${enquiryHref('individual-coaching')}" aria-label="Enquire Now about Individual Career Coaching">Enquire Now</a>
      </article>
      <article>
        <h3>Internship Placement &amp; Coaching</h3>
        <p>Support to secure a meaningful internship, with coaching and guidance to build experience, confidence and workplace skills.</p>
        <a class="ssa-button" href="${enquiryHref('internship-coaching')}" aria-label="Enquire Now about Internship Placement and Coaching">Enquire Now</a>
      </article>
    </div>
  </section>

  ${testimonials({ id: 'seekers-testimonials-title', title: 'Success Stories', items: seekerTestimonials })}

  <section class="ssa-jobs-wrap ssa-jobs-section ssa-faqs" aria-labelledby="faq-title">
    <h2 id="faq-title">Frequently Asked Questions</h2>
    <div class="ssa-faq-list">
${jobSeekerFaqs
  .map(
    (f) => `      <details>
        <summary>${f.q}</summary>
        <div class="ssa-faq-answer">${f.a}</div>
      </details>`,
  )
  .join('\n')}
    </div>
  </section>
  </div>`,
};

const employers = {
  file: 'employers.html',
  path: '/employers',
  key: 'employers',
  title: 'For Employers',
  description:
    'Recruitment and talent sourcing, internship hosting, and contract and labour hire for Australian employers.',
  cta: enquiryHref('employer'),
  body: `  <div class="ssa-jobs ssa-employers">
  <section class="ssa-jobs-hero" aria-labelledby="employer-title">
    <div class="ssa-jobs-wrap">
      <p class="ssa-jobs-eyebrow">For Employers</p>
      <h1 id="employer-title">The right people.<br>The right opportunities.</h1>
      ${heroIntro('Finding the right talent shouldn’t be complicated. Skills Solutions Australia connects Australian employers with skilled graduates, emerging professionals and experienced talent through tailored recruitment, internship and workforce solutions.')}
      <div class="ssa-jobs-actions">
        ${btn('Find Talent', '#employer-solutions', 'ssa-jobs-outline')}
        ${btn('Discuss Your Workforce Needs', enquiryHref('employer'), 'ssa-jobs-explore')}
      </div>
    </div>
  </section>

  <section class="ssa-jobs-wrap ssa-jobs-section" id="employer-solutions" aria-labelledby="solutions-title">
    <h2 id="solutions-title">Employer Solutions</h2>
    <p>Flexible talent and workforce solutions to help your business grow.</p>
    <div class="ssa-jobs-services">
      <article>
        <h3>Recruitment &amp; Talent Sourcing</h3>
        <p>Access graduates, emerging professionals and experienced candidates across a range of industries.</p>
        ${btn('Find Talent', enquiryHref('recruitment'))}
      </article>
      <article>
        <h3>Internship Hosting</h3>
        <p>Bring fresh perspectives into your business through structured internship opportunities with mentoring and supervision.</p>
        <p class="ssa-note">Hosts provide a mentor. Where an agreed project suits paired work, we recommend two interns so they can collaborate and support each other.</p>
        ${btn('Host an Intern', enquiryHref('internship-hosting'))}
      </article>
      <article>
        <h3>Contract &amp; Labour Hire</h3>
        <p>Flexible workforce solutions to support projects, temporary requirements and business growth.</p>
        <a class="ssa-button" href="${enquiryHref('labour-hire')}" aria-label="Enquire Now about Contract and Labour Hire">Enquire Now <span aria-hidden="true">&rarr;</span></a>
      </article>
    </div>
  </section>

  <section class="ssa-jobs-wrap ssa-jobs-section" aria-labelledby="employer-industries-title">
    <h2 id="employer-industries-title">Industries We Support</h2>
    <p>Access talent across a range of industries and roles.</p>
    ${industryList()}
  </section>

  <section class="ssa-jobs-benefits" aria-labelledby="employer-benefits-title">
    <div class="ssa-jobs-wrap ssa-jobs-benefits-inner">
      <h2 id="employer-benefits-title">Why Partner With Skills Solutions Australia?</h2>
      <ul>
        <li>
          <svg aria-hidden="true" focusable="false"><use href="assets/employer-icons.svg#people"/></svg>
          <h3>Personalised Recruitment</h3>
          <p>We take time to understand your business and workforce requirements.</p>
        </li>
        <li>
          <svg aria-hidden="true" focusable="false"><use href="assets/employer-icons.svg#network"/></svg>
          <h3>Industry Connections</h3>
          <p>Access our professional networks and emerging talent.</p>
        </li>
        <li>
          <svg aria-hidden="true" focusable="false"><use href="assets/employer-icons.svg#sliders"/></svg>
          <h3>Flexible Solutions</h3>
          <p>Recruitment, internships and contract workforce options tailored to your needs.</p>
        </li>
        <li>
          <svg aria-hidden="true" focusable="false"><use href="assets/employer-icons.svg#chart"/></svg>
          <h3>Practical Outcomes</h3>
          <p>A focus on finding suitable people who can contribute to your business.</p>
        </li>
      </ul>
    </div>
  </section>

  ${testimonials({ id: 'partner-testimonials-title', title: 'Partner Testimonials', items: partnerTestimonials })}

  <section class="ssa-jobs-wrap ssa-employers-process" aria-labelledby="process-title">
    <h2 id="process-title">How We Work</h2>
    <ol>
      <li>
        <h3>Tell us what you need</h3>
        <p>We discuss your business, skills requirements and recruitment priorities.</p>
      </li>
      <li>
        <h3>We identify suitable talent</h3>
        <p>We source and assess candidates against your requirements.</p>
      </li>
      <li>
        <h3>Connect with the right people</h3>
        <p>We introduce suitable candidates and support the next steps.</p>
      </li>
    </ol>
  </section>

  <section class="ssa-jobs-benefits" aria-labelledby="employer-close-title">
    <div class="ssa-jobs-wrap ssa-employers-close">
      <h2 id="employer-close-title">Let’s find the right talent for your business.</h2>
      <p>Whether you’re recruiting, hosting interns or looking for flexible workforce solutions, we’d love to hear from you.</p>
    </div>
  </section>
  </div>`,
};

const industries = {
  file: 'industries.html',
  path: '/industries',
  key: 'industries',
  title: 'Industries We Support',
  description:
    'Career support for job seekers and recruitment, internships and labour hire for employers across IT, engineering, healthcare, finance, business, marketing and AI.',
  cta: enquiryHref(),
  scripts: ['<script type="module" src="assets/js/industries.js"></script>'],
  body: `  <div class="ssa-jobs ssa-industries">
  <section class="ssa-jobs-hero" aria-labelledby="industries-title">
    <div class="ssa-jobs-wrap">
      <h1 id="industries-title">Industries We Support</h1>
      <p class="ssa-jobs-intro">Career support for job seekers and recruitment, internships and labour hire for employers across Australia.</p>
    </div>
  </section>

  <section class="ssa-jobs-wrap ssa-industry-grid" id="industries" aria-label="Explore industries">
    <noscript>
      <p>Industries include IT &amp; Digital, Engineering, Healthcare, Accounting &amp; Finance, Business Administration &amp; Project Support, Marketing &amp; Communications and AI Transformation &amp; Implementation.</p>
      <p><a href="${enquiryHref()}">Enquire about your discipline</a></p>
    </noscript>
  </section>

  <nav class="ssa-pathways" aria-label="Choose your pathway">
    ${btn('For Job Seekers', 'job-seekers.html')}
    ${btn('For Employers', 'employers.html', 'ssa-outline')}
  </nav>
  </div>`,
};

const about = {
  file: 'about.html',
  path: '/about',
  key: 'about',
  title: 'About Us',
  description:
    'Skills Solutions Australia brings people and organisations together through personalised career support, recruitment and workforce solutions. Meet founder and director Julia Lane.',
  cta: enquiryHref(),
  body: `  <div class="ssa-about">
  <section class="ssa-about-hero" aria-labelledby="about-title">
    <div class="ssa-about-wrap">
      <p class="ssa-about-eyebrow">About Skills Solutions Australia</p>
      <h1 id="about-title">Connecting people.<br>Creating opportunities.</h1>
      <div class="ssa-about-intro">
        <p>We believe the right opportunity can change a career, and the right person can transform a business.</p>
        <p>Skills Solutions Australia brings people and organisations together through personalised career support, recruitment and workforce solutions.</p>
      </div>
    </div>
  </section>

  <section class="ssa-about-wrap ssa-about-approach" aria-labelledby="approach-title">
    <h2 id="approach-title">Our Approach</h2>
    <div>
      <p>We believe successful careers and businesses are built on genuine relationships, trust and understanding.</p>
      <p>Our approach is personal and practical. We take the time to understand people’s ambitions and employers’ needs, connecting the right people with the right opportunities.</p>
    </div>
  </section>

  <section class="ssa-about-wrap ssa-about-founder" aria-labelledby="founder-title">
    <img src="assets/images/julia-lane-founder.jpg" alt="Julia Lane" width="1254" height="1254" loading="lazy">
    <div>
      <p class="ssa-about-eyebrow">Meet our Founder &amp; Director</p>
      <h2 id="founder-title">Julia Lane</h2>
      <p>Julia founded Skills Solutions Australia with a passion for connecting people with opportunities and helping businesses access the talent they need.</p>
      <p>With extensive experience across higher education, international education, industry partnerships, business development and workforce solutions, Julia brings a practical understanding of both employer expectations and the challenges facing job seekers.</p>
      ${btn('Connect with Julia', enquiryHref())}
    </div>
  </section>

  <section class="ssa-about-close" aria-label="Find the right support">
    <div class="ssa-about-wrap">
      <p>Whether you’re looking for your first job, ready to take the next step in your career or hiring someone new for your team, we’re here to help.</p>
      <nav class="ssa-about-actions" aria-label="Choose your pathway">
        ${btn('For Job Seekers', 'job-seekers.html', 'ssa-about-primary')}
        ${btn('For Employers', 'employers.html', 'ssa-about-outline')}
      </nav>
    </div>
  </section>
  </div>`,
};

const contact = {
  file: 'contact.html',
  path: '/contact',
  key: 'contact',
  title: 'Contact',
  description:
    'Get in touch with Skills Solutions Australia about career support, recruitment, internships or labour hire. Australia-wide services.',
  cta: enquiryHref(),
  body: `  <div class="ssa-contact">
  <section class="ssa-contact-hero" aria-labelledby="contact-title">
    <div class="ssa-contact-wrap">
      <p class="ssa-contact-eyebrow">Get in touch</p>
      <h1 id="contact-title">Let’s start a conversation.</h1>
      <p>Whether you’re looking for career support, searching for talent or exploring opportunities to work together, we’d love to hear from you.</p>
    </div>
  </section>

  <section class="ssa-contact-wrap ssa-contact-grid" id="enquiry" aria-labelledby="connect-title">
    <div class="ssa-contact-details">
      <h2 id="connect-title">Let’s connect</h2>
      <p>Whether you’re exploring your next career move or looking for someone to join your team, we’d love to hear from you.</p>
      <ul>
        <li>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>
          <a href="mailto:${brand.email}">${brand.email}</a>
        </li>
        <li>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6 3 4 5-2 2a14 14 0 0 0 6 6l2-2 5 4-2 3C11 22 2 13 3 5z"/></svg>
          <a href="${brand.phoneHref}">${brand.phone}</a>
        </li>
        <li>
          <span class="ssa-contact-in" aria-hidden="true">in</span>
          <a href="${brand.linkedin}" rel="noopener noreferrer">Connect with us on LinkedIn</a>
        </li>
        <li>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0z"/><circle cx="12" cy="10" r="2.5"/></svg>
          <span>Australia-wide services</span>
        </li>
      </ul>
    </div>

    <form class="ssa-contact-form" id="enquiry-form" method="post" aria-label="Send an enquiry" novalidate>
      <div>
        <label for="enquiry-name">Full name *</label>
        <input id="enquiry-name" name="name" autocomplete="name" required>
        <p class="ssa-error" id="e-name" hidden></p>
      </div>
      <div>
        <label for="enquiry-email">Email address *</label>
        <input id="enquiry-email" name="email" type="email" autocomplete="email" required>
        <p class="ssa-error" id="e-email" hidden></p>
      </div>
      <div>
        <label for="enquiry-service">I’m interested in *</label>
        <select id="enquiry-service" name="service" required>
          <option value="">Select an option</option>
${enquiryOptions.map((o) => `          <option value="${o.value}">${o.label.replace(/&/g, '&amp;')}</option>`).join('\n')}
        </select>
        <p class="ssa-error" id="e-service" hidden></p>
      </div>
      <div>
        <label for="enquiry-message">Your message *</label>
        <textarea id="enquiry-message" name="message" rows="5" required></textarea>
        <p class="ssa-error" id="e-message" hidden></p>
      </div>
      <div class="ssa-hp" aria-hidden="true">
        <label for="enquiry-website">Leave this field empty</label>
        <input id="enquiry-website" name="website" tabindex="-1" autocomplete="off">
      </div>
      <button class="ssa-button" id="f-submit" type="submit"><span class="btn__text">Send Enquiry</span> <span aria-hidden="true">&rarr;</span></button>
      <p class="ssa-form-status" id="form-status" role="status" aria-live="polite" tabindex="-1"></p>
      <noscript><p class="ssa-form-status ssa-form-status--error">This form needs JavaScript. Please email <a href="mailto:${brand.email}">${brand.email}</a> or call <a href="${brand.phoneHref}">${brand.phone}</a>.</p></noscript>
    </form>
  </section>
  </div>`,
};

const notFound = {
  file: '404.html',
  path: '/404',
  key: '404',
  title: 'Page not found',
  description: 'That page could not be found.',
  noindex: true,
  cta: enquiryHref(),
  body: `  <div class="ssa-notfound">
    <div class="ssa-jobs-wrap">
      <p class="ssa-jobs-eyebrow">404</p>
      <h1>We couldn’t find that page.</h1>
      <p>It may have moved while we refreshed the site. Try one of these instead.</p>
      <div class="ssa-jobs-actions">
        ${btn('For Job Seekers', 'job-seekers.html')}
        ${btn('For Employers', 'employers.html', 'ssa-outline')}
        ${btn('Home', 'index.html', 'ssa-outline')}
      </div>
    </div>
  </div>`,
};

export const pages = [home, jobSeekers, employers, industries, about, contact, notFound];
