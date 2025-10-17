/* js/script.js (CSP-safe)
   - No eval, no string-based timers
   - Injects GTM (GTM-NC5BDRF3)
   - Menu, theme toggle, reveal animations
   - Skill circles (SVG)
   - Contact form (mailto fallback)
   - Scroll-to-top button
   - Chatbot: keeps current UI and has optional "fancy" mode
   - Plays chat sound via Audio object (no inline audio tags)
*/

/* ================= CONFIG ================= */
const GTM_ID = 'GTM-NC5BDRF3';          // your GTM id
const CHAT_SOUND_URL = 'live-chat-353605.mp3'; // update path if needed
const ENABLE_FANCY_CHAT = true;         // set to false to keep only simple behavior

/* ================= GTM INJECTION (CSP-safe) ================= */
(function injectGTM(id) {
  if (!id) return;
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
})(GTM_ID);

/* ================= HELPERS ================= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const onReady = (fn) => {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
  else fn();
};
const safeTimeout = (fn, ms) => setTimeout(fn, ms); // safe non-string wrapper

/* ================= MAIN ================= */
onReady(() => {
  /* --------- Menu toggle --------- */
  const menuToggle = $('#menu-toggle');
  const navMenu = $('#nav-menu');
  if (menuToggle && navMenu) menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));

  /* --------- Theme toggle (prefers + manual) --------- */
  const themeBtn = $('#theme-toggle-btn');
  const root = document.documentElement;
  const storedTheme = localStorage.getItem('site-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'dark'); // default to dark as requested

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
      themeBtn.textContent = t === 'dark' ? '🌙' : '☀️';
    }
  }
  applyTheme(initialTheme);
  if (themeBtn) themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('site-theme', next);
    applyTheme(next);
  });

  /* --------- Reveal animations (IntersectionObserver) --------- */
  const animNodes = $$('[data-animate]');
  if ('IntersectionObserver' in window && animNodes.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    animNodes.forEach(n => io.observe(n));
  } else {
    animNodes.forEach(n => n.classList.add('visible'));
  }

  /* --------- Skill circles (SVG donut) --------- */
  const skillEls = $$('.skill-circle');
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
    fg.setAttribute('stroke-dasharray', c); fg.setAttribute('stroke-dashoffset', c);

    svg.appendChild(bg); svg.appendChild(fg);

    // animate in next frame
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

  /* --------- Smooth internal anchors --------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (ev) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        ev.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* --------- Contact button smooth scroll ---------- */
  const contactBtn = $('#contactBtn');
  if (contactBtn) {
    contactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      $('#contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      $('#contact')?.setAttribute('tabindex', '-1');
      $('#contact')?.focus({ preventScroll: true });
    });
  }

  /* --------- Scroll to top button ---------- */
  const scrollBtn = $('#scrollTopBtn');
  if (scrollBtn) {
    // show/hide on scroll
    window.addEventListener('scroll', () => {
      scrollBtn.style.display = window.scrollY > 220 ? 'block' : 'none';
    });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* --------- Contact form (client-side fallback) ---------- */
  const contactForm = $('#contactForm');
  if (contactForm) {
    const msgNode = contactForm.querySelector('.form-message');
    contactForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const name = (contactForm.name.value || '').trim();
      const email = (contactForm.email.value || '').trim();
      const message = (contactForm.message.value || '').trim();
      if (!name || !email || !message) {
        if (msgNode) { msgNode.textContent = 'Please fill name, email and message.'; msgNode.classList.add('error'); }
        return;
      }
      if (msgNode) { msgNode.textContent = 'Preparing email…'; msgNode.classList.remove('error'); }
      const subject = encodeURIComponent(contactForm.subject.value.trim() || 'Website contact');
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      // mailto fallback
      window.location.href = `mailto:muhammadaffaf746@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  /* ================= CHATBOT ================= */
  // Elements
  const chatbotToggle = $('#chatbot-toggle');
  const chatbotWindow = $('#chatbot-window');
  const chatbotClose = $('#chatbot-close');
  const chatbotBody = $('#chatbot-body');
  const chatbotInput = $('#chatbot-input');
  const chatbotSend = $('#chatbot-send');
  const quickReplies = $$('.quick-reply');
  // Load sound if present
  let chatAudio = null;
  (function loadChatSound(url) {
    try {
      chatAudio = new Audio(url);
      // small attempt to preload without playing
      chatAudio.preload = 'auto';
    } catch (err) {
      chatAudio = null;
      console.warn('Chat sound not available', err);
    }
  })(CHAT_SOUND_URL);

  // Simple append helpers
  function createMsgNode(text, cls = 'bot-message') {
    const d = document.createElement('div');
    d.className = cls;
    d.textContent = text;
    return d;
  }
  function addUserMsg(text) {
    chatbotBody.appendChild(createMsgNode(text, 'user-message'));
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  }
  function addBotMsg(text) {
    chatbotBody.appendChild(createMsgNode(text, 'bot-message'));
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
    if (chatAudio) { try { chatAudio.currentTime = 0; chatAudio.play().catch(()=>{}); } catch(_){} }
  }

  // Lightweight bot "AI" (local rules)
  function botReplyTo(input) {
    const q = (input || '').toLowerCase();
    if (q.includes('project')) return 'See Projects section or https://github.com/affaf12';
    if (q.includes('contact') || q.includes('email')) return 'Email: muhammadaffaf746@gmail.com';
    if (q.includes('resume')) return 'You can download my resume from the Resume button in the Hero section.';
    if (q.includes('hello') || q.includes('hi')) return 'Hello 👋 — how can I help? Try "Show projects" or "Contact info".';
    return "I’m a lightweight helper bot. Try: 'Show projects', 'Contact info' or 'Hi'.";
  }

  // Fancy chat mode: animated typing + bubble reveal
  function fancyReplyFlow(userText) {
    // create typing bubble
    const typing = document.createElement('div');
    typing.className = 'bot-typing';
    typing.textContent = '';
    typing.setAttribute('aria-hidden', 'true');
    chatbotBody.appendChild(typing);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;

    // animate "typing" dots using requestAnimationFrame
    let start = performance.now();
    let dots = 0;
    let rafId = null;
    function animate(now) {
      const elapsed = now - start;
      if (elapsed > 600) { start = now; dots = (dots + 1) % 4; }
      typing.textContent = 'Typing' + '.'.repeat(dots);
      rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);

    // after a short delay compute reply and show
    safeTimeout(() => {
      if (rafId) cancelAnimationFrame(rafId);
      typing.remove();
      const reply = botReplyTo(userText);
      // build animated bubble
      const bubble = document.createElement('div'); bubble.className = 'bot-message fancy';
      bubble.textContent = '';
      chatbotBody.appendChild(bubble);
      // type text into bubble character-by-character
      let idx = 0;
      function typeChunk() {
        if (idx < reply.length) {
          bubble.textContent += reply[idx++];
          chatbotBody.scrollTop = chatbotBody.scrollHeight;
          safeTimeout(typeChunk, 18); // non-string safe timer
        } else {
          // play sound on complete
          if (chatAudio) { try { chatAudio.currentTime = 0; chatAudio.play().catch(()=>{}); } catch(_){} }
        }
      }
      typeChunk();
    }, 700);
  }

  // Non-fancy reply
  function simpleReplyFlow(userText) {
    safeTimeout(() => addBotMsg(botReplyTo(userText)), 420);
  }

  // Toggle chatbot
  if (chatbotToggle && chatbotWindow) {
    chatbotToggle.addEventListener('click', () => {
      if (chatbotWindow.hasAttribute('hidden')) {
        chatbotWindow.removeAttribute('hidden');
        // announce or focus
        const input = $('#chatbot-input'); if (input) input.focus();
      } else chatbotWindow.setAttribute('hidden', '');
    });
  }
  if (chatbotClose) chatbotClose.addEventListener('click', () => chatbotWindow.setAttribute('hidden', ''));

  // Send handler
  if (chatbotSend && chatbotInput) {
    chatbotSend.addEventListener('click', () => {
      const txt = (chatbotInput.value || '').trim();
      if (!txt) return;
      addUserMsg(txt);
      chatbotInput.value = '';
      // choose fancy or simple accordingly
      if (ENABLE_FANCY_CHAT) fancyReplyFlow(txt);
      else simpleReplyFlow(txt);
    });
    chatbotInput.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); chatbotSend.click(); }
    });
  }

  // quick replies
  quickReplies.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const txt = e.target.textContent.trim();
      addUserMsg(txt);
      if (ENABLE_FANCY_CHAT) fancyReplyFlow(txt); else simpleReplyFlow(txt);
    });
  });

  // accessibility: close chatbot on Escape
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') chatbotWindow?.setAttribute('hidden', ''); });

  /* ========= end onReady ========= */
}); // onReady end

/* ================= NOTES =================
 - This file avoids eval/new Function and string timers.
 - If you previously had 'unload' listeners or deprecated features, they are removed.
 - To disable fancy animations, set ENABLE_FANCY_CHAT = false above.
 - If chat audio fails to play due to autoplay policies, it will play after user gestures (common browser behavior).
 - If you need me to tone down animations or change timings, tell me which part to tweak.
======================================== */
