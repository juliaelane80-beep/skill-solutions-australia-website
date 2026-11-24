/**
 * Skills Solutions Australia – site behaviour.
 * Testimonial controls and the enquiry form. No dependencies.
 */
(() => {
  document.documentElement.classList.add('js');

  /** Testimonials: show one card at a time with manual previous/next controls. */
  const initTestimonials = () => {
    for (const root of document.querySelectorAll('[data-testimonials]')) {
      const slides = [...root.querySelectorAll('.ssa-t-slide')];
      const controls = root.querySelector('.ssa-t-controls');
      const counter = root.querySelector('[data-current]');
      if (slides.length < 2 || !controls) continue;

      let index = 0;
      const show = (next) => {
        index = (next + slides.length) % slides.length;
        slides.forEach((slide, i) => {
          slide.hidden = i !== index;
        });
        counter.textContent = String(index + 1);
      };

      controls.hidden = false;
      root.classList.add('is-enhanced');
      controls.addEventListener('click', (e) => {
        const button = e.target.closest('[data-dir]');
        if (button) show(index + Number(button.dataset.dir));
      });
      controls.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') show(index - 1);
        if (e.key === 'ArrowRight') show(index + 1);
      });
      show(0);
    }
  };

  /** Enquiry form: preselect the topic from ?service=, validate, submit to /api/enquiry. */
  const initForm = () => {
    const form = document.getElementById('enquiry-form');
    if (!form) return;

    const status = document.getElementById('form-status');
    const submit = document.getElementById('f-submit');
    const label = submit.querySelector('.btn__text');
    const startedAt = Date.now();
    const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Preselect the topic only when the selector is still empty and the value is a real option.
    const service = new URLSearchParams(window.location.search).get('service');
    const select = document.getElementById('enquiry-service');
    if (select && !select.value && service && [...select.options].some((o) => o.value === service)) {
      select.value = service;
    }

    const rules = {
      name: (v) => (v.trim() ? '' : 'Please enter your name.'),
      email: (v) => (EMAIL.test(v.trim()) ? '' : 'Please enter a valid email address.'),
      service: (v) => (v ? '' : 'Please choose what you are interested in.'),
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
      status.classList.toggle('ssa-form-status--error', isError);
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
      label.textContent = 'Sending…';
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
        label.textContent = 'Send Enquiry';
      }
    });
  };

  initTestimonials();
  initForm();
})();
