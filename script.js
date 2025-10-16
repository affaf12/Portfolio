/* ================= MENU TOGGLE ================= */
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  /* ================= HEADER SCROLL ================= */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });


    /* ================= HERO ANIMATION ================= */
  const heroText = document.querySelectorAll('.hero-text span');
  let index = 0;

  function showNextHeroWord() {
    heroText.forEach((el, i) => {
      el.style.opacity = i === index ? '1' : '0';
    });
    index = (index + 1) % heroText.length;
  }

  if (heroText.length > 0) {
    showNextHeroWord();
    setInterval(showNextHeroWord, 3000);
  }

  
  
  // ================= THEME TOGGLE =================
  const themeBtn = document.getElementById('theme-toggle-btn');
  const htmlTag = document.documentElement;
  themeBtn.addEventListener('click', () => {
    if (htmlTag.getAttribute('data-theme') === 'dark') {
      htmlTag.setAttribute('data-theme', 'light');
      themeBtn.textContent = '🌙';
    } else {
      htmlTag.setAttribute('data-theme', 'dark');
      themeBtn.textContent = '☀️';
    }
  });

  /* ================= SKILLS ANIMATION ================= */
  const skills = [
    { name: 'Power BI', percent: 90 },
    { name: 'SQL', percent: 85 },
    { name: 'Python', percent: 80 },
    { name: 'Excel', percent: 95 }
  ];

  const skillsContainer = document.querySelector('.skills-grid');

  if (skillsContainer) {
    skillsContainer.innerHTML = '';
    skills.forEach(skill => {
      const skillEl = document.createElement('div');
      skillEl.className = 'skill';
      skillEl.innerHTML = `
        <div class="skill-circle">
          <svg viewBox="0 0 36 36">
            <path class="circle-bg" d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <path class="circle"
              stroke-dasharray="${skill.percent}, 100"
              d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"/>
          </svg>
          <div class="skill-text">${skill.name} <span>${skill.percent}%</span></div>
        </div>
      `;
      skillsContainer.appendChild(skillEl);
    });
  }
});
  // ================= SLIDERS =================
  function initSlider(wrapperSelector, leftBtnSelector, rightBtnSelector) {
    const wrapper = document.querySelector(wrapperSelector);
    const leftBtn = document.querySelector(leftBtnSelector);
    const rightBtn = document.querySelector(rightBtnSelector);
    let scrollAmount = 0;
    const cardWidth = wrapper.children[0]?.offsetWidth || 0;
    
    leftBtn?.addEventListener('click', () => {
      wrapper.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });
    rightBtn?.addEventListener('click', () => {
      wrapper.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });
  }

  // Initialize sliders
  initSlider('.achievements-wrapper', '.ach-left-btn', '.ach-right-btn');
  initSlider('.projects-wrapper', '.left-btn', '.right-btn');

  
  
  // ================= SCROLL TO TOP =================
 const scrollTopBtn = document.getElementById('scrollTopBtn');

// Show/hide button based on scroll position
window.addEventListener('scroll', () => {
  if (window.scrollY > 200) { // Show after 200px scroll
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
});

// Scroll smoothly to top when button is clicked
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});



  
  // ================= CONTACT BUTTON SCROLL =================
  const contactBtn = document.getElementById('contactBtn');
  contactBtn?.addEventListener('click', () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  });






