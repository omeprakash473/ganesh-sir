'use strict';
(() => {
  const config = window.GANESH_CONFIG || {};
  const navButton = document.querySelector('.navbar-toggler');
  const nav = document.getElementById('mainNav');
  navButton.addEventListener('click', () => {
    const open = nav.classList.toggle('show');
    navButton.setAttribute('aria-expanded', String(open));
    navButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  const closeMenu = () => { nav.classList.remove('show'); navButton.setAttribute('aria-expanded', 'false'); navButton.setAttribute('aria-label', 'Open menu'); };
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('show')) { closeMenu(); navButton.focus(); } });

  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    document.querySelectorAll('.programme-item').forEach(item => { item.hidden = button.dataset.filter !== 'all' && item.dataset.category !== button.dataset.filter; });
  }));
  const gradeSelect = document.getElementById('grade');
  const courseSelect = document.getElementById('course');
  const courseHint = document.getElementById('courseHint');
  let requestedCourse = '';
  function programmesForGrade(grade) {
    if (['Grade 8', 'Grade 9', 'Grade 10'].includes(grade)) return ['Foundation', 'Help me choose'];
    if (['Grade 11', 'Grade 12', 'Repeater'].includes(grade)) return ['NEET', 'JEE', 'CUET / EAPCET', 'Help me choose'];
    return grade === 'Other' ? ['Help me choose'] : [];
  }
  function updateProgrammes() {
    const allowed = programmesForGrade(gradeSelect.value);
    const preferred = requestedCourse || courseSelect.value;
    const placeholder = document.createElement('option');
    placeholder.value = ''; placeholder.textContent = gradeSelect.value ? 'Select a programme' : 'Select your class first';
    courseSelect.replaceChildren(placeholder);
    allowed.forEach(value => {
      const option = document.createElement('option'); option.value = value; option.textContent = value; courseSelect.append(option);
    });
    courseSelect.disabled = !gradeSelect.value;
    courseSelect.value = allowed.includes(preferred) ? preferred : '';
    courseSelect.setCustomValidity('');
    if (!gradeSelect.value) courseHint.textContent = 'Select your current class to see suitable programme choices.';
    else if (requestedCourse && !allowed.includes(requestedCourse)) courseHint.textContent = requestedCourse + ' is not listed for your selected class. Please choose one of the available options.';
    else if (['Grade 8', 'Grade 9', 'Grade 10'].includes(gradeSelect.value)) courseHint.textContent = 'Grades 8–10: Foundation or Help me choose.';
    else if (gradeSelect.value === 'Other') courseHint.textContent = 'Choose Help me choose to discuss a suitable learning path.';
    else courseHint.textContent = 'Grades 11–12 and repeaters: NEET, JEE, CUET / EAPCET or Help me choose.';
    courseSelect.dispatchEvent(new Event('input', {bubbles: true}));
  }
  gradeSelect.addEventListener('change', () => { updateProgrammes(); requestedCourse = ''; });
  document.querySelectorAll('[data-course]').forEach(link => link.addEventListener('click', () => {
    requestedCourse = link.dataset.course; updateProgrammes();
    if (gradeSelect.value) requestedCourse = '';
  }));
  updateProgrammes();
  document.querySelectorAll('[data-mode]').forEach(link => link.addEventListener('click', () => { document.querySelectorAll('input[name="mode"]').forEach(input => { input.checked = input.value === link.dataset.mode; }); }));

  // Only relative local paths or HTTP(S) URLs are accepted for media.
  const mediaPath = value => {
    if (typeof value !== 'string' || !value.trim()) return '';
    try { const parsed = new URL(value, location.href); return ['http:', 'https:', 'file:'].includes(parsed.protocol) ? value : ''; } catch { return ''; }
  };
  function showPhoto(key, person) {
    if (!person) return;
    if (person.name) document.getElementById(key + 'Name').textContent = person.name;
    if (person.role) document.getElementById(key + 'Role').textContent = person.role;
    const source = mediaPath(person.photo);
    if (!source) return;
    const holder = document.getElementById(key + 'Photo');
    // Lazy images must be in the document to become eligible for loading.
    // Reuse the HTML image so the supplied portraits also work without JavaScript.
    let image = holder.querySelector('img');
    if (!image) {
      image = document.createElement('img');
      image.loading = 'lazy';
      image.decoding = 'async';
      holder.replaceChildren(image);
    }
    image.alt = person.name || (key === 'sir' ? 'Ganesh Sir' : 'Madam');
    if (image.getAttribute('src') !== source) image.src = source;
  }
  showPhoto('sir', config.sir); showPhoto('madam', config.madam);
  (config.reviews || []).slice(0, 2).forEach((review, index) => {
    if (review.title) document.getElementById('reviewTitle' + index).textContent = review.title;
    if (review.description) document.getElementById('reviewDescription' + index).textContent = review.description;
    const source = mediaPath(review.video); if (!source) return;
    const holder = document.getElementById('reviewMedia' + index);
    const video = holder.querySelector('video') || document.createElement('video'); video.controls = true; video.preload = 'metadata'; video.playsInline = true; video.setAttribute('aria-label', review.title || 'Student review video');
    if (mediaPath(review.poster)) video.poster = review.poster;
    if (mediaPath(review.captions)) { const track = document.createElement('track'); track.kind = 'captions'; track.src = review.captions; track.srclang = review.language || 'en'; track.label = review.captionLabel || 'Captions'; video.append(track); }
    video.addEventListener('play', () => { document.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); }); });
    video.addEventListener('error', () => { holder.classList.remove('has-video'); holder.replaceChildren(); const message = document.createElement('p'); message.textContent = 'This video is currently unavailable. Please try again later.'; holder.append(message); });
    holder.replaceChildren(video); holder.classList.add('has-video'); video.src = source;
  });
  const whatsapp = String(config.whatsapp || '').replace(/[^0-9]/g, '');
  const canSend = /^[1-9][0-9]{7,14}$/.test(whatsapp);
  const contact = document.getElementById('contactText');
  if (canSend) {
    const link = document.createElement('a'); link.href = 'https://wa.me/' + whatsapp; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = config.phoneDisplay || '+' + whatsapp; contact.replaceChildren(link);
    if (config.address) { const address = document.createElement('span'); address.textContent = config.address; contact.append(document.createElement('br'), address); }
    document.getElementById('enquirySubmit').firstChild.textContent = 'Review & confirm enquiry ';
    document.getElementById('formDisclosure').textContent = 'Review your details in the confirmation popup, then open WhatsApp to send your enquiry.';
  } else if (config.address) { contact.textContent = config.address; }

  const form = document.getElementById('enquiryForm');
  const preview = document.getElementById('enquiryPreview');
  const result = document.getElementById('enquiryResult');
  const confirmation = document.getElementById('enquiryConfirmation');
  document.getElementById('closeEnquiryConfirmation').addEventListener('click', () => confirmation.close());
  document.getElementById('editEnquiry').addEventListener('click', () => { confirmation.close(); document.getElementById('studentName').focus(); });
  document.getElementById('sendWhatsapp').addEventListener('click', () => confirmation.close());

  form.addEventListener('input', () => { result.hidden = true; document.getElementById('copyStatus').textContent = ''; });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!programmesForGrade(gradeSelect.value).includes(courseSelect.value)) {
      updateProgrammes(); courseSelect.reportValidity(); return;
    }
    const data = new FormData(form);
    const studentName = String(data.get('studentName') || '').trim();
    const nameInput = document.getElementById('studentName');
    if (!studentName) { nameInput.setCustomValidity('Please enter your name.'); nameInput.reportValidity(); nameInput.addEventListener('input', () => nameInput.setCustomValidity(''), {once: true}); return; }
    const phoneInput = document.getElementById('phone');
    const digits = String(data.get('phone')).replace(/[^0-9]/g, '');
    if (digits.length < 7 || digits.length > 15) { phoneInput.setCustomValidity('Please enter a valid contact number with 7 to 15 digits.'); phoneInput.reportValidity(); phoneInput.addEventListener('input', () => phoneInput.setCustomValidity(''), {once: true}); return; }
    const lines = ['Hello Ganesh Classes, I would like to enquire about classes.', '', 'Student: ' + studentName, 'Phone: ' + String(data.get('phone')).trim(), 'Current class: ' + data.get('grade'), 'Programme: ' + data.get('course'), 'Learning mode: ' + data.get('mode')];
    const message = String(data.get('message') || '').trim(); if (message) lines.push('', 'My question: ' + message);
    preview.value = lines.join('\n');
    if (canSend) {
      const send = document.getElementById('sendWhatsapp'); send.href = 'https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(preview.value); send.hidden = false;
      document.getElementById('enquiryInstructions').textContent = 'Check your details below. Confirm to open WhatsApp chat with ' + (config.phoneDisplay || '+' + whatsapp) + ' and your prepared message.';
    }
    result.hidden = false;
    confirmation.showModal();
  });
  document.getElementById('copyEnquiry').addEventListener('click', async () => {
    try { if (!navigator.clipboard) throw new Error('Clipboard unavailable'); await navigator.clipboard.writeText(preview.value); document.getElementById('copyStatus').textContent = 'Enquiry copied. Nothing has been sent.'; }
    catch { preview.focus(); preview.select(); document.getElementById('copyStatus').textContent = 'Select and copy the message above (Ctrl+C or long press on mobile).'; }
  });
  document.getElementById('year').textContent = String(new Date().getFullYear());
})();

