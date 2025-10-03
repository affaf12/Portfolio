document.addEventListener("DOMContentLoaded", () => {
  /* ===== Sticky Header ===== */
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("sticky", window.scrollY > 50);
  });

  /* ===== Mobile Menu ===== */
  const menu = document.querySelector("#menu-icon");
  const navbar = document.querySelector(".navbar");
  menu.addEventListener("click", () => {
    const expanded = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", String(!expanded));
    menu.classList.toggle("bx-x");
    navbar.classList.toggle("active");
  });

  /* ===== Active Navbar Link on Scroll ===== */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar a");
  window.addEventListener("scroll", () => {
    let scrollY = window.pageYOffset;
    sections.forEach(sec => {
      const secTop = sec.offsetTop - 80;
      const secHeight = sec.offsetHeight;
      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sec.id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  });

  /* ===== Scroll-to-Top Button ===== */
  const scrollBtn = document.getElementById("scrollTopBtn");
  window.addEventListener("scroll", () => {
    scrollBtn.style.display = window.scrollY > 300 ? "flex" : "none";
  });
  scrollBtn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  /* ===== Contact Form (EmailJS) ===== */
  const form = document.getElementById("contactForm");
  const formMsg = document.getElementById("formMessage");
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
        { from_name: name, from_email: email, message: message },
        "YOUR_PUBLIC_KEY"
      );
      showFormMessage("✅ Message sent successfully!", "success");
      form.reset();
    } catch (err) {
      showFormMessage("❌ Failed to send. Try again!", "error");
      console.error(err);
    }
  });
  function showFormMessage(msg, type) {
    formMsg.textContent = msg;
    formMsg.style.display = "block";
    formMsg.className = `form-message ${type}`;
  }
});

/* ===== Chatbot System ===== */
(() => {
  const chatbot = document.getElementById("chatbot");
  const toggleBtn = document.getElementById("chatbot-toggle");
  const closeBtn = document.getElementById("chatbot-close");
  const typing = document.getElementById("chatbot-typing");
  const sendBtn = document.getElementById("chatbot-send");
  const input = document.getElementById("chatbot-input");
  const messages = document.getElementById("chatbot-messages");

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
    typing.style.display = "block";
    setTimeout(() => {
      typing.style.display = "none";
      const reply = responses[userText.toLowerCase()] || responses.default;
      reply.forEach((msg, i) => setTimeout(() => addMessage(msg, "bot"), i * 800));
    }, 700);
  }

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, "user");
    input.value = "";
    botReply(text);
  }

  toggleBtn.onclick = () => {
    chatbot.style.display = "flex";
    messages.innerHTML = "";
    addMessage("👋 Hi! I’m your Data Bot. Ask me about BI reports!", "bot");
  };
  closeBtn.onclick = () => (chatbot.style.display = "none");
  sendBtn.onclick = sendMessage;
  input.addEventListener("keypress", e => e.key === "Enter" && sendMessage());
})();
