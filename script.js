// ================== PORTFOLIO MAIN JS (FULLY UPGRADED) ==================
(() => {
  "use strict";

  // ===== HEADER & NAV =====
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  menuToggle?.addEventListener("click", () => navMenu.classList.toggle("active"));

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    // Sticky header
    header?.classList.toggle("sticky", scrollY > 50);

    // Active nav links
    document.querySelectorAll("section[id]").forEach(sec => {
      const top = sec.offsetTop - 70;
      const bottom = top + sec.offsetHeight;
      const link = document.querySelector(`#nav-menu a[href="#${sec.id}"]`);
      link?.classList.toggle("active", scrollY >= top && scrollY < bottom);
    });
  });

  // ===== THEME TOGGLE =====
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

 <style>

 
 
 /* ===== TYPING TEXT WITH CURSOR ===== */
#typing-text::after {
  content: "|";
  display: inline-block;
  margin-left: 2px;
  animation: blink 0.7s infinite;
}

@keyframes blink {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0; }
}

/* ===== FADE EFFECT FOR TYPING TEXT ===== */
#typing-text {
  display: inline-block;
  opacity: 0;
  transition: opacity 0.3s ease;
}
#typing-text.visible {
  opacity: 1;
}

/* ===== HERO BUTTONS ANIMATION ===== */
.hero-buttons .btn {
  opacity: 0;
  transform: translateX(50px);
  transition: all 0.8s ease-out;
}

.hero-buttons.visible .btn {
  opacity: 1;
  transform: translateX(0);
}

/* Stagger effect for multiple buttons */
.hero-buttons .btn:nth-child(1) { transition-delay: 0.2s; }
.hero-buttons .btn:nth-child(2) { transition-delay: 0.4s; }

// ===== HERO TYPING EFFECT WITH PAUSE & CURSOR =====
const typingText = document.getElementById("typing-text");
const words = ["Data Analyst", "Power BI Developer", "Python Enthusiast"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 120;
const deletingSpeed = 50;
const delayBetweenWords = 1200;
const fadeOutDelay = 600; // Small pause before deleting

function typeEffect() {
  if (!typingText) return;
  const currentWord = words[wordIndex];

  // Show fade-in
  typingText.classList.add("visible");

  // Add or remove characters
  if (isDeleting) {
    typingText.textContent = currentWord.substring(0, charIndex--);
  } else {
    typingText.textContent = currentWord.substring(0, charIndex++);
  }

  // Word completed
  if (!isDeleting && charIndex > currentWord.length) {
    setTimeout(() => {
      isDeleting = true;
      typeEffect();
    }, fadeOutDelay + delayBetweenWords);
    return;
  }

  // Word deleted
  if (isDeleting && charIndex < 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(typeEffect, 300);
    return;
  }

  setTimeout(typeEffect, isDeleting ? deletingSpeed : typingSpeed);
}

// ===== HERO BUTTONS SLIDE-IN =====
window.addEventListener("DOMContentLoaded", () => {
  typeEffect(); // Start typing effect

  const heroButtons = document.querySelector(".hero-buttons");
  if (heroButtons) {
    setTimeout(() => {
      heroButtons.classList.add("visible");
    }, 500); // Delay after page load
  }
});


  // ===== SCROLL REVEAL =====
  const animateItems = document.querySelectorAll("[data-animate]");
  function revealOnScroll() {
    const screenPos = window.innerHeight * 0.85;
    animateItems.forEach(el => {
      if (el.getBoundingClientRect().top < screenPos) el.classList.add("visible");
    });
  }
  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

  // ===== SKILL CIRCLES DYNAMIC ANIMATION =====
  const skillAnimationDuration = 1500; // in ms
  document.querySelectorAll(".skill").forEach(skill => {
    const percent = parseInt(skill.dataset.level, 10) || 0;
    const circle = skill.querySelector(".skill-circle");
    const label = skill.querySelector(".skill-percent");

    let start = null;
    function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / skillAnimationDuration, 1);
      const currentPercent = Math.floor(progress * percent);

      if (circle) {
        circle.style.background = `conic-gradient(var(--accent) 0deg, var(--accent) ${currentPercent * 3.6}deg, rgba(255,255,255,0.1) ${currentPercent * 3.6}deg 360deg)`;
      }
      if (label) label.textContent = `${currentPercent}%`;

      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
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
