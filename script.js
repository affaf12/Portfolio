/* ================= MAIN SCRIPT ================= */
document.addEventListener("DOMContentLoaded", () => {

  /* ===== Sticky Header ===== */
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    header?.classList.toggle("sticky", window.scrollY > 50);
  }, { passive: true });

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
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    sections.forEach(sec => {
      const secTop = sec.offsetTop - 100;
      const secHeight = sec.offsetHeight;
      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        navLinks.forEach(link => link.classList.remove("active"));
        document.querySelector(`.navbar a[href="#${sec.id}"]`)?.classList.add("active");
      }
    });
  }, { passive: true });

  /* ===== Scroll-to-Top Button (Fade Effect) ===== */
  const scrollBtn = document.getElementById("scrollTopBtn");
  window.addEventListener("scroll", () => {
    if (!scrollBtn) return;
    if (window.scrollY > 300) {
      scrollBtn.classList.add("show");
      scrollBtn.style.opacity = "1";
    } else {
      scrollBtn.style.opacity = "0";
      setTimeout(() => scrollBtn.classList.remove("show"), 300);
    }
  }, { passive: true });
  scrollBtn?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  /* ===== Theme Toggle ===== */
  const themeToggle = document.getElementById("theme-toggle");
  const html = document.documentElement;
  if (localStorage.getItem("theme") === "light") {
    html.setAttribute("data-theme", "light");
    themeToggle?.classList.add("light");
  }
  themeToggle?.addEventListener("click", () => {
    const isLight = html.getAttribute("data-theme") === "light";
    if (isLight) {
      html.removeAttribute("data-theme");
      themeToggle.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      html.setAttribute("data-theme", "light");
      themeToggle.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  });

  /* ===== Contact Form (EmailJS) ===== */
  const form = document.getElementById("contactForm");
  const formMsg = document.getElementById("formMessage");
  const submitBtn = form?.querySelector('button[type="submit"]');

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
        await emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID",
          { from_name: name, from_email: email, message },
          "YOUR_PUBLIC_KEY"
        );
        showFormMessage("✅ Message sent successfully!", "success");
        form.reset();
      } catch (err) {
        console.error(err);
        showFormMessage("❌ Failed to send. Try again!", "error");
      } finally {
        submitBtn.disabled = false;
      }
    });

    function showFormMessage(msg, type) {
      formMsg.textContent = msg;
      formMsg.style.display = "block";
      formMsg.className = `form-message ${type}`;
    }
  }

  /* ===== Floating Social Buttons ===== */
  const socialButtons = document.querySelectorAll(".social-btn");
  window.addEventListener("scroll", () => {
    socialButtons.forEach(btn => {
      btn.style.opacity = window.scrollY > 200 ? "1" : "0";
      btn.style.transform = window.scrollY > 200 ? "translateX(0)" : "translateX(-50px)";
    });
  }, { passive: true });

  /* ===== Chatbot System (Smooth Open/Close) ===== */
  const chatbot = document.getElementById("chatbot");
  const toggleBtn = document.getElementById("chatbot-toggle");
  const closeBtn = document.getElementById("chatbot-close");
  const typing = document.getElementById("chatbot-typing");
  const sendBtn = document.getElementById("chatbot-send");
  const input = document.getElementById("chatbot-input");
  const messages = document.getElementById("chatbot-messages");

  if (chatbot && toggleBtn && closeBtn && sendBtn && input && messages && typing) {
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
      messages.scrollTo({ top: messages.scrollHeight, behavior: "smooth" });
    }

    function botReply(userText) {
      typing.style.display = "flex";
      const normalizedText = userText.trim().toLowerCase();
      setTimeout(() => {
        typing.style.display = "none";
        const reply = responses[normalizedText] || responses.default;
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

    toggleBtn.addEventListener("click", () => {
      chatbot.classList.add("open", "animate-open");
      chatbot.classList.remove("closing");
      messages.innerHTML = "";
      addMessage("👋 Hi! I’m your Data Bot. Ask me about BI reports!", "bot");
      input.focus();
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
