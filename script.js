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

// Get elements
const scrollTopBtn = document.getElementById("scrollTopBtn");
const header = document.querySelector("header");

// Function to handle scroll events
const handleScroll = () => {
  const scrollY = window.scrollY;

  // Show scroll-to-top button after 200px
  scrollTopBtn.classList.toggle("show", scrollY > 200);

  // Add sticky class to header after 50px
  header.classList.toggle("sticky", scrollY > 50);
};

// Attach scroll event listener
window.addEventListener("scroll", handleScroll);

// Scroll to top smoothly when button is clicked
scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Optional: Keyboard support (press 'ArrowUp' to scroll up)
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
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

/* ================= CHATBOT ================= */
const chatbotWindow = document.querySelector('.chatbot-window');
const chatbotToggleBtn = document.getElementById('chatbot-toggle');
const chatbotCloseBtn = document.getElementById('chatbot-close');
const chatbotBody = document.getElementById('chatbot-body');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSend = document.getElementById('chatbot-send');

chatbotToggleBtn.addEventListener('click', () => chatbotWindow.classList.toggle('active'));
chatbotCloseBtn.addEventListener('click', () => chatbotWindow.classList.remove('active'));

function addMessage(msg, sender='bot') {
  const bubble = document.createElement('div');
  bubble.classList.add('chat-bubble', sender);
  bubble.textContent = msg;
  chatbotBody.appendChild(bubble);
  chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

function botReply(msg) {
  const reply = msg.toLowerCase();
  if(reply.includes('skills')) return "My skills: Power BI, SQL, Python, Excel, Data Analysis, and BI dashboards.";
  if(reply.includes('experience')) return "I have experience as a Data Analyst at XYZ Corp and Power BI Developer at ABC Ltd.";
  if(reply.includes('projects')) return "I built dashboards for Retail Sales, Financial Analysis, and Customer Insights.";
  if(reply.includes('contact')) return "Email: muhammadaffaf746@gmail.com | Phone: +92 300 1234567";
  if(reply.includes('social')) return "Connect with me on GitHub, LinkedIn, or WhatsApp!";
  return "Hello! Ask me about my skills, experience, projects, contact, or social media.";
}

function sendMessage() {
  const msg = chatbotInput.value.trim();
  if(!msg) return;
  addMessage(msg, 'user');
  chatbotInput.value = '';

  const typingIndicator = document.createElement('div');
  typingIndicator.classList.add('chatbot-typing');
  typingIndicator.innerHTML = `<span></span><span></span><span></span>`;
  chatbotBody.appendChild(typingIndicator);
  chatbotBody.scrollTop = chatbotBody.scrollHeight;

  setTimeout(() => {
    typingIndicator.remove();
    addMessage(botReply(msg), 'bot');
  }, 1200 + Math.random()*800);
}

chatbotSend.addEventListener('click', sendMessage);
chatbotInput.addEventListener('keypress', e => { if(e.key==='Enter') sendMessage(); });

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
