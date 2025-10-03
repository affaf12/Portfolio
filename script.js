/* ================= MAIN SCRIPT ================= */
document.addEventListener("DOMContentLoaded", () => {

  /* ===== Sticky Header with Smooth Shadow ===== */
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("sticky", window.scrollY > 50);
  }, { passive: true });

  /* ===== Mobile Menu ===== */
  const menu = document.querySelector("#menu-icon");
  const navbar = document.querySelector(".navbar");
  menu?.addEventListener("click", () => {
    const expanded = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", String(!expanded));
    menu.classList.toggle("bx-x");
    navbar.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });

  /* ===== Active Navbar Link on Scroll ===== */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar a");
  window.addEventListener("scroll", () => {
    let scrollY = window.pageYOffset;
    sections.forEach(sec => {
      const secTop = sec.offsetTop - 100;
      const secHeight = sec.offsetHeight;
      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        navLinks.forEach(link => link.classList.remove("active"));
        const activeLink = document.querySelector(`.navbar a[href="#${sec.id}"]`);
        activeLink?.classList.add("active");
      }
    });
  }, { passive: true });

  /* ===== Scroll-to-Top Button (Animated) ===== */
  const scrollBtn = document.getElementById("scrollTopBtn");
  window.addEventListener("scroll", () => {
    scrollBtn.classList.toggle("show", window.scrollY > 300);
  }, { passive: true });

  scrollBtn?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  /* ===== Contact Form (EmailJS) ===== */
  const form = document.getElementById("contactForm");
  const formMsg = document.getElementById("formMessage");

  if (form) {
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        showFormMessage("❌ Please fill all fields!", "error");
        return;
      }
      showFormMessage("⏳ Sending message...", "loading");

      try {
        await emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID",
          { from_name: name, from_email: email, message },
          "YOUR_PUBLIC_KEY"
        );
        showFormMessage("✅ Message sent successfully!", "success");
        form.reset();
      } catch (err) {
        showFormMessage("❌ Failed to send. Try again!", "error");
        console.error(err);
      }
    });
  }

  function showFormMessage(msg, type) {
    formMsg.textContent = msg;
    formMsg.style.display = "block";
    formMsg.className = `form-message ${type}`;
  }

  /* ===== Theme Toggle ===== */
  const themeToggle = document.getElementById("theme-toggle");
  const html = document.documentElement;
  if (localStorage.getItem("theme") === "light") {
    html.setAttribute("data-theme", "light");
    themeToggle?.classList.add("light");
  }

  themeToggle?.addEventListener("click", () => {
    if (html.getAttribute("data-theme") === "light") {
      html.removeAttribute("data-theme");
      themeToggle.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      html.setAttribute("data-theme", "light");
      themeToggle.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  });

  /* ================= CHATBOT SYSTEM ================= */
  const chatbot = document.getElementById("chatbot");
  const toggleBtn = document.getElementById("chatbot-toggle");
  const closeBtn = document.getElementById("chatbot-close");
  const typing = document.getElementById("chatbot-typing");
  const sendBtn = document.getElementById("chatbot-send");
  const input = document.getElementById("chatbot-input");
  const messages = document.getElementById("chatbot-messages");

  if (!chatbot) return;

  const responses = {
    hello: ["Hello! 👋 How can I help you?", "Ask about my BI reports."],
    hi: ["Hi there! 👋 Do you want Retail, Finance, or HR reports?"],
    "do you make power bi report": ["✅ Yes, I make professional Power BI reports!"],
    "do you make tableau bi report": ["✅ Yes, I also create Tableau reports!"],
    retail: ["📊 Retail demo: <a href='https://your-retail-report.com' target='_blank'>View Report</a>"],
    finance: ["💰 Finance demo: <a href='https://your-finance-report.com' target='_blank'>View Report</a>"],
    hr: ["👥 HR demo: <a href='https://your-hr-report.com' target='_blank'>View Report</a>"],
    thanks: ["You're welcome! 🙌"],
    bye: ["Goodbye 👋 Have a nice day!"],
    default: ["❓ I didn’t understand. Try: Retail, Finance, HR, or BI reports."]
  };

  function addMessage(text, sender) {
    const div = document.createElement("div");
    div.classList.add("chatbot-message", sender);
    div.innerHTML = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function botReply(userText) {
    typing.style.display = "flex";
    setTimeout(() => {
      typing.style.display = "none";
      const reply = responses[userText.toLowerCase()] || responses.default;
      reply.forEach((msg, i) => setTimeout(() => addMessage(msg, "bot"), i * 700));
    }, 600);
  }

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, "user");
    input.value = "";
    botReply(text);
  }

  /* Chatbot Open/Close */
  toggleBtn.onclick = () => {
    chatbot.classList.add("open");
    chatbot.classList.remove("closing");
    messages.innerHTML = "";
    addMessage("👋 Hi! I’m your Data Bot. Ask me about BI reports!", "bot");
    input.focus(); // Auto-focus input
  };

  closeBtn.onclick = () => {
    chatbot.classList.remove("open");
    chatbot.classList.add("closing");
    setTimeout(() => chatbot.classList.remove("closing"), 400);
  };

  sendBtn.onclick = sendMessage;
  input.addEventListener("keypress", e => e.key === "Enter" && sendMessage());
});
