document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("chatbot-toggle");
  const chatWindow = document.getElementById("chatbot-window");
  const closeBtn = document.getElementById("chatbot-close");
  const sendBtn = document.getElementById("chatbot-send");
  const input = document.getElementById("chatbot-input");
  const body = document.getElementById("chatbot-body");
  const botSound = document.getElementById("bot-sound");
  const userSound = document.getElementById("user-sound");
  const soundCheckbox = document.getElementById("sound-checkbox");

  if (!toggleBtn || !chatWindow) return; // safety check

  const playSound = (type) => {
    if (!soundCheckbox.checked) return;
    if (type === "bot") botSound.play();
    if (type === "user") userSound.play();
  };

  const scrollToBottom = () => {
    body.scrollTop = body.scrollHeight;
  };

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

  const sendMessage = () => {
    const msg = input.value.trim();
    if (!msg) return;

    // user message
    const userMsg = document.createElement("div");
    userMsg.classList.add("user-msg");
    userMsg.textContent = msg;
    body.appendChild(userMsg);
    scrollToBottom();
    playSound("user");
    input.value = "";

    // bot typing
    const typing = document.createElement("div");
    typing.classList.add("bot-msg");
    typing.textContent = "AI is typing...";
    typing.style.opacity = 0.6;
    body.appendChild(typing);
    scrollToBottom();

    setTimeout(() => {
      body.removeChild(typing);
      const botMsg = document.createElement("div");
      botMsg.classList.add("bot-msg");
      botMsg.textContent = `I’m here to help! You asked: ${msg}`;
      body.appendChild(botMsg);
      scrollToBottom();
      playSound("bot");
    }, 1200);
  };

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
