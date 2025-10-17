// ================= HEADER & NAVIGATION =================
const header = document.getElementById('header');
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

window.addEventListener('scroll', () => {
  header.classList.toggle('sticky', window.scrollY > 50);

  // Highlight nav links
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    const top = section.offsetTop - 60;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`#nav-menu a[href="#${id}"]`);
    if (window.scrollY >= top && window.scrollY < bottom) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});

// ================= THEME TOGGLE =================
const themeBtn = document.getElementById('theme-toggle-btn');
themeBtn.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeBtn.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
});
const savedTheme = localStorage.getItem('theme');
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

// ================= HERO TYPING =================
const typingText = document.getElementById('typing-text');
const words = ["Data Analyst", "Power BI Developer", "Python Enthusiast"];
let i = 0, j = 0, currentWord = '', isDeleting = false;

function type() {
  currentWord = words[i];
  typingText.textContent = isDeleting ? currentWord.substring(0, j--) : currentWord.substring(0, j++);
  if (!isDeleting && j === currentWord.length + 1) {
    isDeleting = true;
    setTimeout(type, 1000);
  } else if (isDeleting && j < 0) {
    isDeleting = false;
    i = (i + 1) % words.length;
    setTimeout(type, 200);
  } else {
    setTimeout(type, isDeleting ? 50 : 100);
  }
}
type();

// ================= ABOUT SECTION STATS =================
const stats = document.querySelectorAll('.about-stats h3');
stats.forEach(stat => {
  const target = +stat.textContent.replace(/\D/g,'');
  let count = 0;
  const step = Math.ceil(target / 100);
  const interval = setInterval(() => {
    count += step;
    stat.textContent = count > target ? target : count + '+';
    if(count >= target) clearInterval(interval);
  }, 20);
});

// ================= SCROLL REVEAL =================
const animateItems = document.querySelectorAll('[data-animate]');
function revealOnScroll() {
  animateItems.forEach(el => {
    const top = el.getBoundingClientRect().top;
    const screen = window.innerHeight * 0.85;
    if (top < screen) el.classList.add('visible');
  });
}
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// ================= SKILLS CIRCULAR PROGRESS =================
const skillCircles = document.querySelectorAll('.skill-circle');
skillCircles.forEach(circle => {
  const level = circle.dataset.level;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const bg = document.createElementNS(svg.namespaceURI, 'circle');
  const fg = document.createElementNS(svg.namespaceURI, 'circle');

  [bg, fg].forEach(c => {
    c.setAttribute('cx', 60);
    c.setAttribute('cy', 60);
    c.setAttribute('r', 54);
    c.setAttribute('fill', 'none');
  });

  bg.setAttribute('stroke', 'rgba(255,255,255,0.06)');
  bg.setAttribute('stroke-width', 10);

  fg.setAttribute('stroke', 'var(--accent)');
  fg.setAttribute('stroke-width', 10);
  fg.setAttribute('stroke-linecap', 'round');
  fg.setAttribute('stroke-dasharray', 339.292);
  fg.setAttribute('stroke-dashoffset', 339.292);

  svg.appendChild(bg);
  svg.appendChild(fg);
  circle.appendChild(svg);

  setTimeout(() => {
    fg.style.transition = 'stroke-dashoffset 1.2s ease';
    fg.style.strokeDashoffset = 339.292 * (1 - level / 100);
  }, 300);

  const percentLabel = document.createElement('div');
  percentLabel.classList.add('skill-percent');
  percentLabel.textContent = level + '%';
  circle.appendChild(percentLabel);
});

// ================= HORIZONTAL SLIDERS =================
function initSlider(wrapperSelector, leftBtn, rightBtn) {
  const wrapper = document.querySelector(wrapperSelector);
  const left = document.querySelector(leftBtn);
  const right = document.querySelector(rightBtn);

  left.addEventListener('click', () => { wrapper.scrollBy({ left: -300, behavior: 'smooth' }); });
  right.addEventListener('click', () => { wrapper.scrollBy({ left: 300, behavior: 'smooth' }); });
}
initSlider('.achievements-wrapper', '.ach-left-btn', '.ach-right-btn');
initSlider('.projects-wrapper', '.left-btn', '.right-btn');

// ================= CONTACT FORM =================
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

// ================= SCROLL TO TOP =================
const scrollBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  scrollBtn.classList.toggle('show', window.scrollY > 400);
});
scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ================= CHATBOT =================
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');

chatbotToggle.addEventListener('click', () => chatbotWindow.toggleAttribute('hidden'));
chatbotClose.addEventListener('click', () => chatbotWindow.setAttribute('hidden',''));

document.querySelectorAll('.quick-reply').forEach(btn => {
  btn.addEventListener('click', () => {
    const body = document.getElementById('chatbot-body');
    body.innerHTML += `<div class="user-message">${btn.textContent}</div>`;
    body.innerHTML += `<div class="bot-message">You clicked: ${btn.textContent}</div>`;
    body.scrollTop = body.scrollHeight;
  });
});
