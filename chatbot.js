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

  // ===== Safety check =====
  if (!toggleBtn || !chatWindow || !sendBtn || !input || !body) return;

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

  // Close chat when clicking outside
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

  // ===== Bot Reply =====
  const botReply = (message) => {
    const botMsg = document.createElement("div");
    botMsg.classList.add("bot-msg");
    botMsg.textContent = `I’m here to help! You asked: ${message}`;
    body.appendChild(botMsg);
    scrollToBottom();
    playSound("bot");
  };

  // ===== Send Message =====
  const sendMessage = () => {
    const msg = input.value.trim();
    if (!msg) return;

    // --- User Message ---
    const userMsg = document.createElement("div");
    userMsg.classList.add("user-msg");
    userMsg.textContent = msg;
    body.appendChild(userMsg);
    scrollToBottom();
    playSound("user");
    input.value = "";

    // --- Bot Typing ---
    const typing = showTypingAnimation();

    setTimeout(() => {
      body.removeChild(typing);
      botReply(msg);
    }, 1200);
  };

  // ===== Event Listeners =====
  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
