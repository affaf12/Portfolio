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

// ================= PROJECTS SLIDER =================


const slider = document.querySelector(".projects-wrapper");
const slides = document.querySelectorAll(".project-card");
const nextBtn = document.querySelector(".right-btn");
const prevBtn = document.querySelector(".left-btn");

let index = 0;
let slideInterval;

// Show specific slide
function showSlide(i) {
  index = (i + slides.length) % slides.length;
  slider.style.transform = `translateX(${-index * 100}%)`;
}

// Navigation buttons
nextBtn.addEventListener("click", () => {
  nextSlide();
  resetAutoplay();
});
prevBtn.addEventListener("click", () => {
  prevSlide();
  resetAutoplay();
});

function nextSlide() { showSlide(index + 1); }
function prevSlide() { showSlide(index - 1); }

// Autoplay every 5s
function startAutoplay() {
  slideInterval = setInterval(nextSlide, 5000);
}
function stopAutoplay() {
  clearInterval(slideInterval);
}
function resetAutoplay() {
  stopAutoplay();
  startAutoplay();
}

// Start autoplay
startAutoplay();

// Pause on hover
const sliderContainer = document.querySelector(".portfolio-slider");
sliderContainer.addEventListener("mouseenter", stopAutoplay);
sliderContainer.addEventListener("mouseleave", startAutoplay);

// ================= NAVBAR SMOOTH SCROLL =================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
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

/* ================= UPGRADED CHATBOT JS ================= */
document.addEventListener("DOMContentLoaded", () => {
  const chatbotWindow = document.getElementById('chatbot-window');
  const toggleBtn = document.getElementById('chatbot-toggle');
  const closeBtn = document.getElementById('chatbot-close');
  const sendBtn = document.getElementById('chatbot-send');
  const inputEl = document.getElementById('chatbot-input');
  const bodyEl = document.getElementById('chatbot-body');
  const typingEl = document.getElementById('typing-indicator');
  const quickRepliesEl = document.getElementById('chatbot-quick-replies');
  const notificationEl = document.getElementById('chatbot-notification');
  const headerEl = document.getElementById('chatbot-header');

  let inactivityTimer;
  const chatSound = new Audio('https://www.soundjay.com/buttons/sounds/button-16.mp3');

  /* ---------------- TOGGLE (💬 / ❌) ---------------- */
  function toggleChat() {
    const isOpen = chatbotWindow.classList.toggle('open');
    toggleBtn.classList.toggle('open', isOpen);
    if (isOpen) {
      chatbotWindow.style.display = "flex";
      notificationEl.style.display = 'none';
      toggleBtn.textContent = "❌"; // change button to close icon
      resetInactivityTimer();
    } else {
      chatbotWindow.style.display = "none";
      toggleBtn.textContent = "💬"; // back to chat icon
      clearTimeout(inactivityTimer);
    }
  }
  toggleBtn.addEventListener('click', toggleChat);
  if (closeBtn) closeBtn.addEventListener('click', toggleChat);

  /* ---------------- SEND MESSAGE ---------------- */
  sendBtn.addEventListener('click', () => sendMessage());
  inputEl.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
  });

  function sendMessage(msg = null) {
    const message = msg || inputEl.value.trim();
    if (!message) return;

    // User message
    const userMsg = document.createElement('div');
    userMsg.className = 'chatbot-message user-msg';
    userMsg.textContent = message;
    bodyEl.appendChild(userMsg);
    inputEl.value = '';
    scrollToBottom();

    // Clear quick replies
    quickRepliesEl.innerHTML = '';
    typingEl.style.display = 'block';
    resetInactivityTimer();

    // Bot response delay
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

  /* ---------------- BOT RESPONSES ---------------- */
  function getBotResponse(msg) {
    msg = msg.toLowerCase();
    if (msg.includes('hello') || msg.includes('hi'))
      return "Hello! 👋 How can I help you today?";
    if (msg.includes('power bi'))
      return "✅ Yes! I build amazing Power BI dashboards!";
    if (msg.includes('contact'))
      return "📩 You can reach me at muhammadaffaf746@gmail.com";
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

  /* ---------------- AUTO-HIDE ---------------- */
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      chatbotWindow.classList.remove('open');
      toggleBtn.classList.remove('open');
      chatbotWindow.style.display = "none";
      toggleBtn.textContent = "💬";
    }, 60000); // auto-hide after 1 min
  }

  /* ---------------- DRAG SNAP-BACK ---------------- */
  let isDragging = false, offsetX, offsetY;
  headerEl.addEventListener('mousedown', e => {
    isDragging = true;
    offsetX = e.clientX - chatbotWindow.offsetLeft;
    offsetY = e.clientY - chatbotWindow.offsetTop;
    chatbotWindow.style.transition = "none";
  });
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      chatbotWindow.style.transition = "all 0.25s ease";

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const rect = chatbotWindow.getBoundingClientRect();

      const snapThreshold = 120;
      if ((vw - rect.right) < snapThreshold && (vh - rect.bottom) < snapThreshold) {
        chatbotWindow.style.left = "auto";
        chatbotWindow.style.top = "auto";
        chatbotWindow.style.right = "25px";
        chatbotWindow.style.bottom = "25px";
      }
    }
  });
  document.addEventListener('mousemove', e => {
    if (isDragging) {
      chatbotWindow.style.left = `${e.clientX - offsetX}px`;
      chatbotWindow.style.top = `${e.clientY - offsetY}px`;
      chatbotWindow.style.right = "auto";
      chatbotWindow.style.bottom = "auto";
    }
  });

  /* ---------------- HELPERS ---------------- */
  function scrollToBottom() {
    bodyEl.scrollTop = bodyEl.scrollHeight;
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
