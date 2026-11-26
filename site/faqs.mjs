// FAQ copy from Julia's "Website FAQs" handoff. Answers are HTML strings, kept word-for-word.
const p = (text) => `<p>${text}</p>`;

export const jobSeekerFaqs = [
  { q: 'Who is career coaching for?', a: p('We work with graduates, early-career professionals and people changing careers across a range of industries. If you’re unsure which roles to target, what Australian employers are looking for or how to talk about your experience, we can help.') },
  { q: 'What’s included in the Job Search &amp; Career Coaching Program?', a: p('We’ll work with you on your job search strategy, résumé and LinkedIn profile, tailored applications and selection criteria, interview preparation and networking. You’ll get practical feedback and personalised guidance as you apply for roles.') },
  { q: 'Can I book a single session or get feedback on one application?', a: p('Yes. You can book one-on-one coaching, practise for an upcoming interview or get feedback on an application before you submit it. Coaching sessions are online.') },
  { q: 'What does an internship involve?', a: p('Internships typically run for 12 weeks, two to three days a week. You’ll work on a project with a host organisation, with a workplace mentor to guide you and provide feedback. We consider your skills, interests and location when looking for a suitable placement. Timing depends on host availability.') },
  { q: 'Are internships paid, and can they lead to a job?', a: p('Internships through the program are unpaid and structured around learning. Some graduates have gone on to receive job offers from their hosts. Any offer depends on the host’s hiring needs.') },
];

export const recruitmentFaqs = [
  { q: 'What types of roles can you help us fill?', a: p('We help employers find graduate and early-career talent across a range of industries. Tell us what the person will be doing, which skills they need from day one and what they can learn on the job. We’ll let you know how we can help.') },
  { q: 'Can you help with permanent and contract hiring?', a: p('Yes. We can help you recruit someone to join your team directly or discuss contract support for a project or short-term staffing need.') },
  { q: 'How does the recruitment process work?', a: p('We start with a conversation about the role, your team and what you’re looking for. We then source and screen candidates against the agreed criteria and introduce suitable people for you to interview.') },
  { q: 'What does recruitment cost?', a: p('Fees depend on the role and whether you’re hiring directly or need contract support. We’ll confirm the scope and fees before we get started.') },
  { q: 'How do we get started?', a: p('Get in touch with a short brief or tell us what you need help with. If you’re still working out the role, we can talk through the skills, experience and type of hire that would suit your team.') },
];

export const hostingFaqs = [
  { q: 'What kind of project can an intern support?', a: p('A clearly scoped project with a practical outcome works well. Past examples include testing a system, documenting business processes and reviewing service desk workflows. We can talk through what your team needs and shape a project with clear learning objectives.') },
  { q: 'What do we need to provide as a host?', a: p('You’ll need to nominate a workplace mentor who can set tasks, answer questions and give regular feedback. Where the project and team can support it, we recommend hosting two interns so they can work together and learn from each other.') },
  { q: 'What support do you provide during the placement?', a: p('We help define the project, match candidates to the opportunity and stay in touch during the placement. If something needs adjusting, we’ll work with you and the intern to get it back on track.') },
];
