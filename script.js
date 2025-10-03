/* ================= DOM READY ================= */
document.addEventListener("DOMContentLoaded", () => {

  /* ========== SCROLL TO TOP BUTTON ========== */
  const scrollTopBtn = document.querySelector("#scrollTopBtn");

  /* ========== STICKY HEADER ========== */
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("sticky", window.scrollY > 50);
    scrollTopBtn.style.display = window.scrollY > 300 ? "flex" : "none";
  });

  /* ========== MOBILE MENU ========== */
  const menuIcon = document.querySelector("#menu-icon");
  const navbar = document.querySelector(".navbar");
  menuIcon.addEventListener("click", () => {
    navbar.classList.toggle("active");
    menuIcon.classList.toggle("bx-x"); // optional: if using boxicons for close icon
  });

  /* ========== THEME TOGGLE ========== */
  const themeToggle = document.querySelector(".theme-toggle");
  const htmlEl = document.documentElement;

  // Load saved theme
  if(localStorage.getItem("theme") === "light") {
    htmlEl.setAttribute("data-theme","light");
    themeToggle.classList.add("light");
  }

  themeToggle.addEventListener("click", () => {
    htmlEl.getAttribute("data-theme") === "light" ? 
      htmlEl.setAttribute("data-theme","dark") :
      htmlEl.setAttribute("data-theme","light");
    themeToggle.classList.toggle("light");
    localStorage.setItem("theme", htmlEl.getAttribute("data-theme"));
  });

  /* ========== SCROLL REVEAL SECTIONS ========== */
  const sections = document.querySelectorAll("section");
  const revealSection = () => {
    const triggerBottom = window.innerHeight * 0.85;
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if(top < triggerBottom) section.classList.add("visible");
    });
  };
  window.addEventListener("scroll", revealSection);
  revealSection(); // initial check

  /* ========== SCROLL TO TOP BUTTON EVENT ========== */
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ========== CHATBOT FUNCTIONALITY ========== */
  const chatIcon = document.querySelector("#chatIcon");
  const chatbot = document.querySelector("#chatbot");
  const chatbotBody = document.querySelector("#chatbot-body");
  const chatbotInput = document.querySelector("#chatbot-footer input");

  chatIcon.addEventListener("click", () => {
    chatbot.classList.toggle("show");
  });

  const addMessage = (text, sender) => {
    const msg = document.createElement("div");
    msg.className = `chat-msg ${sender}`;
    msg.textContent = text;
    chatbotBody.appendChild(msg);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  };

  chatbotInput.addEventListener("keypress", (e) => {
    if(e.key === "Enter" && chatbotInput.value.trim() !== "") {
      const userText = chatbotInput.value;
      addMessage(userText,"user");
      chatbotInput.value = "";

      // Simple bot response
      setTimeout(() => {
        let botResponse = "Sorry, I didn't understand.";
        if(/hello|hi|hey/i.test(userText)) botResponse = "Hello! 👋 How can I help you?";
        if(/power bi|report/i.test(userText)) botResponse = "✅ Yes, I make Power BI reports!";
        addMessage(botResponse,"bot");
      }, 600);
    }
  });

});
