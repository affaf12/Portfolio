/* js/script.js — repaired, CSP-safe, robust
   - Replace your existing file with this
   - Keep <script src="js/script.js" defer></script> in HTML
*/

/* ================= CONFIG ================= */
const GTM_ID = 'GTM-NC5BDRF3';
const CHAT_SOUND_URL = 'live-chat-353605.mp3'; // optional -- will silently fail if not present
const ENABLE_FANCY_CHAT = true;

/* ================= HELPERS ================= */
const $ = (sel, root = document) => root?.querySelector(sel) ?? null;
const $$ = (sel, root = document) => Array.from((root ?? document).querySelectorAll(sel));
const onReady = (fn) => {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
  else fn();
};
const safeTimeout = (fn, ms) => setTimeout(fn, ms);

/* tiny logger for debugging (no-op in production if console not present) */
const log = (...s) => { try { if (window.DEBUG) console.debug(...s); } catch (e) { } };

/* ================= GTM INJECTION (CSP-safe) ================= */
(function injectGTM(id) {
  if (!id) return;
  try {
    (function(w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      const f = d.getElementsByTagName(s)[0];
      const j = d.createElement(s);
      const dl = l !== 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', id);
  } catch (e) { log('GTM injection failed', e); }
})(GTM_ID);

/* ================= MAIN ================= */
onReady(() => {
  /* ---------- ELEMENT SELECTS ---------- */
  const menuToggle = $('#menu-toggle');
  const navMenu = $('#nav-menu');
  const themeBtn = $('#theme-toggle-btn');
  const fontSelect = $('#font-select');
  const header = $('#header');
  const contactBtn = $('#contactBtn');
  const scrollBtn = $('#scrollTopBtn');
  const contactForm = $('#contactForm');

  /* ---------- MENU TOGGLE (mobile) ---------- */
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      const expanded = navMenu.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      // For accessibility: focus first link when opening
      if (expanded) {
        const firstLink = navMenu.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });
  } else {
    log('menuToggle or navMenu missing');
  }

  /* ---------- THEME TOGGLE (dark/light) ---------- */
  (function initTheme() {
    if (!themeBtn) return;
    const root = document.documentElement;
    const stored = localStorage.getItem('site-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'dark'); // default dark
    function apply(t) {
      root.setAttribute('data-theme', t);
      themeBtn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
      themeBtn.textContent = t === 'dark' ? '🌙' : '☀️';
    }
    apply(initial);
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      localStorage.setItem('site-theme', next);
      apply(next);
    });
  })();

  /* ---------- FONT SELECT (if present) ---------- */
  if (fontSelect) {
    try {
      const stored = localStorage.getItem('site-font');
      if (stored) document.documentElement.style.fontFamily = stored;
      fontSelect.addEventListener('change', (e) => {
        const v = e.target.value;
        try { document.documentElement.style.fontFamily = v; localStorage.setItem('site-font', v); } catch (_) {}
      });
    } catch (e) { log('font select init failed', e); }
  }

  /* ---------- STICKY HEADER + SCROLL-TO-TOP ---------- */
  (function headerAndScroll() {
    const showThreshold = 220;
    function onScroll() {
      const y = window.scrollY || window.pageYOffset;
      // sticky header: add .sticky when scrolled down a bit
      if (header) {
        if (y > 60) header.classList.add('sticky');
        else header.classList.remove('sticky');
      }
      // scroll button: toggle .show (CSS controls visibility)
      if (scrollBtn) {
        if (y > showThreshold) scrollBtn.classList.add('show');
        else scrollBtn.classList.remove('show');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (scrollBtn) {
      scrollBtn.addEventListener('click', (ev) => { ev.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }
  })();

  /* ---------- REVEAL ON SCROLL (IntersectionObserver) ---------- */
  (function revealOnScroll() {
    const nodes = $$('[data-animate]');
    if (!nodes.length) return;
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      nodes.forEach(n => io.observe(n));
    } else {
      nodes.forEach(n => n.classList.add('visible'));
    }
  })();

  /* ---------- SKILL DONUTS (SVG) ---------- */
  (function skillDonuts() {
    const skillEls = $$('.skill-circle');
    if (!skillEls.length) return;
    function createDonut(level) {
      const size = 88, stroke = 8;
      const r = (size - stroke) / 2;
      const c = 2 * Math.PI * r;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
      svg.setAttribute('width', size);
      svg.setAttribute('height', size);

      const bg = document.createElementNS(svg.namespaceURI, 'circle');
      bg.setAttribute('cx', size/2); bg.setAttribute('cy', size/2); bg.setAttribute('r', r);
      bg.setAttribute('stroke-width', stroke); bg.setAttribute('class', 'skill-bg'); bg.setAttribute('fill', 'none');

      const fg = document.createElementNS(svg.namespaceURI, 'circle');
      fg.setAttribute('cx', size/2); fg.setAttribute('cy', size/2); fg.setAttribute('r', r);
      fg.setAttribute('stroke-width', stroke); fg.setAttribute('class', 'skill-fg'); fg.setAttribute('fill', 'none');
      fg.setAttribute('stroke-dasharray', String(c)); fg.setAttribute('stroke-dashoffset', String(c));

      svg.appendChild(bg); svg.appendChild(fg);

      requestAnimationFrame(() => {
        const offset = c * (1 - Math.min(100, Math.max(0, level)) / 100);
        fg.style.transition = 'stroke-dashoffset 1100ms cubic-bezier(.2,.9,.3,1)';
        fg.style.strokeDashoffset = offset;
      });
      return svg;
    }

    skillEls.forEach(el => {
      const level = parseInt(el.getAttribute('data-level')) || 0;
      el.innerHTML = '';
      el.appendChild(createDonut(level));
      const p = document.createElement('div'); p.className = 'skill-percent'; p.textContent = `${level}%`;
      el.appendChild(p);
    });
  })();

  /* ---------- SMOOTH ANCHORS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (ev) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        ev.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update active nav state lightly
        try {
          $$('#nav-menu a').forEach(link => link.classList.remove('active'));
          a.classList.add('active');
        } catch (_) {}
      }
    });
  });

  /* ---------- CONTACT BUTTON (scroll) ---------- */
  if (contactBtn) {
    contactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const c = $('#contact');
      if (c) {
        c.scrollIntoView({ behavior: 'smooth', block: 'start' });
        c.setAttribute('tabindex', '-1');
        c.focus({ preventScroll: true });
      }
    });
  }

  /* ========== SLIDERS: Projects & Achievements ========== */
  (function initSliders() {
    // generic slider helper for a wrapper and left/right buttons
    function createSlider(wrapperSelector, leftBtnSelector, rightBtnSelector) {
      const wrapper = $(wrapperSelector);
      const left = leftBtnSelector ? $(leftBtnSelector) : null;
      const right = rightBtnSelector ? $(rightBtnSelector) : null;
      if (!wrapper) { log('Slider wrapper missing', wrapperSelector); return; }
      const items = Array.from(wrapper.children);
      if (!items.length) return;

      let idx = 0;
      function showIndex(i) {
        idx = Math.max(0, Math.min(items.length - 1, i));
        const offset = -idx * 100;
        wrapper.style.transform = `translateX(${offset}%)`;
      }
      function prev() { showIndex(idx - 1 < 0 ? items.length - 1 : idx - 1); }
      function next() { showIndex(idx + 1 >= items.length ? 0 : idx + 1); }

      if (left) left.addEventListener('click', prev);
      if (right) right.addEventListener('click', next);

      // Keyboard nav when wrapper is focused
      wrapper.tabIndex = 0;
      wrapper.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
      });

      // build simple pagination (optional)
      return { showIndex, prev, next, wrapper, items };
    }

    // Achievements
    const ach = createSlider('.achievements-wrapper', '.ach-left-btn', '.ach-right-btn');
    // Projects
    const proj = createSlider('.projects-wrapper', '.left-btn', '.right-btn');

    // ensure wrappers start at index 0
    if (ach && ach.showIndex) ach.showIndex(0);
    if (proj && proj.showIndex) proj.showIndex(0);
  })();

  /* ---------- CONTACT FORM (client-side fallback) ---------- */
  (function initContactForm() {
    if (!contactForm) { log('No contact form present'); return; }
    const msgNode = contactForm.querySelector('.form-message');
    contactForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const name = (contactForm.name?.value || '').trim();
      const email = (contactForm.email?.value || '').trim();
      const message = (contactForm.message?.value || '').trim();
      if (!name || !email || !message) {
        if (msgNode) { msgNode.textContent = 'Please fill name, email and message.'; msgNode.classList.remove('success'); msgNode.classList.add('error'); }
        return;
      }
      if (msgNode) { msgNode.textContent = 'Preparing email…'; msgNode.classList.remove('error'); msgNode.classList.remove('success'); }
      const subject = encodeURIComponent(contactForm.subject?.value.trim() || 'Website contact');
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      // attempt fetch POST to server endpoint if provided via data-endpoint attribute
      const endpoint = contactForm.getAttribute('data-endpoint');
      if (endpoint) {
        // send as JSON; server must accept CORS if remote
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, subject, message })
        }).then(r => {
          if (r.ok) {
            if (msgNode) { msgNode.textContent = 'Message sent — thank you!'; msgNode.classList.remove('error'); msgNode.classList.add('success'); }
            contactForm.reset();
          } else {
            throw new Error('Server error');
          }
        }).catch(err => {
          log('Contact endpoint error', err);
          // fallback to mailto
          window.location.href = `mailto:muhammadaffaf746@gmail.com?subject=${subject}&body=${body}`;
        });
      } else {
        // mailto fallback
        window.location.href = `mailto:muhammadaffaf746@gmail.com?subject=${subject}&body=${body}`;
      }
    });
  })();

  /* ================= CHATBOT ================= */
  (function initChatbot() {
    const chatbotToggle = $('#chatbot-toggle');
    const chatbotWindow = $('#chatbot-window');
    const chatbotClose = $('#chatbot-close');
    const chatbotBody = $('#chatbot-body');
    const chatbotInput = $('#chatbot-input');
    const chatbotSend = $('#chatbot-send');
    const quickReplies = $$('.quick-reply');

    if (!chatbotToggle || !chatbotWindow || !chatbotBody) { log('chatbot elements missing'); return; }

    // preload sound (graceful)
    let chatAudio = null;
    try {
      chatAudio = new Audio(CHAT_SOUND_URL);
      chatAudio.preload = 'auto';
    } catch (e) { chatAudio = null; log('chat audio failed to load', e); }

    function appendMessage(text, cls = 'bot-message') {
      const d = document.createElement('div');
      d.className = cls + ' chatbot-message';
      d.textContent = text;
      chatbotBody.appendChild(d);
      chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    function botReplyTo(input) {
      const q = (input || '').toLowerCase();
      if (q.includes('project')) return 'See Projects section or https://github.com/affaf12';
      if (q.includes('contact') || q.includes('email')) return 'Email: muhammadaffaf746@gmail.com';
      if (q.includes('resume')) return 'You can download my resume from the Resume button in the Hero section.';
      if (q.includes('hello') || q.includes('hi')) return 'Hello 👋 — how can I help? Try "Show projects" or "Contact info".';
      return "I’m a lightweight helper bot. Try: 'Show projects', 'Contact info' or 'Hi'.";
    }

    // fancy typing
    function fancyReplyFlow(userText) {
      const typing = document.createElement('div');
      typing.className = 'bot-typing chatbot-message';
      typing.setAttribute('aria-hidden', 'true');
      typing.textContent = 'Typing';
      chatbotBody.appendChild(typing);
      chatbotBody.scrollTop = chatbotBody.scrollHeight;

      let start = performance.now();
      let dots = 0;
      let raf = null;
      function anim(now) {
        const elapsed = now - start;
        if (elapsed > 500) { start = now; dots = (dots + 1) % 4; }
        typing.textContent = 'Typing' + '.'.repeat(dots);
        raf = requestAnimationFrame(anim);
      }
      raf = requestAnimationFrame(anim);

      safeTimeout(() => {
        if (raf) cancelAnimationFrame(raf);
        typing.remove();
        const reply = botReplyTo(userText);
        const bubble = document.createElement('div');
        bubble.className = 'bot-message chatbot-message';
        chatbotBody.appendChild(bubble);
        // typewriter
        let i = 0;
        (function typeTick() {
          if (i < reply.length) {
            bubble.textContent += reply[i++];
            chatbotBody.scrollTop = chatbotBody.scrollHeight;
            safeTimeout(typeTick, 14);
          } else {
            // sound
            if (chatAudio) try { chatAudio.currentTime = 0; chatAudio.play().catch(()=>{}); } catch(_) {}
          }
        })();
      }, 700);
    }

    function simpleReplyFlow(userText) {
      safeTimeout(() => {
        appendMessage(botReplyTo(userText), 'bot-message');
        if (chatAudio) try { chatAudio.currentTime = 0; chatAudio.play().catch(()=>{}); } catch(_) {}
      }, 420);
    }

    // Toggle
    chatbotToggle.addEventListener('click', () => {
      if (chatbotWindow.hasAttribute('hidden')) {
        chatbotWindow.removeAttribute('hidden');
        const input = $('#chatbot-input'); if (input) input.focus();
      } else {
        chatbotWindow.setAttribute('hidden', '');
      }
    });

    if (chatbotClose) chatbotClose.addEventListener('click', () => chatbotWindow.setAttribute('hidden', ''));

    // send logic
    if (chatbotSend && chatbotInput) {
      function sendText() {
        const txt = (chatbotInput.value || '').trim();
        if (!txt) return;
        appendMessage(txt, 'user-message');
        chatbotInput.value = '';
        if (ENABLE_FANCY_CHAT) fancyReplyFlow(txt); else simpleReplyFlow(txt);
      }
      chatbotSend.addEventListener('click', sendText);
      chatbotInput.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); sendText(); }
      });
    }

    // quick replies
    quickReplies.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const txt = (e.target.textContent || '').trim();
        appendMessage(txt, 'user-message');
        if (ENABLE_FANCY_CHAT) fancyReplyFlow(txt); else simpleReplyFlow(txt);
      });
    });

    // escape to close
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') chatbotWindow?.setAttribute('hidden', ''); });
  })();

  /* ========== FINAL sanity logs ========== */
  log('script.js initialized — features: menu, theme, reveals, skills, sliders, chatbot, contact');
}); // end onReady
