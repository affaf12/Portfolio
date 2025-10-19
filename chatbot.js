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

  // ===== Question & Answer Lists =====
  const questions = [
    "hello",
    "hi",
    "hy",
    "how are you",
    "what is your name",
    "help"
  ];

  const answers = [
    "Hello! How can I help you today?",
    "Hi there! How can I assist you?",
    "Hy there! How can I help you?",
    "I’m just a bot, but I’m doing great! How about you?",
    "I’m your friendly chatbot!",
    "Sure! I’m here to help. What do you need assistance with?"
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