// One-time scroll reveals. No hidden classes: a failed script cannot hide content.
(function initClassicMotion() {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const running = new Set();
  const seen = new WeakSet();
  const delays = new WeakMap();
  const groups = ['#programmeGrid .programme-card', '#faculty .faculty-card', '#approach .approach-item', '.admission-steps li'];
  groups.forEach(selector => document.querySelectorAll(selector).forEach((element, index) => delays.set(element, (index % 4) * 70)));
  const targets = document.querySelectorAll('.section-heading, .programme-card, .mode-card, .faculty-card, .approach-item, .physics-example, .admission-steps li, .featured-review-note, .faq-section h2, .admission-copy');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || seen.has(entry.target)) return;
      const element = entry.target;
      seen.add(element); observer.unobserve(element);
      if (preference.matches || element.contains(document.activeElement)) return;
      // Anchor navigation should land on readable, still content immediately.
      const hash = location.hash.slice(1);
      const anchor = hash ? document.getElementById(hash) : null;
      if (anchor && (anchor.contains(element) || element.contains(anchor))) return;
      const animation = element.animate([
        {opacity: .15, transform: 'translateY(18px)'},
        {opacity: 1, transform: 'translateY(0)'}
      ], {duration: 650, delay: delays.get(element) || 0, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards'});
      running.add(animation);
      animation.finished.then(() => running.delete(animation), () => running.delete(animation));
    });
  }, {threshold: .08});
  targets.forEach(element => observer.observe(element));
  // Keyboard users never have to wait for an animated control to become visible.
  document.addEventListener('focusin', () => { running.forEach(animation => animation.finish()); });
  preference.addEventListener('change', event => {
    if (event.matches) { running.forEach(animation => animation.cancel()); running.clear(); }
  });
})();

