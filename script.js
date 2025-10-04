// =================== UTILITY FUNCTIONS ===================
const fadeIn = (el, display = "flex", duration = 200) => {
  el.style.display = display;
  el.style.opacity = 0;
  let last = +new Date();
  const tick = () => {
    el.style.opacity = +el.style.opacity + (new Date() - last) / duration;
    last = +new Date();
    if (+el.style.opacity < 1) requestAnimationFrame(tick);
  };
  tick();
};

const fadeOut = (el, duration = 200) => {
  el.style.opacity = 1;
  let last = +new Date();
  const tick = () => {
    el.style.opacity = +el.style.opacity - (new Date() - last) / duration;
    last = +new Date();
    if (+el.style.opacity > 0) requestAnimationFrame(tick);
    else el.style.display = "none";
  };
  tick();
};

// =================== THEME TOGGLE ===================
const themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click', () => {
  const html = document.documentElement;
  if (html.dataset.theme === 'dark') {
    html.dataset.theme = 'light';
    themeBtn.innerHTML = "<i class='bx bx-sun'></i>";
  } else {
    html.dataset.theme = 'dark';
    themeBtn.innerHTML = "<i class='bx bx-moon'></i>";
  }
});

// =================== NAVBAR TOGGLE ===================
const menuIcon = document.getElementById('menu-icon');
const navbar = document.querySelector('.navbar');
menuIcon.addEventListener('click', () => menuIcon.classList.toggle('bx-x'));
menuIcon.addEventListener('click', () => navbar.classList.toggle('active'));

// Close navbar on scroll
window.addEventListener('scroll', () => {
  menuIcon.classList.remove('bx-x');
  navbar.classList.remove('active');
});

// =================== SCROLL TO TOP ===================
const scrollBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
});
scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// =================== SMOOTH SCROLL FOR ANCHORS ===================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target?.scrollIntoView({ behavior: 'smooth' });
  });
});

// =================== SCROLL REVEAL ===================
if (typeof ScrollReveal !== "undefined") {
  const sr = ScrollReveal({ distance: "25px", duration: 400, reset: true });
  sr.reveal(".home-text, .about, .experience, .skills, .achievement, .portfolio, .contact", { delay: 150, origin: "bottom" });
}

// =================== CHATBOT FUNCTIONALITY ===================
const chatIcon = document.getElementById('chatIcon');
const chatbot = document.getElementById('chatbot');
const chatClose = document.getElementById('chatbot-close');
const chatMinimize = document.querySelector('.chatbot-minimize');

chatIcon.addEventListener('click', () => {
  fadeIn(chatbot);
  chatbot.setAttribute('aria-hidden', 'false');
});

chatClose.addEventListener('click', () => {
  fadeOut(chatbot);
  chatbot.setAttribute('aria-hidden', 'true');
});

chatMinimize?.addEventListener('click', () => {
  chatbot.classList.toggle('chatbot-minimized');
});


// ================= SCROLL ANIMATIONS =================
const animateElements = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.2 }
);

animateElements.forEach(el => observer.observe(el));

// ================= NAVBAR ACTIVE LINK ON SCROLL =================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar li a');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80;
    const sectionHeight = section.offsetHeight;
    if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});



