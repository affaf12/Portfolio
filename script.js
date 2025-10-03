/* ================= DOM CONTENT LOADED ================= */
document.addEventListener("DOMContentLoaded", () => {

  /* ===== VARIABLES ===== */
  const header = document.querySelector("header");
  const menuIcon = document.querySelector("#menu-icon");
  const navbar = document.querySelector(".navbar");
  const themeToggle = document.querySelector(".theme-toggle");
  const body = document.body;
  const scrollBtn = document.getElementById("scrollTopBtn");
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".navbar a");

  /* ===== STICKY HEADER ===== */
  const handleStickyHeader = () => header.classList.toggle("sticky", window.scrollY > 50);
  window.addEventListener("scroll", debounce(handleStickyHeader, 20));

  /* ===== MOBILE MENU TOGGLE ===== */
  menuIcon.addEventListener("click", () => navbar.classList.toggle("active"));
  navLinks.forEach(link => link.addEventListener("click", () => navbar.classList.remove("active")));

  /* ===== THEME TOGGLE ===== */
  const savedTheme = localStorage.getItem("theme") || "dark";
  body.setAttribute("data-theme", savedTheme);
  if (savedTheme === "light") themeToggle.classList.add("light");

  themeToggle.addEventListener("click", () => {
    body.classList.add("transition");
    const newTheme = body.getAttribute("data-theme") === "light" ? "dark" : "light";
    body.setAttribute("data-theme", newTheme);
    themeToggle.classList.toggle("light");
    localStorage.setItem("theme", newTheme);
    setTimeout(() => body.classList.remove("transition"), 500);
  });

  /* ===== SCROLL TO TOP BUTTON ===== */
  const handleScrollBtn = () => scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
  window.addEventListener("scroll", debounce(handleScrollBtn, 20));
  scrollBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ===== CHATBOT FUNCTIONALITY ===== */
  const chatIcon = document.getElementById("chatIcon");
  const chatbot = document.getElementById("chatbot");
  const chatInput = document.getElementById("chatbot-input");
  const chatSend = document.getElementById("chatbot-send");
  const chatBody = document.getElementById("chatbot-body");
  const chatTyping = document.getElementById("chatbot-typing");

  const responses = {
    hello: ["Hello! 👋 How can I help you?"],
    hi: ["Hi! 👋 Ask me about BI reports."],
    "do you make power bi report": ["✅ Yes, I make Power BI reports!"],
    retail: ["📊 Retail demo: <a href='https://yourdomain.com/retail-report' target='_blank'>View Report</a>"],
    finance: ["📊 Finance demo: <a href='https://yourdomain.com/finance-report' target='_blank'>View Report</a>"],
    default: ["Sorry, I didn't understand. Try asking something else."]
  };

  const addMessage = (msg, sender = "user") => {
    const div = document.createElement("div");
    div.className = sender === "user" ? "chat-msg user-msg" : "chat-msg bot-msg";
    div.innerHTML = msg;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  const sendMessage = () => {
    const msg = chatInput.value.trim();
    if (!msg) return;
    addMessage(msg, "user");
    chatInput.value = "";
    chatTyping.style.display = "block";

    setTimeout(() => {
      chatTyping.style.display = "none";
      const response = responses[msg.toLowerCase()] || responses.default;
      addMessage(response[Math.floor(Math.random() * response.length)], "bot");
    }, 600); // faster response
  };

  chatSend.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });
  chatIcon.addEventListener("click", () => chatbot.classList.toggle("open"));

  /* ===== SCROLL-TRIGGERED STAGGER + SLIDE-IN ANIMATIONS ===== */
  const revealSections = () => {
    const triggerBottom = window.innerHeight * 0.85;
    sections.forEach((section, index) => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop < triggerBottom && !section.classList.contains("visible")) {
        section.classList.add(index % 2 === 0 ? "slide-left" : "slide-right");
        setTimeout(() => section.classList.add("visible"), index * 150);
      }
    });
  };

  /* ===== ACTIVE NAV LINK HIGHLIGHT ===== */
  const highlightNav = () => {
    const scrollPos = window.scrollY || window.pageYOffset;
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");
      const link = document.querySelector(`.navbar a[href="#${sectionId}"]`);
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) link?.classList.add("active");
      else link?.classList.remove("active");
    });
  };

  /* ===== INITIAL TRIGGER ===== */
  revealSections();
  highlightNav();
  window.addEventListener("scroll", debounce(() => {
    revealSections();
    highlightNav();
  }, 30));

  /* ===== DEBOUNCE FUNCTION ===== */
  function debounce(func, wait = 20, immediate = false) {
    let timeout;
    return function (...args) {
      const later = () => { timeout = null; if (!immediate) func.apply(this, args); };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(this, args);
    };
  }

});
