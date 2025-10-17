// ================== PORTFOLIO MAIN JS (UPGRADED) ==================
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

    // Active nav links on scroll
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

  // ===== HERO TYPING EFFECT =====
  const typingText = document.getElementById("typing-text");
  const words = ["Data Analyst", "Power BI Developer", "Python Enthusiast"];
  let ti = 0, tj = 0, isDeleting = false;

  (function typeEffect() {
    if (!typingText) return;
    const word = words[ti];
    typingText.textContent = isDeleting ? word.substring(0, tj--) : word.substring(0, tj++);

    const delay = isDeleting ? 50 : 120;

    if (!isDeleting && tj > word.length) { 
      isDeleting = true; 
      setTimeout(typeEffect, 1200); 
      return; 
    }
    if (isDeleting && tj < 0) { 
      isDeleting = false; 
      ti = (ti + 1) % words.length; 
      setTimeout(typeEffect, 300); 
      return; 
    }

    setTimeout(typeEffect, delay);
  })();

  // ===== SCROLL REVEAL =====
  const animateItems = document.querySelectorAll("section");
  function revealOnScroll() {
    const screenPos = window.innerHeight * 0.85;
    animateItems.forEach(el => {
      if (el.getBoundingClientRect().top < screenPos) {
        el.classList.add("visible");
      }
    });
  }
  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

  // ===== SKILL CIRCLES =====
  document.querySelectorAll(".skill").forEach(skill => {
    const level = parseInt(skill.dataset.level, 10) || 0;
    skill.style.position = "relative";
    const label = document.createElement("div");
    label.style.position = "absolute";
    label.style.bottom = "-25px";
    label.style.left = "50%";
    label.style.transform = "translateX(-50%)";
    label.style.fontSize = "14px";
    label.textContent = "0%";
    skill.appendChild(label);

    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      label.textContent = `${count}%`;
      if (count >= level) clearInterval(interval);
    }, 20);
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
  chatbotInput?.addEventListener("keypress", (e) => { if (e.key === "Enter") sendChatMessage(); });

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
