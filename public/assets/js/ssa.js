/**
 * Skills Solutions Australia – site behaviour.
 * Mobile navigation and the enquiry form. No dependencies.
 */
(() => {
  document.documentElement.classList.add('js');

  /** Mobile navigation toggle with Escape-to-close and focus return. */
  const initNav = () => {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('site-nav');
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };

    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 861px)').addEventListener('change', () => setOpen(false));
  };

  /** Enquiry form: preselect service from ?service=, validate, submit to /api/enquiry. */
  const initForm = () => {
    const form = document.getElementById('enquiry-form');
    if (!form) return;

    const status = document.getElementById('form-status');
    const submit = document.getElementById('f-submit');
    const startedAt = Date.now();
    const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const service = new URLSearchParams(location.search).get('service');
    const select = form.elements.service;
    if (service && [...select.options].some((o) => o.value === service)) select.value = service;

    const rules = {
      service: (v) => (v ? '' : 'Please choose what your enquiry is about.'),
      name: (v) => (v.trim() ? '' : 'Please enter your name.'),
      email: (v) => (EMAIL.test(v.trim()) ? '' : 'Please enter a valid email address.'),
      phone: (v) => (!v.trim() || /^[+\d][\d\s()-]{5,}$/.test(v.trim()) ? '' : 'Please enter a valid phone number.'),
      message: (v) => (v.trim().length >= 10 ? '' : 'Please tell us a little about what you need (at least 10 characters).'),
    };

    const showError = (name, message) => {
      const field = form.elements[name];
      const error = document.getElementById(`e-${name}`);
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (message) field.setAttribute('aria-describedby', `e-${name}`);
      else field.removeAttribute('aria-describedby');
      error.textContent = message;
      error.hidden = !message;
    };

    const validate = () => {
      let firstInvalid = null;
      for (const [name, rule] of Object.entries(rules)) {
        const message = rule(form.elements[name].value);
        showError(name, message);
        if (message && !firstInvalid) firstInvalid = form.elements[name];
      }
      firstInvalid?.focus();
      return !firstInvalid;
    };

    const setStatus = (message, isError) => {
      status.textContent = message;
      status.classList.toggle('form__status--error', isError);
      status.focus();
    };

    for (const name of Object.keys(rules)) {
      form.elements[name].addEventListener('blur', (e) => showError(name, rules[name](e.target.value)));
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = '';
      if (!validate()) return;

      const payload = Object.fromEntries(new FormData(form).entries());
      payload.elapsedMs = Date.now() - startedAt;

      submit.disabled = true;
      submit.querySelector('.btn__text').textContent = 'Sending…';
      try {
        const res = await fetch('/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) throw new Error(data.error || 'Request failed');
        form.reset();
        setStatus('Thanks, your enquiry has been sent. We will be in touch soon.', false);
      } catch (err) {
        setStatus(
          `${err.message === 'Request failed' ? 'Sorry, we could not send your enquiry.' : err.message} Please try again, or email us directly.`,
          true,
        );
      } finally {
        submit.disabled = false;
        submit.querySelector('.btn__text').textContent = 'Send enquiry';
      }
    });
  };

  initNav();
  initForm();
})();