/* ================= CHATBOT QUESTION-ANSWER LIST ================= */
const chatbotQA = [
  { question: ["hi", "hello", "hey"], answer: "Hello! 👋 How can I help you today?" },
  { question: ["power bi", "dashboard", "bi report"], answer: "✅ Yes! I build amazing Power BI dashboards. Here is a demo you can check out: [Insert Your Demo Link Here]" },
  { question: ["contact", "email", "reach you"], answer: "📩 You can reach me at muhammadaffaf746@gmail.com" },
  { question: ["portfolio", "projects", "work"], answer: "💼 Check out my projects in the Projects section of this site!" },
  { question: ["services", "what do you do"], answer: "I provide Data Analytics, Power BI, SQL, and Excel consulting services." },
  { question: ["pricing", "cost"], answer: "💰 For pricing details, please contact me directly via email." },
  { question: ["demo", "show me demo"], answer: "🎯 I can show you live demos of my Power BI dashboards!" },

  {
    question: ["hr report", "human resources report", "employee report", "hr dashboard", "hr"],
    answer: `✅ Yes! I create HR reports.\nHere is a demo you can check out:\n[View HR Report Demo](https://docs.google.com/spreadsheets/d/1rD8TMk15laPGiJnlZ1adgiJ0EgNZrB6x9yJDw8eOLcc/edit?usp=sharing)`
  },

  { question: ["financial report", "finance dashboard", "financial analysis", "finance"], 
    answer: `✅ Yes! I create Financial Reports.\nHere is a demo you can check out:\n[View Financial Reports Demo](https://docs.google.com/spreadsheets/d/1fk0qtcJL0y7kwCffg15sxfU8r54TVQRjTMCBUmxfKAs/edit?usp=sharing)`
  },
  { question: ["healthcare report", "medical dashboard", "hospital report", "healthcare"], 
    answer: `✅ Yes! I create Healthcare Report.\nHere is a demo you can check out:\n[View Healthcare Report Demo](https://docs.google.com/spreadsheets/d/1XDlhtOG2W0MDDav1k7zNzexls8UZHxZJRax52k7mrjs/edit?usp=sharing)`
  },
  { question: ["sales report", "sales dashboard", "revenue report", "sales"], 
    answer: `✅ Yes! I create Sales reports.\nHere is a demo you can check out:\n[View Sales Report Demo](https://docs.google.com/spreadsheets/d/1ujKebcqgvmkDIesR5SPr-6MyskX0x8zfmZ_j36r2uIA/edit?usp=sharing)`
  },
  { question: ["marketing report", "marketing dashboard", "campaign report", "marketing"],
   answer: `✅ Yes! I create Marketing reports.\nHere is a demo you can check out:\n[View Marketing Report Demo](https://docs.google.com/spreadsheets/d/1VLzDL_6mL7YgnSr_pycnCjF_K0R4GL9IoxJyksVxGmg/edit?usp=sharing)` 
  },
  { question: ["insurance report", "insurance dashboard", "policy report", "insurance"], 
     answer: `✅ Yes! I create insurance reports.\nHere is a demo you can check out:\n[View insurance Report Demo](https://docs.google.com/spreadsheets/d/1A7XHQKQpI8jqpJg8sYmTR3XgZpAog8HtrxOV-0e9nwg/edit?usp=sharing)` 
  },
  { question: ["real estate report", "property dashboard", "housing report", "real estate analysis", "real estate"],
    answer: `✅ Yes! I create Real Estate reports.\nHere is a demo you can check out:\n[View Real Estate Report Demo](https://docs.google.com/spreadsheets/d/1ZvE4UOfhsbjqa3ITObon1soxBrJPLMUgvCzSHdCYQ6c/edit?usp=sharing)`
 },
  {
  question: ["logistics report", "supply chain dashboard", "shipment report"],
  answer: `✅ Yes! I create Logistics & Supply Chain reports.\nHere is a demo you can check out:\n[View Logistics Report Demo](https://docs.google.com/spreadsheets/d/1pFr8wy-9KO1yCyWW5AKpGgKS2b87lF7Exf80skzPaCU/edit?usp=sharing)`
},
];


/* ================= GET BOT RESPONSE FUNCTION ================= */
function getBotResponse(message) {
  const msg = message.toLowerCase().trim();
  for (let qa of chatbotQA) {
    for (let keyword of qa.question) {
      if (msg.includes(keyword.toLowerCase())) return qa.answer;
    }
  }
  return "🤖 I'm here to assist you!";
}

/* ================= UPGRADED CHATBOT JS ================= */
document.addEventListener("DOMContentLoaded", () => {
  const chatbotWindow = document.getElementById('chatbot-window');
  const toggleBtn = document.getElementById('chatbot-toggle');
  const closeBtn = document.getElementById('chatbot-close');
  const sendBtn = document.getElementById('chatbot-send');
  const inputEl = document.getElementById('chatbot-input');
  const bodyEl = document.getElementById('chatbot-body');
  const typingEl = document.getElementById('typing-indicator');
  const notificationEl = document.getElementById('chatbot-notification');

  // Toggle chatbot open/close
  function toggleChat() {
    const isOpen = chatbotWindow.classList.toggle('open');
    toggleBtn.classList.toggle('open', isOpen);
    toggleBtn.textContent = isOpen ? "❌" : "💬";
    if(isOpen) notificationEl.style.display = 'none';
  }

  toggleBtn.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);

  // Send message
  function sendMessage() {
    const message = inputEl.value.trim();
    if (!message) return;

    appendMessage(message, 'user-msg');
    inputEl.value = '';
    scrollToBottom();

    // Show typing
    typingEl.style.display = 'block';

    setTimeout(() => {
      typingEl.style.display = 'none';
      const botResponse = getBotResponse(message);
      appendMessage(botResponse, 'bot-msg');

      // Show notification if window is closed
      if(!chatbotWindow.classList.contains('open')) {
        notificationEl.style.display = 'block';
      }
    }, 800);
  }

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keypress', e => { if(e.key === 'Enter') sendMessage(); });

  function appendMessage(text, className) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chatbot-message', className);
    msgDiv.textContent = text;
    bodyEl.appendChild(msgDiv);
    scrollToBottom();
  }

  function scrollToBottom() {
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function getBotResponse(msg) {
    msg = msg.toLowerCase();
    if(msg.includes('hello') || msg.includes('hi')) return 'Hello there! How can I help you today?';
    if(msg.includes('how are you')) return "I am a bot, so I don't have feelings, but I'm working well!";
    if(msg.includes('name')) return 'I am a neon-style chatbot created with HTML, CSS & JS.';
    if(msg.includes('bye')) return 'Goodbye! Have a great day!';
    return "I am sorry, I don't understand that. Can you rephrase?";
  }
});
