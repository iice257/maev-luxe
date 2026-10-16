(() => {
  const WA = '2347053599719';
  const waLink = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Butterfly mark */
  const BFLY = `<svg viewBox="0 0 64 60" aria-hidden="true">
    <g class="wl"><path d="M32 30C26 14 10 8 6 18c-3 9 10 14 26 12Z"/><path d="M32 32C21 33 9 41 14 51c5 8 14-4 18-17Z"/></g>
    <g class="wr"><path d="M32 30c6-16 22-22 26-12 3 9-10 14-26 12Z"/><path d="M32 32c11 1 23 9 18 19-5 8-14-4-18-17Z"/></g>
    <path d="M32 22v22" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
  </svg>`;
  $$('.bfly').forEach((el) => { el.innerHTML = BFLY; });

  /* WhatsApp links */
  $$('[data-wa]').forEach((a) => {
    const msg = a.dataset.waMsg || 'Hi MAEV! I have a question.';
    a.href = waLink(msg);
  });

  /* Footer year */
  const yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* Nav solid on scroll */
  const nav = $('#nav');
  const onScroll = () => {
    nav.classList.toggle('is-solid', window.scrollY > window.innerHeight * 0.6);
  };
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  /* Reveal on scroll */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        if (e.target.classList.contains('bfly')) e.target.classList.add('flap');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach((el) => io.observe(el));

  /* Colour picker */
  const names = ['Rose', 'Graphite', 'Dusk', 'Sand', 'Mauve', 'Wine'];
  const notes = [
    'Soft, sweet and made to be noticed.',
    'Deep and quiet. Goes with everything.',
    'Deep, rich blue with a quiet shine.',
    'A soft, warm neutral for easy, everyday looks.',
    'Dusty rose with a calm, vintage feel.',
    'Rich burgundy for a bolder statement.',
  ];
  const shots = $$('.shot');
  const rows = $$('.row');
  const dots = $$('.dot');
  const cur = $('#cur');
  const mName = $('#m-name');
  const mNote = $('#m-note');
  const mCta = $('#m-cta');
  let active = 0;

  const waFor = (name) => waLink(`Hi MAEV! I'd love to order the ${name} tote. Is it available?`);

  rows.forEach((r) => { $('.link-wa', r).href = waFor(r.dataset.name); });
  mCta.href = waFor(names[0]);

  function setActive(i) {
    if (i === active) return;
    active = i;
    shots.forEach((s, k) => s.classList.toggle('is-active', k === i));
    rows.forEach((r, k) => {
      r.classList.toggle('is-active', k === i);
      $('.row__btn', r).setAttribute('aria-expanded', String(k === i));
    });
    dots.forEach((d, k) => {
      d.classList.toggle('is-active', k === i);
      d.setAttribute('aria-pressed', String(k === i));
    });
    cur.textContent = String(i + 1).padStart(2, '0');
    mName.textContent = names[i];
    mNote.textContent = notes[i];
    mCta.textContent = `Ask about ${names[i]}`;
    mCta.href = waFor(names[i]);
  }

  rows.forEach((r) => {
    const i = +r.dataset.i;
    $('.row__btn', r).addEventListener('click', () => setActive(i));
    r.addEventListener('mouseenter', () => { if (matchMedia('(hover: hover)').matches) setActive(i); });
  });
  dots.forEach((d) => d.addEventListener('click', () => setActive(+d.dataset.i)));

  /* Swipe the colour image on touch */
  const frame = $('.colours__frame');
  let sx = null;
  frame.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  frame.addEventListener('touchend', (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    sx = null;
    if (Math.abs(dx) < 40) return;
    setActive((active + (dx < 0 ? 1 : -1) + names.length) % names.length);
  }, { passive: true });

  /* Sticky WhatsApp button: show after hero, hide over the final CTA */
  const sticky = $('#stickyWa');
  const hero = $('.hero');
  const cta = $('#contact');
  let pastHero = false, onCta = false;
  const syncSticky = () => sticky.classList.toggle('is-on', pastHero && !onCta);
  new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; syncSticky(); }, { threshold: 0.35 }).observe(hero);
  new IntersectionObserver(([e]) => { onCta = e.isIntersecting; syncSticky(); }, { threshold: 0.4 }).observe(cta);

  /* Gentle depth: hero image drift + butterfly float */
  if (!reduce) {
    const heroImg = $('.hero__img');
    const bf = $('#bf-float');
    let ticking = false;
    const frameTick = () => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.2) heroImg.style.translate = `0 ${y * 0.12}px`;
      if (bf) {
        const r = bf.parentElement.getBoundingClientRect();
        const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - innerHeight / 2) / innerHeight));
        bf.style.translate = `${p * -18}px ${p * 28}px`;
        bf.style.rotate = `${p * -10}deg`;
      }
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(frameTick); } }, { passive: true });
    frameTick();
  }
})();

/* ?static — show every section immediately (used for full-page screenshots) */
if (/[?&]static\b/.test(location.search)) {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
  document.querySelectorAll('.rise').forEach((el) => { el.style.animation = 'none'; el.style.opacity = 1; el.style.transform = 'none'; });
}
