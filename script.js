// ================== PRELOADER ==================
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) preloader.classList.add('fade-out');
  setTimeout(() => preloader && preloader.remove(), 800);
});

// ================== HEADER & NAV ==================
const header = document.getElementById('header');
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));

window.addEventListener('scroll', () => {
  header.classList.toggle('sticky', window.scrollY > 50);
  document.querySelectorAll('section[id]').forEach(section => {
    const top = section.offsetTop - 60;
    const bottom = top + section.offsetHeight;
    const link = document.querySelector(`#nav-menu a[href="#${section.id}"]`);
    if (link) link.classList.toggle('active', window.scrollY >= top && window.scrollY < bottom);
  });
});

// ================== THEME TOGGLE ==================
const themeBtn = document.getElementById('theme-toggle-btn');
themeBtn.addEventListener('click', () => {
  const isDark = document.documentElement.dataset.theme === 'dark';
  document.documentElement.dataset.theme = isDark ? 'light' : 'dark';
  themeBtn.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', document.documentElement.dataset.theme);
});
if (localStorage.getItem('theme')) {
  document.documentElement.dataset.theme = localStorage.getItem('theme');
  themeBtn.textContent = document.documentElement.dataset.theme === 'dark' ? '🌙' : '☀️';
}

// ================== HERO TYPING ==================
const typingText = document.getElementById('typing-text');
const words = ["Data Analyst", "Power BI Developer", "Python Enthusiast"];
let ti = 0, tj = 0, isDeleting = false;

function typeEffect() {
  const currentWord = words[ti];
  typingText.textContent = isDeleting ? currentWord.substring(0, tj--) : currentWord.substring(0, tj++);
  if (!isDeleting && tj > currentWord.length) {
    isDeleting = true;
    setTimeout(typeEffect, 1200);
  } else if (isDeleting && tj < 0) {
    isDeleting = false;
    ti = (ti + 1) % words.length;
    setTimeout(typeEffect, 300);
  } else {
    setTimeout(typeEffect, isDeleting ? 50 : 120);
  }
}
typeEffect();

// ================== ABOUT STATS ==================
document.querySelectorAll('.about-stats h3').forEach(stat => {
  const target = parseInt(stat.textContent, 10) || 0;
  let count = 0;
  const step = Math.max(1, Math.floor(target / 80));
  const interval = setInterval(() => {
    count += step;
    stat.textContent = count >= target ? target + '+' : count + '+';
    if (count >= target) clearInterval(interval);
  }, 18);
});

// ================== SCROLL REVEAL ==================
const animateItems = document.querySelectorAll('[data-animate]');
function revealOnScroll() {
  const screenPos = window.innerHeight * 0.85;
  animateItems.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < screenPos) el.classList.add('visible', 'fade-in');
  });
}
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// ================== SKILL CIRCLES (UPGRADED: % INSIDE CIRCLE) ==================
document.querySelectorAll('.skill-circle').forEach(circle => {
  const level = parseInt(circle.dataset.level, 10) || 0;
  const size = 120; // SVG size
  const strokeWidth = 10;
  const radius = (size / 2) - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);

  // Background
  const bg = document.createElementNS(svgNS, 'circle');
  bg.setAttribute('cx', size/2);
  bg.setAttribute('cy', size/2);
  bg.setAttribute('r', radius);
  bg.setAttribute('fill', 'none');
  bg.setAttribute('stroke', 'rgba(255,255,255,0.06)');
  bg.setAttribute('stroke-width', strokeWidth);

  // Foreground
  const fg = document.createElementNS(svgNS, 'circle');
  fg.setAttribute('cx', size/2);
  fg.setAttribute('cy', size/2);
  fg.setAttribute('r', radius);
  fg.setAttribute('fill', 'none');
  fg.setAttribute('stroke', 'var(--accent)');
  fg.setAttribute('stroke-width', strokeWidth);
  fg.setAttribute('stroke-linecap', 'round');
  fg.setAttribute('stroke-dasharray', circumference);
  fg.setAttribute('stroke-dashoffset', circumference);
  fg.style.transform = 'rotate(-90deg)';
  fg.style.transformOrigin = '50% 50%';
  fg.style.transition = 'stroke-dashoffset 1.5s ease-out';

  svg.append(bg, fg);
  circle.appendChild(svg);

  // Percentage label in the middle
  const label = document.createElement('div');
  label.className = 'skill-percent';
  label.style.position = 'absolute';
  label.style.top = '50%';
  label.style.left = '50%';
  label.style.transform = 'translate(-50%, -50%)';
  label.style.fontWeight = '600';
  label.style.fontSize = '1rem';
  label.textContent = '0%';
  circle.style.position = 'relative';
  circle.appendChild(label);

  // Animate circle & number
  setTimeout(() => fg.style.strokeDashoffset = circumference * (1 - level / 100), 100);

  let count = 0;
  const step = Math.max(1, Math.floor(level / 70));
  const interval = setInterval(() => {
    count += step;
    if (count >= level) count = level;
    label.textContent = count + '%';
    if (count >= level) clearInterval(interval);
  }, 18);
});

