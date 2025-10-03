document.addEventListener("DOMContentLoaded", () => {
  /* ===================== VARIABLES ===================== */
  const header = document.querySelector("header");
  const menuIcon = document.querySelector("#menu-icon");
  const navbar = document.querySelector(".navbar");
  const themeToggle = document.querySelector("#theme-toggle");
  const htmlEl = document.documentElement;
  const scrollTopBtn = document.querySelector("#scrollTopBtn");
  const sections = document.querySelectorAll("section");
  const chatIcon = document.querySelector("#chatIcon");
  const chatbot = document.querySelector("#chatbot");
  const chatbotBody = document.querySelector("#chatbot-body");
  const chatbotInput = document.querySelector("#chatbot-footer input");
  const chatbotSend = document.querySelector("#chatbot-send");
  const chatClose = document.querySelector("#chatbot-close");

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
    themeToggle.innerHTML = "<i class='bx bx-sun'></i>";
  }

  themeToggle.addEventListener("click", () => {
    const isLight = htmlEl.getAttribute("data-theme") === "light";
    htmlEl.setAttribute("data-theme", isLight ? "dark" : "light");
    themeToggle.innerHTML = isLight ? "<i class='bx bx-moon'></i>" : "<i class='bx bx-sun'></i>";
    localStorage.setItem("theme", htmlEl.getAttribute("data-theme"));
  });

  /* ===================== SCROLL TO TOP BUTTON ===================== */
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ===================== CHATBOT ===================== */
  chatIcon.addEventListener("click", () => chatbot.classList.toggle("show"));
  chatClose.addEventListener("click", () => chatbot.classList.remove("show"));

  const addMessage = (text, sender) => {
    const msg = document.createElement("div");
    msg.className = `chat-msg ${sender}`;
    msg.textContent = text;
    chatbotBody.appendChild(msg);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  };

  const botReply = (userText) => {
    let botResponse = "Sorry, I didn't understand.";
    if(/hello|hi|hey/i.test(userText)) botResponse = "Hello! 👋 How can I help you?";
    if(/power bi|report/i.test(userText)) botResponse = "✅ Yes, I make Power BI reports!";
    if(/experience/i.test(userText)) botResponse = "I have worked on PwC & Accenture simulations and multiple freelance projects.";
    if(/skills/i.test(userText)) botResponse = "My skills include Excel, SQL, Python, Power BI, Data Analysis, and Dashboarding.";
    return botResponse;
  };

  const sendChatMessage = () => {
    const userText = chatbotInput.value.trim();
    if(userText === "") return;
    addMessage(userText, "user");
    chatbotInput.value = "";
    setTimeout(() => {
      addMessage(botReply(userText), "bot");
    }, 500);
  };

  chatbotSend.addEventListener("click", sendChatMessage);
  chatbotInput.addEventListener("keypress", (e) => {
    if(e.key === "Enter") sendChatMessage();
  });

  /* ===================== SCROLL REVEAL ===================== */
  const sr = ScrollReveal({
    distance: '30px',
    duration: 600,
    easing: 'ease-out',
    reset: true
  });
  sr.reveal('.home-text, .home-image', { delay: 200, origin: 'bottom' });
  sr.reveal('.about, .skills, .experience, .achievement, .portfolio, .contact', { delay: 250, origin: 'bottom' });

  /* ===================== EXTRA MICRO INTERACTIONS ===================== */
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach(btn => {
    btn.addEventListener("mouseenter", () => btn.classList.add("hovered"));
    btn.addEventListener("mouseleave", () => btn.classList.remove("hovered"));
  });

  const portfolioRows = document.querySelectorAll(".portfolio .row");
  portfolioRows.forEach(row => {
    row.addEventListener("mouseenter", () => row.classList.add("tilt"));
    row.addEventListener("mouseleave", () => row.classList.remove("tilt"));
  });

  const skillBoxes = document.querySelectorAll(".skills .box");
  skillBoxes.forEach(box => {
    box.addEventListener("mouseenter", () => box.classList.add("highlight"));
    box.addEventListener("mouseleave", () => box.classList.remove("highlight"));
  });
});
