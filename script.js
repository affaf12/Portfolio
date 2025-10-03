/* ================= MAIN SCRIPT ================= */
document.addEventListener("DOMContentLoaded", () => {

  /* ===== Sticky Header ===== */
  const header = document.querySelector("header");
  const handleHeader = () => header?.classList.toggle("sticky", window.scrollY > 50);
  window.addEventListener("scroll", () => requestAnimationFrame(handleHeader), { passive: true });

  /* ===== Mobile Menu Toggle ===== */
  const menu = document.querySelector("#menu-icon");
  const navbar = document.querySelector(".navbar");
  menu?.addEventListener("click", () => {
    const expanded = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", String(!expanded));
    menu.classList.toggle("bx-x");
    navbar?.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });

  /* ===== Navbar Active Link on Scroll ===== */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar a");
  const handleActiveLink = () => {
    const scrollY = window.scrollY + 150;
    sections.forEach(sec => {
      const secTop = sec.offsetTop;
      const secHeight = sec.offsetHeight;
      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        navLinks.forEach(link => link.classList.remove("active"));
        document.querySelector(`.navbar a[href="#${sec.id}"]`)?.classList.add("active");
      }
    });
  };
  window.addEventListener("scroll", () => requestAnimationFrame(handleActiveLink), { passive: true });

  /* ===== Scroll-to-Top Button ===== */
  const scrollBtn = document.getElementById("scrollTopBtn");
  const toggleScrollBtn = () => {
    if (!scrollBtn) return;
    scrollBtn.classList.toggle("show", window.scrollY > 300);
  };
  window.addEventListener("scroll", () => requestAnimationFrame(toggleScrollBtn), { passive: true });
  scrollBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ===== Theme Toggle ===== */
  const themeToggle = document.getElementById("theme-toggle");
  const html = document.documentElement;
  const initTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      html.setAttribute("data-theme", savedTheme);
      themeToggle?.classList.toggle("light", savedTheme === "light");
    }
  };
  initTheme();
  themeToggle?.addEventListener("click", () => {
    const isLight = html.getAttribute("data-theme") === "light";
    html.setAttribute("data-theme", isLight ? "dark" : "light");
    themeToggle.classList.toggle("light", !isLight);
    localStorage.setItem("theme", isLight ? "dark" : "light");
  });

  /* ===== Contact Form (EmailJS) ===== */
  const form = document.getElementById("contactForm");
  const formMsg = document.getElementById("formMessage");
  const submitBtn = form?.querySelector('button[type="submit"]');

  const showFormMessage = (msg, type) => {
    formMsg.textContent = msg;
    formMsg.style.display = "block";
    formMsg.className = `form-message ${type}`;
  };

  if (form && formMsg && submitBtn) {
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const name = form.name?.value.trim();
      const email = form.email?.value.trim();
      const message = form.message?.value.trim();
      if (!name || !email || !message) return showFormMessage("❌ Please fill all fields!", "error");

      submitBtn.disabled = true;
      showFormMessage("⏳ Sending message...", "loading");
      try {
        await emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", { from_name: name, from_email: email, message }, "YOUR_PUBLIC_KEY");
        showFormMessage("✅ Message sent successfully!", "success");
        form.reset();
      } catch (err) {
        console.error(err);
        showFormMessage("❌ Failed to send. Try again!", "error");
      } finally { submitBtn.disabled = false; }
    });
  }

  /* ===== Floating Social Buttons ===== */
  const socialButtons = document.querySelectorAll(".social-btn");
  const toggleSocialButtons = () => {
    socialButtons.forEach(btn => {
      const visible = window.scrollY > 200;
      btn.style.opacity = visible ? "1" : "0";
      btn.style.transform = visible ? "translateX(0)" : "translateX(-50px)";
    });
  };
  window.addEventListener("scroll", () => requestAnimationFrame(toggleSocialButtons), { passive: true });

  /* ===== Chatbot System ===== */
  const chatbot = document.getElementById("chatbot");
  const chatIcon = document.getElementById("chatIcon");
  const closeBtn = document.getElementById("chatbot-close");
  const sendBtn = document.getElementById("chatbot-send");
  const input = document.getElementById("chatbot-input");
  const messages = document.getElementById("chatbot-messages");
  const typing = document.getElementById("chatbot-typing");

  if (chatbot && chatIcon && closeBtn && sendBtn && input && messages && typing) {
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

    const addMessage = (text, sender) => {
      const div = document.createElement("div");
      div.classList.add("chatbot-message", sender);
      div.innerHTML = text;
      messages.appendChild(div);
      messages.scrollTo({ top: messages.scrollHeight, behavior: "smooth" });
    };

    const botReply = (userText) => {
      typing.style.display = "flex";
      const normalizedText = userText.trim().toLowerCase();
      setTimeout(() => {
        typing.style.display = "none";
        const reply = responses[normalizedText] || responses.default;
        reply.forEach((msg, i) => setTimeout(() => addMessage(msg, "bot"), i * 700));
      }, 600);
    };

    const sendMessage = () => {
      const text = input.value.trim();
      if (!text) return;
      addMessage(text, "user");
      input.value = "";
      botReply(text);
    };

    /* Chat Icon Toggle */
    chatIcon.addEventListener("click", () => {
      chatbot.classList.add("open", "animate-open");
      chatbot.classList.remove("closing");
      messages.innerHTML = "";
      addMessage("👋 Hi! I’m your Data Bot. Ask me about BI reports!", "bot");
      input.focus();
      chatIcon.style.transform = "scale(0.9)";
      setTimeout(() => chatIcon.style.transform = "scale(1)", 150);
    });

    closeBtn.addEventListener("click", () => {
      chatbot.classList.add("closing");
      chatbot.classList.remove("animate-open");
      setTimeout(() => chatbot.classList.remove("closing", "open"), 400);
    });

    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keypress", e => e.key === "Enter" && sendMessage());
  }

});
