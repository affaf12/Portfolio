/* ================= DOM CONTENT LOADED ================= */
document.addEventListener("DOMContentLoaded", () => {

  /* ===== STICKY HEADER ===== */
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("sticky", window.scrollY > 50);
  }, { passive: true });

  /* ===== MOBILE MENU ===== */
  const menuIcon = document.querySelector("#menu-icon");
  const navbar = document.querySelector(".navbar");
  menuIcon.addEventListener("click", () => {
    navbar.classList.toggle("active");
  });

  /* ===== THEME TOGGLE ===== */
  const themeToggle = document.querySelector(".theme-toggle");
  const body = document.body;

  // Check saved theme
  const savedTheme = localStorage.getItem("theme") || "dark";
  if (savedTheme === "light") {
    body.setAttribute("data-theme", "light");
    themeToggle.classList.add("light");
  }

  themeToggle.addEventListener("click", () => {
    body.classList.add("transition"); // smooth transition
    if (body.getAttribute("data-theme") === "light") {
      body.setAttribute("data-theme", "dark");
      themeToggle.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      body.setAttribute("data-theme", "light");
      themeToggle.classList.add("light");
      localStorage.setItem("theme", "light");
    }
    setTimeout(() => body.classList.remove("transition"), 500);
  });

  /* ===== SCROLL TO TOP BUTTON ===== */
  const scrollBtn = document.getElementById("scrollTopBtn");
  window.addEventListener("scroll", () => {
    scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ===== CHATBOT ===== */
  const chatIcon = document.getElementById("chatIcon");
  const chatbot = document.getElementById("chatbot");
  const chatInput = document.getElementById("chatbot-input");
  const chatSend = document.getElementById("chatbot-send");
  const chatBody = document.getElementById("chatbot-body");
  const chatTyping = document.getElementById("chatbot-typing");

  chatIcon.addEventListener("click", () => {
    chatbot.classList.toggle("open");
  });

  // Simple bot responses (can be expanded)
  const responses = {
    hello: ["Hello! 👋 How can I help you?"],
    hi: ["Hi! 👋 Ask me about BI reports."],
    "do you make power bi report": ["✅ Yes, I make Power BI reports!"],
    retail: ["📊 Retail demo: <a href='https://yourdomain.com/retail-report' target='_blank'>View Report</a>"],
    finance: ["📊 Finance demo: <a href='https://yourdomain.com/finance-report' target='_blank'>View Report</a>"],
    default: ["Sorry, I didn't understand. Try asking something else."]
  };

  function addMessage(msg, sender = "user") {
    const div = document.createElement("div");
    div.className = sender === "user" ? "chat-msg user-msg" : "chat-msg bot-msg";
    div.innerHTML = msg;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  chatSend.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });

  function sendMessage() {
    const msg = chatInput.value.trim();
    if (!msg) return;
    addMessage(msg, "user");
    chatInput.value = "";
    chatTyping.style.display = "block";

    setTimeout(() => {
      chatTyping.style.display = "none";
      const response = responses[msg.toLowerCase()] || responses["default"];
      addMessage(response[Math.floor(Math.random() * response.length)], "bot");
    }, 800);
  }

});
