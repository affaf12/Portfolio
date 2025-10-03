document.addEventListener("DOMContentLoaded", () => {

  /* ===== STICKY HEADER ===== */
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("sticky", window.scrollY > 50);
  });

  /* ===== MOBILE MENU ===== */
  const menu = document.getElementById("menu-icon");
  const navbar = document.querySelector(".navbar");
  menu.addEventListener("click", () => {
    const expanded = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", String(!expanded));
    menu.classList.toggle("bx-x");
    navbar.classList.toggle("active");
  });

  /* ===== ACTIVE NAV LINK ON SCROLL ===== */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar a");
  window.addEventListener("scroll", () => {
    let scrollY = window.scrollY + 150;
    sections.forEach(section => {
      if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
        navLinks.forEach(link => link.classList.remove("active"));
        const activeLink = document.querySelector(`.navbar a[href="#${section.id}"]`);
        if (activeLink) activeLink.classList.add("active");
      }
    });
  });

  /* ===== SCROLL TO TOP BUTTON ===== */
  const scrollBtn = document.getElementById("scrollTopBtn");
  window.addEventListener("scroll", () => {
    scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ===== THEME TOGGLE ===== */
  const themeToggle = document.getElementById("theme-toggle");
  const html = document.documentElement;
  const savedTheme = localStorage.getItem("theme") ||
                     (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  html.setAttribute("data-theme", savedTheme);
  themeToggle.classList.toggle("light", savedTheme === "light");

  themeToggle.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    html.setAttribute("data-theme", next);
    themeToggle.classList.toggle("light", next === "light");
    localStorage.setItem("theme", next);
  });

  /* ===== EMAILJS INIT ===== */
  emailjs.init("ILlSd42qf_3o8DE93"); // Your Public Key

  /* ===== CONTACT FORM ===== */
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  contactForm.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const title = document.getElementById("title")?.value.trim() || "No Subject";
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      formMessage.textContent = "Please fill all fields!";
      formMessage.style.color = "red";
      return;
    }

    formMessage.textContent = "Sending...";
    formMessage.style.color = "#2563eb";

    emailjs.send('service_q9049ro', 'template_pfvdv6j', {
      title: title,
      name: name,
      email: email,
      message: message
    })
    .then(response => {
      formMessage.textContent = `✅ Thank you ${name}! Your message has been sent.`;
      formMessage.style.color = "green";
      contactForm.reset();
      console.log("SUCCESS!", response.status, response.text);
    })
    .catch(error => {
      formMessage.textContent = "❌ Oops! Something went wrong. Try again.";
      formMessage.style.color = "red";
      console.error("FAILED...", error);
    });
  });

  /* ===== CHATBOT FUNCTIONALITY ===== */
  const chatbot = document.getElementById("chatbot");
  const chatIcon = document.getElementById("chatIcon");
  const closeBtn = document.getElementById("chatbot-close");
  const sendBtn = document.getElementById("chatbot-send");
  const input = document.getElementById("chatbot-input");
  const messages = document.getElementById("chatbot-messages");
  const typing = document.getElementById("chatbot-typing");

  const responses = {
    hello: ["Hello! 👋 How can I help you?"],
    hi: ["Hi! 👋 Ask me about BI reports."],
    "do you make power bi report": ["✅ Yes, I make Power BI reports!"],
    retail: ["📊 Retail demo: <a href='#'>View Report</a>"],
    finance: ["📊 Finance demo: <a href='#'>View Report</a>"],
    hr: ["📊 HR demo: <a href='#'>View Report</a>"],
    default: ["❓ I didn’t understand. Try: Retail, Finance, HR."]
  };

  const addMessage = (text, sender) => {
    const div = document.createElement("div");
    div.classList.add("chatbot-message", sender === "user" ? "user" : "bot");
    div.innerHTML = sender === "user" ? text.replace(/</g, "&lt;").replace(/>/g, "&gt;") : text;
    messages.appendChild(div);
    messages.scrollTo({ top: messages.scrollHeight, behavior: "smooth" });
  };

  const botReply = text => {
    typing.style.display = "block";
    setTimeout(() => {
      typing.style.display = "none";
      const reply = responses[text.trim().toLowerCase()] || responses.default;
      reply.forEach((msg, i) => setTimeout(() => addMessage(msg, "bot"), i * 700));
    }, 600);
  };

  chatIcon.addEventListener("click", () => {
    chatbot.classList.add("open");
    messages.innerHTML = "";
    addMessage("👋 Hi! I’m your Data Bot. Ask me about BI reports!", "bot");
    input.focus();
  });

  closeBtn.addEventListener("click", () => chatbot.classList.remove("open"));

  sendBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, "user");
    input.value = "";
    botReply(text);
  });

  input.addEventListener("keypress", e => { if (e.key === "Enter") sendBtn.click(); });

});
