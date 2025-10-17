// ================= MENU TOGGLE =================
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });


    // ================= THEME TOGGLE =================
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const html = document.documentElement;
  themeToggleBtn.addEventListener("click", () => {
    if (html.dataset.theme === "dark") {
      html.dataset.theme = "light";
      themeToggleBtn.textContent = "🌞";
    } else {
      html.dataset.theme = "dark";
      themeToggleBtn.textContent = "🌙";
    }
  });


  // ================= SCROLL TO TOP =================
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollTopBtn.style.display = "block";
    } else {
      scrollTopBtn.style.display = "none";
    }
  });
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });


  
 // ================= HERO & SECTION ANIMATION =================
  const animateElements = document.querySelectorAll("[data-animate]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.2 }
  );
  animateElements.forEach((el) => observer.observe(el));


/*------------- js/about.js ------*/
/* CSP-safe external script.
   Responsibilities:
   - reveal elements with data-animate using IntersectionObserver
   - add 'glow' class to contact button when revealed
   - smooth-scroll to #contact when button clicked
*/

(function () {
  'use strict';

  // Helper: safe query
  function $q(selector, root) {
    return (root || document).querySelector(selector);
  }

  function onDOMReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onDOMReady(function () {
    var animated = document.querySelectorAll('[data-animate]');
    var contactBtn = $q('#contactBtn');

    // IntersectionObserver options
    var obsOptions = {
      root: null,
      rootMargin: '0px 0px -8% 0px', // reveal a bit before element fully in view
      threshold: 0.12
    };

    if ('IntersectionObserver' in window && animated.length) {
      var obs = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // When section fully visible, add glow to button (only once)
            if (contactBtn && entry.target.closest('.about-section')) {
              // small timeout to let reveal settle
              setTimeout(function () {
                contactBtn.classList.add('glow');
              }, 160);
            }
            observer.unobserve(entry.target);
          }
        });
      }, obsOptions);

      animated.forEach(function (el) {
        obs.observe(el);
      });
    } else {
      // Fallback: if IntersectionObserver is not supported
      animated.forEach(function (el) {
        el.classList.add('visible');
      });
      if (contactBtn) contactBtn.classList.add('glow');
    }

    // Smooth scroll to #contact (if present)
    if (contactBtn) {
      contactBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var contactSection = document.getElementById('contact');
        if (contactSection) {
          // use native smooth scroll if available
          contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // set focus for accessibility
          contactSection.setAttribute('tabindex', '-1');
          contactSection.focus({ preventScroll: true });
        } else {
          // fallback: tries to open mailto if no contact section
          window.location.href = 'mailto:your-email@example.com';
        }
      });
    }

  });
})();



  
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

/* ================= VISUAL UPGRADE: NEON CHATBOT WITH NOTIFICATION BUBBLE (CSP-SAFE) ================= */
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
        if (isOpen) hideNotification();
    }

    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // Append message with fade-in and neon effect
    function appendMessage(text, className) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chatbot-message', className, 'fade-in');
        msgDiv.textContent = text;
        bodyEl.appendChild(msgDiv);
        scrollToBottom();
        requestAnimationFrame(() => {
            msgDiv.style.opacity = 1;
            msgDiv.style.transform = 'translateY(0)';
        });
    }

    // Scroll chat to bottom
    function scrollToBottom() {
        bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    // Animated typing dots
    function showTypingIndicator() {
        typingEl.innerHTML = '';
        typingEl.style.display = 'block';
        const dots = ['.', '..', '...'];
        let i = 0;
        const interval = setInterval(() => {
            typingEl.textContent = 'Typing' + dots[i % dots.length];
            i++;
        }, 400);
        return interval;
    }

    // Show notification bubble with animation
    function showNotification() {
        notificationEl.style.display = 'block';
        notificationEl.classList.add('pulse');
    }

    function hideNotification() {
        notificationEl.style.display = 'none';
        notificationEl.classList.remove('pulse');
    }

    // Handle sending message
    function sendMessage() {
        const message = inputEl.value.trim();
        if (!message) return;

        appendMessage(message, 'user-msg');
        inputEl.value = '';

        const typingInterval = showTypingIndicator();

        setTimeout(() => {
            clearInterval(typingInterval);
            typingEl.style.display = 'none';

            const botResponse = getBotResponse(message);
            appendMessage(botResponse, 'bot-msg');

            // Show notification if window is closed
            if (!chatbotWindow.classList.contains('open')) {
                showNotification();
            }
        }, 1200);
    }

    sendBtn.addEventListener('click', sendMessage);
    inputEl.addEventListener('keypress', e => {
        if (e.key === 'Enter') sendMessage();
    });

    // Close chatbot when clicking outside
    document.addEventListener('click', e => {
        if (!chatbotWindow.contains(e.target) && !toggleBtn.contains(e.target)) {
            chatbotWindow.classList.remove('open');
            toggleBtn.textContent = '💬';
        }
    });
});

