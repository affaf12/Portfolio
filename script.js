/* ================= MENU TOGGLE ================= */
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));

/* ================= THEME TOGGLE ================= */
const themeBtn = document.getElementById('theme-toggle');
const html = document.documentElement;
if(localStorage.getItem('theme')) {
  html.dataset.theme = localStorage.getItem('theme');
  themeBtn.innerHTML = html.dataset.theme==='dark' ? "<i class='bx bx-moon'></i>" : "<i class='bx bx-sun'></i>";
}
themeBtn.addEventListener('click', () => {
  html.dataset.theme = html.dataset.theme==='dark' ? 'light' : 'dark';
  localStorage.setItem('theme', html.dataset.theme);
  themeBtn.innerHTML = html.dataset.theme==='dark' ? "<i class='bx bx-moon'></i>" : "<i class='bx bx-sun'></i>";
});

/* ================= SCROLL BUTTON & STICKY HEADER ================= */

const scrollTopBtn = document.getElementById("scrollTopBtn");
const header = document.querySelector("header");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;

  // Show/hide scroll button with fade
  if (currentScroll > 200) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }

  // Sticky header slide down/up
  if (currentScroll > 50) {
    if (currentScroll > lastScroll) {
      // scrolling down
      header.style.transform = "translateY(-120px)";
    } else {
      // scrolling up
      header.style.transform = "translateY(0)";
    }
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
    header.style.transform = "translateY(0)";
  }

  lastScroll = currentScroll;
});

// Smooth scroll to top
scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


/* ================= ACTIVE NAV LINK & SECTION ANIMATION ================= */
const sections = document.querySelectorAll('section, .hero h1, .hero h3');
const navLinks = document.querySelectorAll('nav ul li a');

/* Intersection Observer for section animations */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.2 });
sections.forEach(sec => observer.observe(sec));

/* Highlight nav link based on scroll */
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if(window.scrollY >= sec.offsetTop - 100) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => link.classList.remove('active'));
  navLinks.forEach(link => { if(link.getAttribute('href') === '#'+current) link.classList.add('active'); });
});

/* ================= CLEAN CHATBOT JS ================= */
document.addEventListener("DOMContentLoaded", () => {
  const chatbotWindow = document.getElementById('chatbot');
  const toggleBtnEl = document.getElementById('chatbot-toggle');
  const closeBtnEl = document.getElementById('chatbot-close');
  const sendBtnEl = document.getElementById('chatbot-send');
  const inputEl = document.getElementById('chatbot-input');
  const bodyEl = document.getElementById('chatbot-body');
  const typingEl = document.getElementById('typing-indicator');
  const quickRepliesEl = document.getElementById('chatbot-quick-replies');
  const notificationEl = document.getElementById('chatbot-notification');
  const headerEl = document.getElementById('chatbot-header');

  let inactivityTimer;
  const chatSound = new Audio('https://www.soundjay.com/buttons/sounds/button-16.mp3');

  /* ---------------- TOGGLE ---------------- */
  toggleBtnEl.addEventListener('click', () => {
    chatbotWindow.classList.toggle('open');
    if (chatbotWindow.classList.contains('open')) {
      notificationEl.style.display = 'none';
    }
    resetInactivityTimer();
  });

  /* ---------------- CLOSE ---------------- */
  closeBtnEl.addEventListener('click', () => chatbotWindow.classList.remove('open'));

  /* ---------------- SEND MESSAGE ---------------- */
  sendBtnEl.addEventListener('click', () => sendMessage());
  inputEl.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
  });

  /* ---------------- AUTO-HIDE ---------------- */
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => chatbotWindow.classList.remove('open'), 60000);
  }

  /* ---------------- DRAG UP/DOWN ONLY ---------------- */
  let isDragging = false, offsetY;
  headerEl.addEventListener('mousedown', e => {
    isDragging = true;
    offsetY = e.clientY - chatbotWindow.offsetTop;
  });
  document.addEventListener('mouseup', () => isDragging = false);
  document.addEventListener('mousemove', e => {
    if (isDragging) {
      chatbotWindow.style.top = `${e.clientY - offsetY}px`;
      chatbotWindow.style.right = `25px`; // lock to right side
    }
  });

  /* ---------------- SEND MESSAGE FUNCTION ---------------- */
  function sendMessage(msg = null) {
    const message = msg || inputEl.value.trim();
    if (!message) return;

    const userMsg = document.createElement('div');
    userMsg.className = 'chatbot-message user-msg';
    userMsg.textContent = message;
    bodyEl.appendChild(userMsg);
    inputEl.value = '';
    scrollToBottom();

    quickRepliesEl.innerHTML = '';
    typingEl.style.display = 'block';
    resetInactivityTimer();

    setTimeout(() => {
      typingEl.style.display = 'none';
      const botMsg = document.createElement('div');
      botMsg.className = 'chatbot-message bot-msg';
      botMsg.textContent = getBotResponse(message);

      // Emoji reactions
      const reactions = document.createElement('div');
      reactions.className = 'emoji-reactions';
      ['👍','❤️','😂'].forEach(emoji => {
        const span = document.createElement('span');
        span.textContent = emoji;
        span.onclick = () => alert(`You reacted with ${emoji}`);
        reactions.appendChild(span);
      });
      botMsg.appendChild(reactions);

      bodyEl.appendChild(botMsg);
      scrollToBottom();
      addQuickReplies(message);

      chatSound.play();
      if (!chatbotWindow.classList.contains('open')) {
        notificationEl.style.display = 'inline-block';
      }
    }, 1000);
  }

  function scrollToBottom() {
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  /* ---------------- BOT RESPONSE ---------------- */
  function getBotResponse(msg) {
    msg = msg.toLowerCase();
    if (msg.includes('hello') || msg.includes('hi'))
      return "Hello! 👋 How can I help you today?";
    if (msg.includes('power bi'))
      return "✅ Yes! I make amazing Power BI dashboards!";
    return "🤖 I'm here to assist you!";
  }

  /* ---------------- QUICK REPLIES ---------------- */
  function addQuickReplies(msg) {
    const replies = [];
    msg = msg.toLowerCase();
    if (msg.includes('hello')) replies.push('Power BI', 'Portfolio', 'Contact');
    if (msg.includes('power bi')) replies.push('Show demo', 'Pricing', 'Contact');

    replies.forEach(text => {
      const btn = document.createElement('button');
      btn.className = 'quick-btn';
      btn.textContent = text;
      btn.onclick = () => sendMessage(text);
      quickRepliesEl.appendChild(btn);
    });
  }
});



/* ================= SKILL CIRCLES ================= */
document.querySelectorAll('.skill-circle').forEach(circle => {
  const percent = circle.dataset.percent;
  const progress = circle.querySelector('.progress');
  const percentText = circle.querySelector('.percent');
  const offset = 314 - (314 * percent)/100;
  setTimeout(() => {
    progress.style.strokeDashoffset = offset;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      percentText.textContent = count+'%';
      if(count >= percent) clearInterval(interval);
    }, 12);
  }, 500);
});

/* ================= HERO TYPING EFFECT ================= */
const typingText = document.getElementById('typing-text');
const words = ["Data Analyst","Power BI Developer","SQL Specialist","Python Programmer","Excel Expert","BI Consultant"];
let wordIndex=0, charIndex=0;
function type() {
  if(wordIndex>=words.length) wordIndex=0;
  const word = words[wordIndex];
  typingText.textContent = word.slice(0,charIndex);
  charIndex++;
  if(charIndex>word.length){ charIndex=0; wordIndex++; setTimeout(type,1000); }
  else setTimeout(type,150);
}
type();