// Connect the rail only to configured official profiles.
(() => {
  const config = window.GANESH_CONFIG || {};
  const allowed = {instagram: ['instagram.com'], youtube: ['youtube.com', 'youtu.be'], facebook: ['facebook.com', 'fb.com']};
  Object.entries(allowed).forEach(([key, hosts]) => {
    const value = config.social && config.social[key];
    if (!value) return;
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:' || !hosts.some(host => url.hostname === host || url.hostname.endsWith('.' + host))) return;
      const link = document.getElementById('social-' + key);
      link.href = url.href; link.target = '_blank'; link.rel = 'noopener noreferrer';
      link.removeAttribute('aria-disabled'); link.removeAttribute('role');
      const label = key === 'youtube' ? 'YouTube' : key[0].toUpperCase() + key.slice(1);
      link.setAttribute('aria-label', 'Ganesh Classes on ' + label + ' (opens in a new tab)');
      link.querySelector('.social-tooltip').textContent = label;
    } catch { /* Leave unavailable profiles clearly labelled. */ }
  });
  const number = String(config.whatsapp || '').replace(/[^0-9]/g, '');
  if (/^[1-9][0-9]{7,14}$/.test(number)) {
    ['social-whatsapp', 'floating-whatsapp'].forEach(id => {
      const link = document.getElementById(id);
      if (!link) return;
      link.href = 'https://wa.me/' + number; link.target = '_blank'; link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', 'Chat with Ganesh Classes on WhatsApp (opens in a new tab)');
      const tooltip = link.querySelector('.social-tooltip');
      if (tooltip) tooltip.textContent = 'Chat on WhatsApp';
    });
  }
})();

// Native dialogs provide keyboard focus containment and Escape-to-close.
(() => {
  document.querySelectorAll('[data-programme]').forEach(button => {
    button.addEventListener('click', () => {
      const dialog = document.getElementById('programme-' + button.dataset.programme);
      if (!dialog || dialog.open) return;
      dialog.showModal();
      dialog.scrollTop = 0;
    });
  });
  document.querySelectorAll('.programme-dialog').forEach(dialog => {
    dialog.querySelector('[data-close-programme]').addEventListener('click', () => dialog.close());
    dialog.querySelector('[data-enquire-programme]').addEventListener('click', () => {
      dialog.close();
      // Existing data-course handler preselects the programme in the enquiry form.
      const field = document.getElementById('studentName');
      field.focus({preventScroll: true});
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
  });
})();

// The social panel is opt-in and closes when visitors return to the page.
(() => {
  const dock = document.getElementById('socialDock');
  if (!dock) return;
  const desktop = window.matchMedia('(min-width: 992px)');
  const syncDock = () => { dock.open = desktop.matches; };
  syncDock();
  desktop.addEventListener('change', syncDock);
  document.addEventListener('pointerdown', event => { if (!desktop.matches && !dock.contains(event.target)) dock.open = false; });
  document.addEventListener('keydown', event => { if (!desktop.matches && event.key === 'Escape' && dock.open) { dock.open = false; dock.querySelector('summary').focus(); } });
  dock.querySelectorAll('a[href]').forEach(link => link.addEventListener('click', () => { if (!desktop.matches) dock.open = false; }));
})();
