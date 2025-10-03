document.addEventListener("DOMContentLoaded", () => {
  // ===== Sticky Header =====
  const header = document.querySelector("header");
  if (header) {
    window.addEventListener(
      "scroll",
      () => {
        header.classList.toggle("sticky", window.scrollY > 0);
      },
      { passive: true }
    );
  }

  // ===== Mobile Menu Toggle =====
  const menu = document.querySelector("#menu-icon");
  const navbar = document.querySelector(".navbar");

  if (menu && navbar) {
    menu.addEventListener("click", () => {
      const expanded = menu.getAttribute("aria-expanded") === "true";
      menu.setAttribute("aria-expanded", String(!expanded));
      menu.classList.toggle("bx-x");
      navbar.classList.toggle("active");
    });

    document.querySelectorAll(".navbar a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("bx-x");
        navbar.classList.remove("active");
        menu.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ===== Scroll Reveal Animations =====
  const revealElements = document.querySelectorAll(
    ".home-text, .about, .services, .portfolio, .contact"
  );

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // ===== Chatbot =====
  const chatbot = document.getElementById("chatbot");
  const toggleBtn = document.getElementById("chatbot-toggle");
  const closeBtn = document.getElementById("chatbot-close");
  const typingIndicator = document.getElementById("chatbot-typing");
  const sendBtn = document.getElementById("chatbot-send");
  const input = document.getElementById("chatbot-input");
  const messages = document.getElementById("chatbot-messages");

  // Bot responses
  const botResponses = {
    retail: "Yes! Here is the Retail Analytics demo report: <a href='https://your-retail-report.com' target='_blank'>View Report</a>",
    finance: "Finance Analytics demo report is ready: <a href='https://your-finance-report.com' target='_blank'>View Report</a>",
    hr: "HR Analytics demo report is available: <a href='https://your-hr-report.com' target='_blank'>View Report</a>",
    sales: "Sales Analytics demo report: <a href='https://your-sales-report.com' target='_blank'>View Report</a>",
    marketing: "Marketing Analytics demo report: <a href='https://your-marketing-report.com' target='_blank'>View Report</a>",
    hello: "Hello! Ask me about reports: Retail, Finance, HR, Sales, Marketing...",
    hi: "Hi there! I can provide demo reports for Retail, Finance, HR, Sales, Marketing...",
    default: "Sorry, I didn't understand that. Please ask about Retail, Finance, HR, Sales, or Marketing reports."
  };

  // Toggle chatbot visibility
  toggleBtn.addEventListener("click", () => {
    chatbot.style.display = "flex";
  });
  closeBtn.addEventListener("click", () => {
    chatbot.style.display = "none";
  });

  // Send message function
  function sendMessage() {
    const userText = input.value.trim();
    if (!userText) return;

    // User message
    const userMsg = document.createElement("div");
    userMsg.classList.add("message", "user");
    userMsg.innerHTML = userText;
    messages.appendChild(userMsg);
    input.value = "";
    messages.scrollTop = messages.scrollHeight;

    // Typing indicator
    typingIndicator.style.display = "block";

    setTimeout(() => {
      typingIndicator.style.display = "none";

      // Match user input to bot response
      const key = Object.keys(botResponses).find((k) =>
        userText.toLowerCase().includes(k)
      ) || "default";

      const botMsg = document.createElement("div");
      botMsg.classList.add("message", "bot");
      botMsg.innerHTML = botResponses[key];
      messages.appendChild(botMsg);
      messages.scrollTop = messages.scrollHeight;
    }, 1000); // 1-second typing effect
  }

  // Event listeners for send
  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
