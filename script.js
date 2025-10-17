/* js/script.js — CSP-safe, updated for current HTML */

const $ = (sel, root = document) => root?.querySelector(sel) ?? null;
const $$ = (sel, root = document) => Array.from((root ?? document).querySelectorAll(sel));
const onReady = (fn) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn();
const safeTimeout = (fn, ms) => setTimeout(fn, ms);
const log = (...args) => { if (window.DEBUG) console.debug(...args); };

/* ================= GTM (CSP-safe) ================= */
(function injectGTM(id) {
  if (!id) return;
  try {
    const f = document.getElementsByTagName('script')[0];
    const j = document.createElement('script');
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + id;
    f.parentNode.insertBefore(j, f);
  } catch (e) { log('GTM failed', e); }
})('GTM-NC5BDRF3');

/* ================= MAIN ================= */
onReady(() => {

  const menuToggle = $('#menu-toggle');
  const navMenu = $('#nav-menu');
  const themeBtn = $('#theme-toggle-btn');
  const fontSelect = $('#font-select');
  const header = $('#header');
  const scrollBtn = $('#scrollTopBtn');
  const contactForm = $('#contactForm');

  /* ---------- MENU TOGGLE ---------- */
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const expanded = navMenu.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      if (expanded) navMenu.querySelector('a')?.focus();
    });
  }

  /* ---------- THEME TOGGLE ---------- */
  if (themeBtn) {
    const root = document.documentElement;
    const stored = localStorage.getItem('site-theme');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'dark');
    const apply = (t) => {
      root.setAttribute('data-theme', t);
      themeBtn.setAttribute('aria-pressed', t === 'dark');
      themeBtn.textContent = t === 'dark' ? '🌙' : '☀️';
    };
    apply(initial);
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      localStorage.setItem('site-theme', next);
      apply(next);
    });
  }

  /* ---------- FONT SWITCHER ---------- */
  if (fontSelect) {
    const storedFont = localStorage.getItem('site-font');
    if (storedFont) document.documentElement.style.fontFamily = storedFont;
    fontSelect.addEventListener('change', (e) => {
      const v = e.target.value;
      document.documentElement.style.fontFamily = v;
      localStorage.setItem('site-font', v);
    });
  }

  /* ---------- STICKY HEADER + SCROLL TO TOP ---------- */
  const showThreshold = 220;
  const onScroll = () => {
    const y = window.scrollY || window.pageYOffset;
    header?.classList.toggle('sticky', y > 60);
    scrollBtn?.classList.toggle('show', y > showThreshold);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  scrollBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- REVEAL ON SCROLL ---------- */
  const revealEls = $$('[data-animate]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(e => io.observe(e));
  } else { revealEls.forEach(e => e.classList.add('visible')); }

  /* ---------- SKILL DONUTS ---------- */
  $$('.skill-circle').forEach(el => {
    const level = parseInt(el.dataset.level) || 0;
    const size = 88, stroke = 8, r = (size - stroke)/2, c = 2*Math.PI*r;
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);

    const bg = document.createElementNS(svgNS, 'circle');
    bg.setAttribute('cx', size/2); bg.setAttribute('cy', size/2); bg.setAttribute('r', r);
    bg.setAttribute('stroke-width', stroke); bg.setAttribute('class', 'skill-bg'); bg.setAttribute('fill', 'none');

    const fg = document.createElementNS(svgNS, 'circle');
    fg.setAttribute('cx', size/2); fg.setAttribute('cy', size/2); fg.setAttribute('r', r);
    fg.setAttribute('stroke-width', stroke); fg.setAttribute('class', 'skill-fg'); fg.setAttribute('fill', 'none');
    fg.setAttribute('stroke-dasharray', c); fg.setAttribute('stroke-dashoffset', c);

    svg.appendChild(bg); svg.appendChild(fg);
    el.innerHTML = ''; el.appendChild(svg);

    const offset = c * (1 - Math.min(100, Math.max(0, level))/100);
    requestAnimationFrame(() => { fg.style.transition = 'stroke-dashoffset 1100ms cubic-bezier(.2,.9,.3,1)'; fg.style.strokeDashoffset = offset; });

    const p = document.createElement('div'); p.className = 'skill-percent'; p.textContent = level + '%'; el.appendChild(p);
  });

  /* ---------- SMOOTH ANCHORS ---------- */
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', ev => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { ev.preventDefault(); target.scrollIntoView({ behavior:'smooth', block:'start' }); }
  }));

  /* ---------- CONTACT FORM ---------- */
  if (contactForm) {
    const msgNode = contactForm.querySelector('.form-message');
    contactForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const name = contactForm.name?.value.trim();
      const email = contactForm.email?.value.trim();
      const message = contactForm.message?.value.trim();
      if (!name || !email || !message) {
        if (msgNode) { msgNode.textContent = 'Please fill all required fields.'; msgNode.className = 'form-message error'; }
        return;
      }
      const subject = encodeURIComponent(contactForm.subject?.value || 'Website Contact');
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:muhammadaffaf746@gmail.com?subject=${subject}&body=${body}`;
      if (msgNode) { msgNode.textContent = 'Preparing email…'; }
    });
  }

  /* ---------- SLIDERS ---------- */
  function slider(wrapperSel, leftBtnSel, rightBtnSel) {
    const wrap = $(wrapperSel); if (!wrap) return;
    const items = Array.from(wrap.children);
    let idx = 0;
    const show = i => { idx = (i + items.length) % items.length; wrap.style.transform = `translateX(${-idx*100}%)`; };
    $(leftBtnSel)?.addEventListener('click', () => show(idx-1));
    $(rightBtnSel)?.addEventListener('click', () => show(idx+1));
    wrap.tabIndex = 0;
    wrap.addEventListener('keydown', e => { if (e.key==='ArrowLeft') show(idx-1); if (e.key==='ArrowRight') show(idx+1); });
    show(0);
  }
  slider('.achievements-wrapper', '.ach-left-btn', '.ach-right-btn');
  slider('.projects-wrapper', '.left-btn', '.right-btn');

  /* ---------- CHATBOT ---------- */
  const chatbotToggle = $('#chatbot-toggle');
  const chatbotWindow = $('#chatbot-window');
  const chatbotClose = $('#chatbot-close');
  const chatbotBody = $('#chatbot-body');
  const chatbotInput = $('#chatbot-input');
  const chatbotSend = $('#chatbot-send');
  const quickReplies = $$('.quick-reply');

  function appendMsg(txt, cls='bot-message'){ const d=document.createElement('div'); d.className=cls+' chatbot-message'; d.textContent=txt; chatbotBody?.appendChild(d); chatbotBody.scrollTop=chatbotBody.scrollHeight; }

  function botReply
