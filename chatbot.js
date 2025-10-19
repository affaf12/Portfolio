// ================= ULTRA-MODERN CHATBOT JS =================
document.addEventListener("DOMContentLoaded", () => {
  // ===== Get elements =====
  const toggleBtn = document.getElementById("chatbot-toggle");
  const chatWindow = document.getElementById("chatbot-window");
  const closeBtn = document.getElementById("chatbot-close");
  const sendBtn = document.getElementById("chatbot-send");
  const input = document.getElementById("chatbot-input");
  const body = document.getElementById("chatbot-body");
  const botSound = document.getElementById("bot-sound");
  const userSound = document.getElementById("user-sound");
  const soundCheckbox = document.getElementById("sound-checkbox");

  if (!toggleBtn || !chatWindow || !sendBtn || !input || !body) return;

 // ===== CHATBOT QUESTIONS =====
const questions = [
  "hi",
  "hello",
  "hey",
  "power bi",
  "dashboard",
  "bi report",
  "contact",
  "email",
  "reach you",
  "portfolio",
  "projects",
  "work",
  "services",
  "what do you do",
  "pricing",
  "cost",
  "demo",
  "show me demo",
  "hr report",
  "human resources report",
  "employee report",
  "hr dashboard",
  "hr",
  "financial report",
  "finance dashboard",
  "financial analysis",
  "finance",
  "healthcare report",
  "medical dashboard",
  "hospital report",
  "healthcare",
  "sales report",
  "sales dashboard",
  "revenue report",
  "sales",
  "marketing report",
  "marketing dashboard",
  "campaign report",
  "marketing",
  "insurance report",
  "insurance dashboard",
  "policy report",
  "insurance",
  "real estate report",
  "property dashboard",
  "housing report",
  "real estate analysis",
  "real estate",
  "logistics report",
  "supply chain dashboard",
  "shipment report"
];

// ===== CHATBOT ANSWERS =====
const answers = [
  "Hello! How can I help you today?",
  "Yes! I build amazing Power BI dashboards. Here is a demo you can check out: [Insert Your Demo Link Here]",
  "You can reach me at muhammadaffaf746@gmail.com",
  "Check out my projects in the Projects section of this site!",
  "I provide Data Analytics, Power BI, SQL, and Excel consulting services.",
  "For pricing details, please contact me directly via email.",
  "I can show you live demos of my Power BI dashboards!",
  "Yes! I create HR reports.\nHere is a demo you can check out:\n[View HR Report Demo](https://docs.google.com/spreadsheets/d/1rD8TMk15laPGiJnlZ1adgiJ0EgNZrB6x9yJDw8eOLcc/edit?usp=sharing)",
  "Yes! I create Financial Reports.\nHere is a demo you can check out:\n[View Financial Reports Demo](https://docs.google.com/spreadsheets/d/1fk0qtcJL0y7kwCffg15sxfU8r54TVQRjTMCBUmxfKAs/edit?usp=sharing)",
  "Yes! I create Healthcare Report.\nHere is a demo you can check out:\n[View Healthcare Report Demo](https://docs.google.com/spreadsheets/d/1XDlhtOG2W0MDDav1k7zNzexls8UZHxZJRax52k7mrjs/edit?usp=sharing)",
  "Yes! I create Sales reports.\nHere is a demo you can check out:\n[View Sales Report Demo](https://docs.google.com/spreadsheets/d/1ujKebcqgvmkDIesR5SPr-6MyskX0x8zfmZ_j36r2uIA/edit?usp=sharing)",
  "Yes! I create Marketing reports.\nHere is a demo you can check out:\n[View Marketing Report Demo](https://docs.google.com/spreadsheets/d/1VLzDL_6mL7YgnSr_pycnCjF_K0R4GL9IoxJyksVxGmg/edit?usp=sharing)",
  "Yes! I create Insurance reports.\nHere is a demo you can check out:\n[View Insurance Report Demo](https://docs.google.com/spreadsheets/d/1A7XHQKQpI8jqpJg8sYmTR3XgZpAog8HtrxOV-0e9nwg/edit?usp=sharing)",
  "Yes! I create Real Estate reports.\nHere is a demo you can check out:\n[View Real Estate Report Demo](https://docs.google.com/spreadsheets/d/1ZvE4UOfhsbjqa3ITObon1soxBrJPLMUgvCzSHdCYQ6c/edit?usp=sharing)",
  "Yes! I create Logistics & Supply Chain reports.\nHere is a demo you can check out:\n[View Logistics Report Demo](https://docs.google.com/spreadsheets/d/1pFr8wy-9KO1yCyWW5AKpGgKS2b87lF7Exf80skzPaCU/edit?usp=sharing)"
];


  // ===== Helper: Play sound =====
  const playSound = (type) => {
    if (!soundCheckbox?.checked) return;
    if (type === "bot") botSound?.play();
    if (type === "user") userSound?.play();
  };

  // ===== Helper: Smooth scroll =====
  const scrollToBottom = () => {
    body.scrollTo({ top: body.scrollHeight, behavior: "smooth" });
  };

  // ===== Toggle Chat Window =====
  const toggleChat = () => {
    chatWindow.classList.toggle("chatbot-visible");
    toggleBtn.classList.toggle("pulse");
  };

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleChat();
  });

  closeBtn.addEventListener("click", () => {
    chatWindow.classList.remove("chatbot-visible");
    toggleBtn.classList.remove("pulse");
  });

  document.addEventListener("click", (e) => {
    if (!chatWindow.contains(e.target) && !toggleBtn.contains(e.target)) {
      chatWindow.classList.remove("chatbot-visible");
      toggleBtn.classList.remove("pulse");
    }
  });

  // ===== Bot Typing Animation =====
  const showTypingAnimation = () => {
    const typing = document.createElement("div");
    typing.classList.add("bot-msg");
    typing.textContent = "AI is typing";

    const dots = document.createElement("span");
    dots.textContent = "...";
    dots.classList.add("typing-dots");
    typing.appendChild(dots);

    typing.style.opacity = 0.6;
    body.appendChild(typing);
    scrollToBottom();
    return typing;
  };

  // ===== Bot Reply (Case-insensitive matching) =====
  const botReply = (message) => {
    const lowerMsg = message.toLowerCase().trim(); // convert everything to lowercase
    let reply = null;

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (lowerMsg.includes(q)) { // simple, reliable matching
        reply = answers[i];
        break;
      }
    }

    // Default reply if no match
    if (!reply) reply = "Sorry, I didn’t understand that. Could you rephrase?";

    const botMsg = document.createElement("div");
    botMsg.classList.add("bot-msg");
    botMsg.textContent = reply;
    body.appendChild(botMsg);
    scrollToBottom();
    playSound("bot");
  };

  // ===== Send Message =====
  const sendMessage = () => {
    const msg = input.value.trim();
    if (!msg) return;

    const userMsg = document.createElement("div");
    userMsg.classList.add("user-msg");
    userMsg.textContent = msg;
    body.appendChild(userMsg);
    scrollToBottom();
    playSound("user");
    input.value = "";

    const typing = showTypingAnimation();

    setTimeout(() => {
      body.removeChild(typing);
      botReply(msg);
    }, 1200);
  };

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
