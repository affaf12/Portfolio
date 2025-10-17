/* js/script.js
   CSP-safe site script:
   - Injects GTM (no inline scripts)
   - Handles menu, theme toggle, reveal animations
   - Skill circle rendering
   - Contact form (client-side feedback)
   - Chatbot (simple local quick replies)
   - Scroll-to-top button
*/

/* ========== Configuration ========== */
const GTM_ID = 'GTM-NC5BDRF3'; // <-- keep your GTM id
const SKILL_CIRCLES_SELECTOR = '.skill-circle';

/* ========== GTM (inject script) ========== */
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

/* ========== Utility ========== */
function $(sel, root = document) { return root.querySelector(sel); }
function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
function onReady(fn) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
  else fn();
}

/* ========== DOM Ready Work ========== */
onReady(() => {
  /* ---------- Menu Toggle ---------- */
  const menuToggle = $('#menu-toggle');
  const navMenu = $('#nav-menu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
  }

  /* ---------- Theme toggle & prefers-color-scheme ---------- */
  const themeBtn = $('#theme-toggle-btn');
  const root = document.documentElement;
  const stored = localStorage.getItem('site-theme');

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    themeBtn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
    themeBtn.textContent = (t === 'dark') ? '🌙' : '☀️';
  }

  // initial: stored -> prefers -> default dark
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(stored || (prefersDark ? 'dark' : 'light'));

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const newTheme = (root.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
      localStorage.setItem('site-theme', newTheme);
      applyTheme(newTheme);
    });
  }

  /* ---------- Reveal animations using IntersectionObserver ---------- */
  const animated = $all('[data-animate]');
  if ('IntersectionObserver' in window && animated.length) {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          o.unobserve(en.target);
        }
      });
    }, { root: null, threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    animated.forEach(el => obs.observe(el));
  } else {
    animated.forEach(el => el.classList.add('visible'));
  }

  /* ---------- Skill circles (SVG donut) ---------- */
  function createSkillSVG(level) {
    const size = 88;
    const stroke = 8;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);

    // background circle
    const bg = document.createElementNS(svg.namespaceURI, 'circle');
    bg.setAttribute('cx', size / 2);
    bg.setAttribute('cy', size / 2);
    bg.setAttribute('r', radius);
    bg.setAttribute('stroke-width', stroke);
    bg.setAttribute('fill', 'none');
    bg.setAttribute('class', 'skill-bg');

    // progress circle
    const fg = document.createElementNS(svg.namespaceURI, 'circle');
    fg.setAttribute('cx', size / 2);
    fg.setAttribute('cy', size / 2);
    fg.setAttribute('r', radius);
    fg.setAttribute('stroke-width', stroke);
    fg.setAttribute('fill', 'none');
    fg.setAttribute('stroke-dasharray', circumference);
    fg.setAttribute('stroke-dashoffset', circumference);
    fg.setAttribute('class', 'skill-fg');

    svg.appendChild(bg);
    svg.appendChild(fg);

    // animate stroke offset
    requestAnimationFrame(() => {
      const offset = circumference * (1 - Math.max(0, Math.min(100, level)) / 100);
      fg.style.transition = 'stroke-dashoffset 1100ms cubic-bezier(.2,.9,.3,1)';
      fg.style.strokeDashoffset = offset;
    });

    return svg;
  }

  $all(SKILL_CIRCLES_SELECTOR).forEach(el => {
    const level = parseInt(el.getAttribute('data-level')) || 0;
    const skill = el.getAttribute('data-skill') || '';
    // Clear container then append svg + percent
    el.innerHTML = '';
    el.appendChild(createSkillSVG(level));
    const lab = document.createElement('div');
    lab.className = 'skill-percent';
    lab.textContent = `${level}%`;
    el.appendChild(lab);
  });

  /* ---------- Contact button smooth scroll ---------- */
  const contactBtn = $('#contactBtn');
  if (contactBtn) {
    contactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      $('#contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      $('#contact')?.setAttribute('tabindex', '-1');
      $('#contact')?.focus({ preventScroll: true });
    });
  }

  /* ---------- Scroll to top button ---------- */
  const scrollTopBtn = $('#scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.style.display = (window.scrollY > 220) ? 'block' : 'none';
    });
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Contact form (client-side UX) ---------- */
  const contactForm = $('#contactForm');
  if (contactForm) {
    const formMessage = contactForm.querySelector('.form-message');
    contactForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      // Basic client side validation
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();
      if (!name || !email || !message) {
        formMessage.textContent = 'Please complete name, email and message.';
        formMessage.classList.add('error');
        return;
      }
      // Feedback to user (since no backend configured)
      formMessage.textContent = 'Thanks — message prepared. Opening mail client...';
      formMessage.classList.remove('error');
      // fallback: open mailto so you receive message via email
      const subject = encodeURIComponent(contactForm.subject.value.trim() || 'Website contact');
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:muhammadaffaf746@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  /* ---------- Simple achievements / portfolio slider placeholders ---------- */
  // (If you later provide arrays of items, plug them into the wrapper. For now, minimal nav support.)
  const leftBtn = $('.left-btn');
  const rightBtn = $('.right-btn');
  let projectIndex = 0;
  if (leftBtn && rightBtn) {
    leftBtn.addEventListener('click', () => { projectIndex = Math.max(0, projectIndex - 1); });
    rightBtn.addEventListener('click', () => { projectIndex += 1; });
  }

  /* ========== Chatbot (local, light) ========== */
  const chatbotToggle = $('#chatbot-toggle');
  const chatbotWindow = $('#chatbot-window');
  const chatbotClose = $('#chatbot-close');
  const chatbotBody = $('#chatbot-body');
  const chatbotInput = $('#chatbot-input');
  const chatbotSend = $('#chatbot-send');
  const quickReplies = $all('.quick-reply');

  function appendBotMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'bot-message';
    msg.textContent = text;
    chatbotBody.appendChild(msg);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  }

  function appendUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'user-message';
    msg.textContent = text;
    chatbotBody.appendChild(msg);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  }

  function botReplyTo(input) {
    const lc = input.toLowerCase();
    if (lc.includes('project')) {
      return 'You can view my projects in the Projects section or on my GitHub: https://github.com/affaf12';
    }
    if (lc.includes('contact') || lc.includes('email')) {
      return 'Email me at muhammadaffaf746@gmail.com or use the contact form on the site.';
    }
    if (lc.includes('hi') || lc.includes('hello') || lc.includes('hey')) {
      return 'Hello 👋 — how can I help? Try "Show projects" or "Contact info".';
    }
    // default fallback
    return "Sorry, I don't have a backend — this is a lightweight helper. Try: 'Show projects', 'Contact info', or 'Hi'.";
  }

  if (chatbotToggle && chatbotWindow) {
    chatbotToggle.addEventListener('click', () => {
      const open = chatbotWindow.hasAttribute('hidden');
      if (open) chatbotWindow.removeAttribute('hidden'); else chatbotWindow.setAttribute('hidden', '');
    });
  }

  if (chatbotClose) {
    chatbotClose.addEventListener('click', () => chatbotWindow.setAttribute('hidden', ''));
  }

  if (chatbotSend && chatbotInput) {
    chatbotSend.addEventListener('click', () => {
      const text = chatbotInput.value.trim();
      if (!text) return;
      appendUserMessage(text);
      chatbotInput.value = '';
      // Typing indicator
      const typing = document.createElement('div');
      typing.className = 'typing';
      typing.textContent = 'Typing...';
      chatbotBody.appendChild(typing);
      chatbotBody.scrollTop = chatbotBody.scrollHeight;
      setTimeout(() => {
        typing.remove();
        appendBotMessage(botReplyTo(text));
      }, 800);
    });

    chatbotInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatbotSend.click();
      }
    });
  }

  quickReplies.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const text = e.target.textContent.trim();
      appendUserMessage(text);
      setTimeout(() => appendBotMessage(botReplyTo(text)), 600);
    });
  });

  /* Accessibility: smooth internal link behavior */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* Basic keyboard close for chatbot */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') chatbotWindow?.setAttribute('hidden', '');
  });

}); // onReady end
