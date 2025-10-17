// ================== PORTFOLIO MAIN JS (FULLY UPGRADED) ==================
(() => {
  "use strict";

  // ================= HEADER & NAV =================
const header = document.getElementById("header");
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

// Mobile menu toggle
menuToggle?.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

// Scroll events: sticky header & active link
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  // Sticky header
  header?.classList.toggle("sticky", scrollY > 50);

  // Active nav links
  document.querySelectorAll("section[id]").forEach(section => {
    const top = section.offsetTop - header.offsetHeight - 5; // header offset
    const bottom = top + section.offsetHeight;
    const link = document.querySelector(`#nav-menu a[href="#${section.id}"]`);
    if (link) {
      link.classList.toggle("active", scrollY >= top && scrollY < bottom);
    }
  });
});

// ================= THEME TOGGLE =================
const themeBtn = document.getElementById("theme-toggle-btn");
const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.dataset.theme = savedTheme;
themeBtn.textContent = savedTheme === "dark" ? "🌙" : "☀️";

themeBtn?.addEventListener("click", () => {
  const isDark = document.documentElement.dataset.theme === "dark";
  document.documentElement.dataset.theme = isDark ? "light" : "dark";
  themeBtn.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", document.documentElement.dataset.theme);
});

  
  
  
  document.addEventListener("DOMContentLoaded", () => {
  // ================= HERO TYPING EFFECT =================
  const typingText = document.getElementById("typing-text");
  const words = ["Data Analyst", "Business Analyst", "Power BI Developer", "Python Enthusiast"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 120;
  const deletingSpeed = 50;
  const delayAfterWord = 1200; // pause at end of word
  const nextWordDelay = 500;

  // Get hero buttons
  const heroButtons = document.querySelectorAll(".hero-buttons .btn.slide-in");

  function typeEffect() {
    if (!typingText) return;

    const currentWord = words[wordIndex];

    // Add or remove characters
    if (isDeleting) {
      charIndex--;
      typingText.textContent = currentWord.substring(0, charIndex);
    } else {
      charIndex++;
      typingText.textContent = currentWord.substring(0, charIndex);
    }

    let timeout = isDeleting ? deletingSpeed : typingSpeed;

    // Check if word finished typing
    if (!isDeleting && charIndex === currentWord.length) {
      timeout = delayAfterWord;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex++;

      // When one full cycle is completed
      if (wordIndex >= words.length) {
        wordIndex = 0;

        // Show hero buttons with staggered animation
        heroButtons.forEach((btn, index) => {
          setTimeout(() => btn.classList.add("visible"), index * 200);
        });
      }
      timeout = nextWordDelay;
    }

    setTimeout(typeEffect, timeout);
  }

  typeEffect();

  // ================= HERO BUTTONS INITIALIZATION =================
  heroButtons.forEach((btn) => {
    // Initially hidden and ready to slide in
    btn.classList.remove("visible");
  });

  // ================= SMOOTH SCROLL FOR NAV LINKS =================
  const header = document.getElementById("header");
  const navMenu = document.getElementById("nav-menu");

  document.querySelectorAll("#nav-menu a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const targetId = link.getAttribute("href").slice(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - (header ? header.offsetHeight : 0),
          behavior: "smooth"
        });
        if (navMenu) navMenu.classList.remove("active");
      }
    });
  });
});


  // ===== Experince section  =====
document.querySelectorAll('.experience-card').forEach(card => {
  const particleCount = 15; // particles per card
  const container = card.querySelector('.card-particles');

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    container.appendChild(particle);

    // Random initial position
    particle.style.top = Math.random() * 100 + '%';
    particle.style.left = Math.random() * 100 + '%';

    // Animate particle randomly
    const animateParticle = () => {
      const newTop = Math.random() * 100;
      const newLeft = Math.random() * 100;
      const duration = 4000 + Math.random() * 4000; // 4–8s

      particle.animate([
        { top: particle.style.top, left: particle.style.left },
        { top: newTop + '%', left: newLeft + '%' }
      ], {
        duration: duration,
        iterations: 1,
        easing: 'ease-in-out'
      }).onfinish = () => {
        particle.style.top = newTop + '%';
        particle.style.left = newLeft + '%';
        animateParticle();
      };
    };

    animateParticle();
  }
});

