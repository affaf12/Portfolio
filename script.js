document.addEventListener("DOMContentLoaded", () => {
  /* ===================== VARIABLES ===================== */
  const header = document.querySelector("header");
  const menuIcon = document.querySelector("#menu-icon");
  const navbar = document.querySelector(".navbar");
  const themeToggle = document.querySelector(".theme-toggle");
  const htmlEl = document.documentElement;
  const scrollTopBtn = document.querySelector("#scrollTopBtn");
  const sections = document.querySelectorAll("section");
  const chatIcon = document.querySelector("#chatIcon");
  const chatbot = document.querySelector("#chatbot");
  const chatbotBody = document.querySelector("#chatbot-body");
  const chatbotInput = document.querySelector("#chatbot-footer input");

  /* ===================== STICKY HEADER & SCROLL TOP ===================== */
  const handleScroll = () => {
    const scrollY = window.scrollY;
    header.classList.toggle("sticky", scrollY > 50);
    scrollTopBtn.style.display = scrollY > 300 ? "flex" : "none";

    // Reveal sections on scroll
    const triggerBottom = window.innerHeight * 0.85;
    sections.forEach(section => {
      if (section.getBoundingClientRect().top < triggerBottom) {
        section.classList.add("visible");
      }
    });
  };

  const debounce = (fn, delay = 10) => {
    let timer;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(fn, delay);
    };
  };

  window.addEventListener("scroll", debounce(handleScroll));
  handleScroll(); // initial check

  /* ===================== MOBILE MENU ===================== */
  menuIcon.addEventListener("click", () => {
    menuIcon.classList.toggle("bx-x");
    navbar.classList.toggle("active");
  });

  /* ===================== THEME TOGGLE ===================== */
  if(localStorage.getItem("theme") === "light") {
    htmlEl.setAttribute("data-theme", "light");
    themeToggle.classList.add("light");
  }

  themeToggle.addEventListener("click", () => {
    const isLight = htmlEl.getAttribute("data-theme") === "light";
    htmlEl.setAttribute("data-theme", isLight ? "dark" : "light");
    themeToggle.classList.toggle("light");
    localStorage.setItem("theme", htmlEl.getAttribute("data-theme"));
  });

  /* ===================== SCROLL TO TOP BUTTON ===================== */
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ===================== CHATBOT ===================== */
  chatIcon.addEventListener("click", () => chatbot.classList.toggle("show"));

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
      addMessage(userText, "user");
      chatbotInput.value = "";

      // Simple bot response
      setTimeout(() => {
        let botResponse = "Sorry, I didn't understand.";
        if(/hello|hi|hey/i.test(userText)) botResponse = "Hello! 👋 How can I help you?";
        if(/power bi|report/i.test(userText)) botResponse = "✅ Yes, I make Power BI reports!";
        addMessage(botResponse, "bot");
      }, 500);
    }
  });

  /* ===================== SCROLL REVEAL (Optional for finer control) ===================== */
  const sr = ScrollReveal({
    distance: '25px',
    duration: 500,
    reset: true
  });
  sr.reveal('.home-text', { delay: 200, origin: 'bottom' });
  sr.reveal('.about, .services, .portfolio, .contact', { delay: 250, origin: 'bottom' });
});
