document.addEventListener("DOMContentLoaded", () => {
  // ===== Sticky Header =====
  const header = document.querySelector("header");
  window.addEventListener(
    "scroll",
    () => header.classList.toggle("sticky", window.scrollY > 0),
    { passive: true }
  );

  // ===== Mobile Menu =====
  const menu = document.querySelector("#menu-icon");
  const navbar = document.querySelector(".navbar");
  menu.addEventListener("click", () => {
    const expanded = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", String(!expanded));
    menu.classList.toggle("bx-x");
    navbar.classList.toggle("active");
  });
  document.querySelectorAll(".navbar a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("bx-x");
      navbar.classList.remove("active");
      menu.setAttribute("aria-expanded", "false");
    });
  });

  // ===== Scroll Reveal =====
  const revealElements = document.querySelectorAll("section, .reveal");
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealElements.forEach(el => observer.observe(el));

  // ===== Contact Form with EmailJS =====
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");
  if (contactForm) {
    contactForm.addEventListener("submit", async e => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();
      if (!name || !email || !message) {
        showMessage("❌ Please fill all fields!", "error");
        return;
      }
      showMessage("Sending message...", "loading");
      try {
        await emailjs.send("YOUR_SERVICE_ID","YOUR_TEMPLATE_ID",
          {from_name:name,from_email:email,message:message},"YOUR_PUBLIC_KEY");
        showMessage("✅ Message sent successfully!", "success");
        contactForm.reset();
      } catch (err) {
        showMessage("❌ Something went wrong. Try again!", "error");
        console.error(err);
      }
    });
  }
  function showMessage(msg, type) {
    formMessage.style.display = "block";
    formMessage.textContent = msg;
    formMessage.className = type;
  }

  // ===== Scroll-to-Top Button =====
  const scrollBtn = document.getElementById("scrollTopBtn");
  window.addEventListener("scroll", () => {
    if (scrollBtn) {
      scrollBtn.style.display = window.scrollY > 300 ? "flex" : "none";
    }
  });
  if (scrollBtn) {
    scrollBtn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }

  // ===== Auto-Active Navbar Links =====
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar a");
  window.addEventListener("scroll", () => {
    let scrollY = window.pageYOffset;
    sections.forEach(sec => {
      const secTop = sec.offsetTop - 80;
      const secHeight = sec.offsetHeight;
      const secId = sec.getAttribute("id");
      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${secId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  });
});

// ===== Chatbot JS =====
(() => {
  const chatbot = document.getElementById("chatbot");
  const toggleBtn = document.getElementById("chatbot-toggle");
  const closeBtn = document.getElementById("chatbot-close");
  const typingIndicator = document.getElementById("chatbot-typing");
  const sendBtn = document.getElementById("chatbot-send");
  const input = document.getElementById("chatbot-input");
  const messages = document.getElementById("chatbot-messages");

  // Predefined bot responses
  const botResponses = {
    "hello": ["Hello! How are you?", "How can I help you today?"],
    "hi": ["Hi there! 👋", "Do you want to see Retail, Finance, or HR reports?"],
    "retail": ["✅ Retail Analytics demo report: <a href='https://your-retail-report.com' target='_blank'>View Report</a>"],
    "finance": ["✅ Finance Analytics demo report: <a href='https://your-finance-report.com' target='_blank'>View Report</a>"],
    "hr": ["✅ HR Analytics demo report: <a href='https://your-hr-report.com' target='_blank'>View Report</a>"],
    "thanks": ["You're welcome! 🙌", "Anything else you want to explore?"],
    "bye": ["Goodbye 👋", "Have a great day!"],
    "default": ["Sorry, I didn’t understand that 🤔", "Please ask about Retail, Finance, or HR reports."]
  };

  // Open chatbot
  toggleBtn.addEventListener("click", () => {
    chatbot.style.display = "flex";
    chatbot.classList.add("show");
    messages.innerHTML = ""; // reset history when reopened
    autoGreet();
  });

  // Close chatbot
  closeBtn.addEventListener("click", () => {
    chatbot.style.display = "none";
    chatbot.classList.remove("show");
  });

  // Send message
  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
  });

  function sendMessage() {
    const userText = input.value.trim();
    if (!userText) return;

    addMessage(userText, "user");
    input.value = "";
    typingIndicator.style.display = "block";

    setTimeout(() => {
      typingIndicator.style.display = "none";
      const key = userText.toLowerCase();
      const responses = botResponses[key] || botResponses["default"];
      responses.forEach((reply, i) => {
        setTimeout(() => addMessage(reply, "bot"), i * 1000);
      });
    }, 800);
  }

  function addMessage(text, sender) {
    const div = document.createElement("div");
    div.classList.add("chatbot-message", sender);
    div.innerHTML = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  // Greeting on open
  function autoGreet() {
    typingIndicator.style.display = "block";
    setTimeout(() => {
      typingIndicator.style.display = "none";
      addMessage("👋 Hi! I’m your Data Bot.", "bot");
      setTimeout(() => {
        addMessage("Ask me about Retail, Finance, or HR reports anytime!", "bot");
      }, 1200);
    }, 900);
  }
})();