/* ================= FULL SKILLS NEON UPGRADE ================= */
document.addEventListener('DOMContentLoaded', () => {

  const skills = [
    { selector: '.skill-circle[data-percent="90"]', target: 90 },
    { selector: '.skill-circle[data-percent="80"]', target: 80 },
    { selector: '.skill-circle[data-percent="75"]', target: 75 },
    { selector: '.skill-circle[data-percent="85"]', target: 85 }
  ];

  skills.forEach(skill => {
    const circle = document.querySelector(skill.selector);
    const percentSpan = circle.querySelector('.skill-percent');
    const ringProgress = circle.querySelector('.ring-progress');

    const radius = ringProgress.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    ringProgress.style.strokeDasharray = circumference;
    ringProgress.style.strokeDashoffset = circumference;

    let currentPercent = 0;

    // Animate the ring from 0 to target %
    function animateRing() {
      if (currentPercent < skill.target) {
        currentPercent++;
        percentSpan.textContent = currentPercent + '%';
        const offset = circumference - (currentPercent / 100) * circumference;
        ringProgress.style.strokeDashoffset = offset;
        requestAnimationFrame(animateRing);
      } else {
        percentSpan.textContent = skill.target + '%';
      }
    }

    // Start animation with slight random delay for staggered effect
    setTimeout(animateRing, Math.random() * 500);

    // ================= NEON PARTICLES =================
    const particlesContainer = circle.querySelector('.skill-particles');
    particlesContainer.innerHTML = '';
    const particleCount = 12;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.top = Math.random() * 100 + '%';
      particle.style.left = Math.random() * 100 + '%';
      const size = Math.random() * 4 + 2;
      particle.style.width = particle.style.height = size + 'px';
      particle.style.animationDuration = (Math.random() * 6 + 4) + 's';
      particle.style.animationDelay = Math.random() * 5 + 's';
      particle.style.background = `rgba(${75 + Math.random()*180}, ${95 + Math.random()*160}, 255, ${Math.random()*0.5 + 0.3})`;
      particlesContainer.appendChild(particle);
    }

    // ================= COLOR GRADIENT & GLOW PULSE =================
    let hue = Math.random() * 360;
    let pulse = 0;

    function animateGlow() {
      hue = (hue + 1) % 360;
      ringProgress.style.stroke = `hsl(${hue}, 100%, 60%)`;
      pulse += 0.05;
      const glow = 15 + Math.sin(pulse) * 10;
      circle.style.boxShadow = `0 0 ${glow}px hsl(${hue}, 100%, 60%), inset 0 0 ${glow/2}px hsl(${hue}, 100%, 60%)`;
      requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // ================= HOVER PARTICLE EXPLOSION =================
    circle.addEventListener('mouseenter', () => {
      for (let i = 0; i < particleCount; i++) {
        const particle = particlesContainer.children[i];
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 50 + 20;
        particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
        particle.style.opacity = 0;
      }
    });
    circle.addEventListener('mouseleave', () => {
      for (let i = 0; i < particleCount; i++) {
        const particle = particlesContainer.children[i];
        particle.style.transform = `translate(0px, 0px)`;
        particle.style.opacity = 1;
      }
    });

  });

});



// ===== SCROLL TO TOP =====
  const scrollBtn = document.getElementById("scrollTopBtn");
  window.addEventListener("scroll", () => scrollBtn?.classList.toggle("show", window.scrollY > 400));
  scrollBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // ===== CHATBOT =====
  const chatbotToggle = document.getElementById("chatbot-toggle");
  const chatbotWindow = document.getElementById("chatbot-window");
  const chatbotClose = document.getElementById("chatbot-close");
  const chatbotBody = document.getElementById("chatbot-body");
  const chatbotInput = document.getElementById("chatbot-input");
  const chatbotSend = document.getElementById("chatbot-send");

  chatbotToggle?.addEventListener("click", () => chatbotWindow.classList.toggle("open"));
  chatbotClose?.addEventListener("click", () => chatbotWindow.classList.remove("open"));
  chatbotSend?.addEventListener("click", sendChatMessage);
  chatbotInput?.addEventListener("keypress", e => { if (e.key === "Enter") sendChatMessage(); });

  function sendChatMessage() {
    const msg = chatbotInput.value.trim();
    if (!msg) return;
    appendChatMessage(msg, "user");
    chatbotInput.value = "";

    setTimeout(() => {
      const botResponse = getBotResponse(msg);
      appendChatMessage(botResponse, "bot");
    }, 500);
  }

  function appendChatMessage(text, cls) {
    const div = document.createElement("div");
    div.className = `chatbot-message ${cls}`;
    div.textContent = text;
    chatbotBody.appendChild(div);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  }

  function getBotResponse(msg) {
    const m = msg.toLowerCase();
    if (m.includes("project")) return "Here are my projects: Coffee Shop Dashboard, Backpack Price Prediction, Insurance Claims Analysis, Logistics Network Optimization.";
    if (m.includes("contact")) return "You can reach me at muhammadaffaf746@gmail.com or via LinkedIn/GitHub/WhatsApp.";
    if (m.includes("hello") || m.includes("hi")) return "Hello! How can I help you today?";
    if (m.includes("bye")) return "Goodbye! Have a great day!";
    return "I am sorry, I do not understand that. Please ask about projects, skills, or contact info.";
  }

})();
