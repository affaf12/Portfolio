/* ================= DOM ELEMENTS ================= */
const hamburger = document.getElementById('hamburger');
const menu = document.querySelector('.menu');
const themeBtn = document.getElementById('theme-toggle');
const scrollBtn = document.getElementById('scrollTopBtn');
const chatIcon = document.getElementById('chatIcon');
const chatbot = document.getElementById('chatbot');
const chatClose = document.getElementById('chatbot-close');
const chatMinimize = document.querySelector('.chatbot-minimize');

/* ================= HAMBURGER MENU TOGGLE ================= */
hamburger.addEventListener('click', () => {
  const hamIcon = hamburger.querySelector('.hamburger-icon');
  const crossIcon = hamburger.querySelector('.cross-icon');
  menu.classList.toggle('active');
  hamIcon.classList.toggle('hidden');
  crossIcon.classList.toggle('hidden');
});

/* ================= THEME TOGGLE ================= */
themeBtn.addEventListener('click', () => {
  const html = document.documentElement;
  const isDark = html.dataset.theme === 'dark';
  html.dataset.theme = isDark ? 'light' : 'dark';
  themeBtn.innerHTML = isDark ? "<i class='bx bx-sun'></i>" : "<i class='bx bx-moon'></i>";
});

/* ================= SCROLL TO TOP BUTTON ================= */
window.addEventListener('scroll', () => {
  scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
});

scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ================= CHATBOT TOGGLE ================= */
chatIcon.addEventListener('click', () => {
  chatbot.style.display = 'flex';
  chatbot.setAttribute('aria-hidden', 'false');
});

chatClose.addEventListener('click', () => {
  chatbot.style.display = 'none';
  chatbot.setAttribute('aria-hidden', 'true');
});

chatMinimize.addEventListener('click', () => {
  chatbot.classList.toggle('chatbot-minimized');
});

/* ================= SCROLL ANIMATIONS ================= */
const animatedElements = document.querySelectorAll('[data-animate]');
const animateOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.85;
  animatedElements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < triggerBottom) {
      el.classList.add('animate');
    } else {
      el.classList.remove('animate');
    }
  });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);