// ================== HORIZONTAL SLIDERS ==================
function initSlider(wrapperSel, leftBtnSel, rightBtnSel) {
  const wrapper = document.querySelector(wrapperSel);
  const left = document.querySelector(leftBtnSel);
  const right = document.querySelector(rightBtnSel);
  if (!wrapper || !left || !right) return;

  left.addEventListener('click', () => wrapper.scrollBy({ left: -320, behavior: 'smooth' }));
  right.addEventListener('click', () => wrapper.scrollBy({ left: 320, behavior: 'smooth' }));

  Array.from(wrapper.children).forEach(item => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('slide-in', 'fade-in');
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }
      });
    }, { threshold: 0.1 });
    observer.observe(item);
  });
}
initSlider('.achievements-wrapper', '.ach-left-btn', '.ach-right-btn');
initSlider('.projects-wrapper', '.left-btn', '.right-btn');

// ================== CONTACT FORM ==================
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const messageEl = contactForm.querySelector('.form-message');
  if (!contactForm.name.value || !contactForm.email.value || !contactForm.message.value) {
    messageEl.textContent = 'Please fill all required fields.';
    messageEl.className = 'form-message error';
  } else {
    messageEl.textContent = 'Message sent successfully!';
    messageEl.className = 'form-message success';
    contactForm.reset();
  }
});

// ================== SCROLL TO TOP ==================
const scrollBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => scrollBtn.classList.toggle('show', window.scrollY > 400));
scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ================== CHATBOT ==================
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotBody = document.getElementById('chatbot-body');

chatbotToggle.addEventListener('click', () => chatbotWindow.classList.toggle('open'));
chatbotClose.addEventListener('click', () => chatbotWindow.classList.remove('open'));

document.querySelectorAll('.quick-reply').forEach(btn => {
  btn.addEventListener('click', () => {
    const userMsg = document.createElement('div');
    userMsg.className = 'chatbot-message user';
    userMsg.textContent = btn.textContent;

    const botMsg = document.createElement('div');
    botMsg.className = 'chatbot-message bot';
    if (btn.textContent.toLowerCase().includes("project")) {
      botMsg.textContent = "Here are my projects: Coffee Shop Dashboard, Backpack Price Prediction, Insurance Claims Analysis, Logistics Network Optimization.";
    } else if (btn.textContent.toLowerCase().includes("contact")) {
      botMsg.textContent = "You can reach me at muhammadaffaf746@gmail.com or via LinkedIn/GitHub/WhatsApp.";
    } else {
      botMsg.textContent = "Hello 👋! How can I help you today?";
    }

    chatbotBody.append(userMsg, botMsg);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  });
});

// ================== LAZY LOAD IMAGES ==================
document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = document.querySelectorAll('img[data-src]');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        obs.unobserve(img);
      }
    });
  }, { rootMargin: "100px" });
  lazyImages.forEach(img => observer.observe(img));
});
