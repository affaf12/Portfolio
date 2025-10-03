document.addEventListener("DOMContentLoaded", () => {

  /* ===== STICKY HEADER & DEBOUNCED SCROLL ===== */
  const header = document.querySelector("header");
  const scrollBtn = document.getElementById("scrollTopBtn");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar a");

  const debounce = (fn, delay = 15) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const onScroll = () => {
    const scrollY = window.scrollY;

    // Sticky header
    header.classList.toggle("sticky", scrollY > 50);

    // Scroll to top button
    scrollBtn.style.display = scrollY > 300 ? "block" : "none";

    // Active nav link
    sections.forEach(section => {
      if (scrollY + 150 >= section.offsetTop && scrollY + 150 < section.offsetTop + section.offsetHeight) {
        navLinks.forEach(link => link.classList.remove("active"));
        const activeLink = document.querySelector(`.navbar a[href="#${section.id}"]`);
        if (activeLink) activeLink.classList.add("active");
      }
    });

    // Animate sections on scroll
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      const trigger = window.innerHeight * 0.85;
      if (sectionTop < trigger) {
        section.style.opacity = 1;
        section.style.transform = "translateY(0)";
        section.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      }
    });
  };

  window.addEventListener("scroll", debounce(onScroll));

  /* ===== SCROLL TO TOP BUTTON ===== */
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  /* ===== CONTACT FORM (EMAILJS) ===== */
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  if (contactForm) {
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

      if (!emailjs) {
        formMessage.textContent = "❌ Email service not loaded!";
        formMessage.style.color = "red";
        return;
      }

      emailjs.send('service_q9049ro', 'template_pfvdv6j', { title, name, email, message })
        .then(response => {
          formMessage.textContent = `✅ Thank you ${name}! Your message has been sent.`;
          formMessage.style.color = "green";
          contactForm.reset();
        })
        .catch(error => {
          const errorMsg = error?.text || JSON.stringify(error);
          formMessage.innerHTML = `❌ Something went wrong:<br>${errorMsg}`;
          formMessage.style.color = "red";
        });
    });
  }

  /* ===== SMART CHATBOT ===== */
  const chatbot = document.getElementById("chatbot");
  const chatIcon = document.getElementById("chatIcon");
  const closeBtn = document.getElementById("chatbot-close");
  const sendBtn = document.getElementById("chatbot-send");
  const input = document.getElementById("chatbot-input");
  const messages = document.getElementById("chatbot-messages");
  const typing = document.getElementById("chatbot-typing");

  const responses = [
    { keywords: ["hello", "hi", "hey"], reply: ["Hello! 👋 How can I help you today?"] },
    { keywords: ["power bi", "report"], reply: ["✅ Yes! I can create Power BI reports for Retail, Finance, or HR."] },
    { keywords: ["retail"], reply: ["📊 Retail demo: <a href='https://yourdomain.com/retail-report' target='_blank'>View Report</a>"] },
    { keywords: ["finance"], reply: ["📊 Finance demo: <a href='https://yourdomain.com/finance-report' target='_blank'>View Report</a>"] },
    { keywords: ["hr"], reply: ["📊 HR demo: <a href='https://yourdomain.com/hr-report' target='_blank'>View Report</a>"] }
  ];
  const defaultReply = ["❓ I didn’t understand. Try: Retail, Finance, HR."];

  const addMessage = (text, sender) => {
    const div = document.createElement("div");
    div.classList.add("chatbot-message", sender === "user" ? "user" : "bot");
    div.innerHTML = text;
    messages.appendChild(div);
    messages.scrollTo({ top: messages.scrollHeight, behavior: "smooth" });
    if (sender === "bot") {
      div.querySelectorAll("a").forEach(link => {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      });
    }
  };

  const botReply = text => {
    typing.style.display = "block";
    const lowerText = text.toLowerCase();
    setTimeout(() => {
      typing.style.display = "none";
      let matched = false;
      responses.forEach(item => {
        if (item.keywords.some(k => lowerText.includes(k))) {
          item.reply.forEach((msg, i) => setTimeout(() => addMessage(msg, "bot"), i * 700));
          matched = true;
        }
      });
      if (!matched) defaultReply.forEach((msg, i) => setTimeout(() => addMessage(msg, "bot"), i * 700));
      setTimeout(() => addQuickReplies(["Retail", "Finance", "HR"]), 800);
    }, 600);
  };

  const addQuickReplies = options => {
    const container = document.createElement("div");
    container.classList.add("quick-replies");
    options.forEach(option => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.addEventListener("click", () => {
        addMessage(option, "user");
        botReply(option);
        container.remove();
      });
      container.appendChild(btn);
    });
    messages.appendChild(container);
    messages.scrollTo({ top: messages.scrollHeight, behavior: "smooth" });
  };

  chatIcon.addEventListener("click", () => {
    chatbot.classList.add("open");
    messages.innerHTML = "";
    addMessage("👋 Hi! I’m your Data Bot. Ask me about BI reports!", "bot");
    addQuickReplies(["Retail", "Finance", "HR"]);
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
