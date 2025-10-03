document.addEventListener("DOMContentLoaded", () => {
  // Sticky Header
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("sticky", window.scrollY > 0);
  }, { passive: true });

  // Mobile Menu
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

  // Scroll Reveal
  const revealElements = document.querySelectorAll("section");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealElements.forEach(el => observer.observe(el));

  // Contact Form
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");
  contactForm.addEventListener("submit", async e => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    if (!name || !email || !message) {
      formMessage.style.display = "block";
      formMessage.textContent = "❌ Please fill all fields!";
      return;
    }
    formMessage.style.display = "block";
    formMessage.textContent = "Sending message...";
    try {
      await emailjs.send("YOUR_SERVICE_ID","YOUR_TEMPLATE_ID",{from_name:name,from_email:email,message:message},"YOUR_PUBLIC_KEY");
      formMessage.textContent = "✅ Message sent successfully!";
      contactForm.reset();
    } catch(err){ formMessage.textContent = "❌ Something went wrong. Try again!"; console.error(err);}
  });

  // Scroll-to-Top Button
  const scrollBtn = document.getElementById("scrollTopBtn");
  window.addEventListener("scroll", () => {
    scrollBtn.style.display = window.scrollY > 300 ? "flex" : "none";
  });
  scrollBtn.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));
});

// Chatbot
(() => {
  const chatbot = document.getElementById("chatbot");
  const toggleBtn = document.getElementById("chatbot-toggle");
  const closeBtn = document.getElementById("chatbot-close");
  const typingIndicator = document.getElementById("chatbot-typing");
  const sendBtn = document.getElementById("chatbot-send");
  const input = document.getElementById("chatbot-input");
  const messages = document.getElementById("chatbot-messages");

  const botResponses = {
    "retail": "✅ Retail Analytics demo report: <a href='https://your-retail-report.com' target='_blank'>View Report</a>",
    "finance": "✅ Finance Analytics demo report: <a href='https://your-finance-report.com' target='_blank'>View Report</a>",
    "hr": "✅ HR Analytics demo report: <a href='https://your-hr-report.com' target='_blank'>View Report</a>",
    "hello": "Hello! Ask me about reports: Retail, Finance, HR...",
    "hi": "Hi there! I can provide demo reports for Retail, Finance, HR...",
    "default": "Sorry, I didn't understand that. Please ask about Retail, Finance, or HR reports."
  };

  toggleBtn.addEventListener("click", ()=>chatbot.style.display="flex");
  closeBtn.addEventListener("click", ()=>chatbot.style.display="none");
  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", e => { if(e.key==="Enter") sendMessage(); });

  function sendMessage(){
    const userText = input.value.trim();
    if(!userText) return;
    addMessage(userText,"user");
    input.value="";
    setTimeout(()=>{
      const response = botResponses[userText.toLowerCase()] || botResponses["default"];
      addMessage(response,"bot");
    }, 800);
  }

  function addMessage(text,sender){
    const div = document.createElement("div");
    div.classList.add("chatbot-message",sender);
    div.innerHTML = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }
})();
