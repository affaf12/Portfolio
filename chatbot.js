// ================= ULTRA-MODERN CHATBOT JS (FINAL OPTIMIZED VERSION) =================
document.addEventListener("DOMContentLoaded", () => {
  // ===== GET ELEMENTS =====
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

  /* ================= CHATBOT QUESTION-ANSWER LIST (CLEAN VERSION) ================= */
  const chatbotQA = [
    {
      question: ["hi", "hello", "hey"],
      answer: "Hello! How can I help you today?"
    },
    {
      question: ["power bi", "dashboard", "bi report"],
      answer: "Yes! I build amazing Power BI dashboards. Here is a demo you can check out: [Insert Your Demo Link Here]"
    },
    {
      question: ["contact", "email", "reach you"],
      answer: "You can reach me at muhammadaffaf746@gmail.com"
    },
    {
      question: ["portfolio", "projects", "work"],
      answer: "Check out my projects in the Projects section of this site!"
    },
    {
      question: ["services", "what do you do"],
      answer: "I provide Data Analytics, Power BI, SQL, and Excel consulting services."
    },
    {
      question: ["pricing", "cost"],
      answer: "For pricing details, please contact me directly via email."
    },
    {
      question: ["demo", "show me demo"],
      answer: "I can show you live demos of my Power BI dashboards!"
    },
    {
      question: ["hr report", "human resources report", "employee report", "hr dashboard", "hr"],
      answer: `Yes! I create HR reports.\nHere is a demo you can check out:\n[View HR Report Demo](https://docs.google.com/spreadsheets/d/1rD8TMk15laPGiJnlZ1adgiJ0EgNZrB6x9yJDw8eOLcc/edit?usp=sharing)`
    },
    {
      question: ["financial report", "finance dashboard", "financial analysis", "finance"],
      answer: `Yes! I create Financial Reports.\nHere is a demo you can check out:\n[View Financial Reports Demo](https://docs.google.com/spreadsheets/d/1fk0qtcJL0y7kwCffg15sxfU8r54TVQRjTMCBUmxfKAs/edit?usp=sharing)`
    },
    {
      question: ["healthcare report", "medical dashboard", "hospital report", "healthcare"],
      answer: `Yes! I create Healthcare Reports.\nHere is a demo you can check out:\n[View Healthcare Report Demo](https://docs.google.com/spreadsheets/d/1XDlhtOG2W0MDDav1k7zNzexls8UZHxZJRax52k7mrjs/edit?usp=sharing)`
    },
    {
      question: ["sales report", "sales dashboard", "revenue report", "sales"],
      answer: `Yes! I create Sales Reports.\nHere is a demo you can check out:\n[View Sales Report Demo](https://docs.google.com/spreadsheets/d/1ujKebcqgvmkDIesR5SPr-6MyskX0x8zfmZ_j36r2uIA/edit?usp=sharing)`
    },
    {
      question: ["marketing report", "marketing dashboard", "campaign report", "marketing"],
      answer: `Yes! I create Marketing Reports.\nHere is a demo you can check out:\n[View Marketing Report Demo](https://docs.google.com/spreadsheets/d/1VLzDL_6mL7YgnSr_pycnCjF_K0R4GL9IoxJyksVxGmg/edit?usp=sharing)`
    },
    {
      question: ["insurance report", "insurance dashboard", "policy report", "insurance"],
      answer: `Yes! I create Insurance Reports.\nHere is a demo you can check out:\n[View Insurance Report Demo](https://docs.google.com/spreadsheets/d/1A7XHQKQpI8jqpJg8sYmTR3XgZpAog8HtrxOV-0e9nwg/edit?usp=sharing)`
    },
    {
      question: ["real estate report", "property dashboard", "housing report", "real estate analysis", "real estate"],
      answer: `Yes! I create Real Estate Reports.\nHere is a demo you can check out:\n[View Real Estate Report Demo](https://docs.google.com/spreadsheets/d/1ZvE4UOfhsbjqa3ITObon1soxBrJPLMUgvCzSHdCYQ6c/edit?usp=sharing)`
    },
    {
      question: ["logistics report", "supply chain dashboard", "shipment report"],
      answer: `Yes! I create Logistics and Supply Chain Reports.\nHere is a demo you can check out:\n[View Logistics Report Demo](https://docs.google.com/spreadsheets/d/1pFr8wy-9KO1yCyWW5AKpGgKS2b87lF7Exf80skzPaCU/edit?usp=sharing)`
    }
  ];

  // ===== PLAY SOUND =====
  const playSound = (type) => {
    if (!soundCheckbox?.checked) return;
    if (type === "bot") botSound?.play();
    if (type === "user") userSound?.play();
  };

  // ===== SCROLL BOTTOM =====
  const scrollToBottom = () => {
    body.scrollTo({ top: body.scrollHeight, behavior: "smooth" });
  };

  // ===== TOGGLE CHAT WINDOW =====
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

  // ===== TYPING ANIMATION =====
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

  // ===== BOT REPLY =====
  const botReply = (message) => {
    const lowerMsg = message.toLowerCase().trim();
    let reply = "Sorry, I didn’t understand that. Could you rephrase?";

    for (const qa of chatbotQA) {
      if (qa.question.some(q => lowerMsg.includes(q))) {
        reply = qa.answer;
        break;
      }
    }

    const botMsg = document.createElement("div");
    botMsg.classList.add("bot-msg");

    // Support Markdown-like link display
    if (reply.includes("[") && reply.includes("](")) {
      const formatted = reply.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
      botMsg.innerHTML = formatted.replace(/\n/g, "<br>");
    } else {
      botMsg.textContent = reply;
    }

    body.appendChild(botMsg);
    scrollToBottom();
    playSound("bot");
  };

  // ===== SEND MESSAGE =====
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
    }, 1000);
  };

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
