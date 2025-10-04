/* MENU TOGGLE */
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));

/* THEME TOGGLE */
const themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click', () => {
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
  themeBtn.innerHTML = html.dataset.theme === 'dark' ? "<i class='bx bx-moon'></i>" : "<i class='bx bx-sun'></i>";
});

/* SCROLL BUTTON & STICKY HEADER */
const scrollBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
  document.querySelector('header').classList.toggle('sticky', window.scrollY > 50);
});
scrollBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });

/* SECTION OBSERVER */
const sections = document.querySelectorAll('section, .hero h1, .hero h3');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold:0.2 });
sections.forEach(sec => observer.observe(sec));

/* ACTIVE NAV */
const navLinks = document.querySelectorAll('nav ul li a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => { if(window.scrollY >= sec.offsetTop - 80) current = sec.getAttribute('id'); });
  navLinks.forEach(link => { link.classList.remove('active'); if(link.getAttribute('href') === '#' + current) link.classList.add('active'); });
});

/* CHATBOT */
const chatbot = document.getElementById('chatbot');
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotBody = document.getElementById('chatbot-body');
const chatbotSend = document.getElementById('chatbot-send');

chatbotToggle.addEventListener('click', () => { chatbot.style.display = 'flex'; });
chatbotClose.addEventListener('click', () => { chatbot.style.display = 'none'; });

function addMessage(msg, sender) {
  const p = document.createElement('p');
  p.textContent = msg;
  p.style.textAlign = sender==='user'?'right':'left';
  p.style.padding='0.3rem';
  p.style.margin='0.2rem 0';
  p.style.borderRadius='5px';
  p.style.background = sender==='user' ? 'var(--primary)' : 'rgba(255,255,255,0.1)';
  p.style.color = '#f9fafb';
  chatbotBody.appendChild(p);
  chatbotBody.scrollTop = chatbotBody.scrollHeight;
}
function botReply(msg){
  msg = msg.toLowerCase();
  if(msg.includes('skills')) return "My skills include Power BI, SQL, Python, Excel, Data Analysis, and BI.";
  if(msg.includes('experience')) return "I have worked as a Data Analyst at XYZ Corp and as a Power BI Developer at ABC Ltd.";
  if(msg.includes('projects')) return "I have developed dashboards for Retail Sales, Financial Analysis, and Customer Reviews Insights.";
  if(msg.includes('contact')) return "You can email me at muhammadaffaf746@gmail.com or call +92 300 1234567.";
  return "Hello! I can provide info about my skills, experience, projects, or contact details.";
}
chatbotSend.addEventListener('click', () => {
  const msg = chatbotInput.value.trim();
  if(!msg) return;
  addMessage(msg,'user'); chatbotInput.value='';
  setTimeout(()=>{ addMessage(botReply(msg),'bot'); },500);
});
chatbotInput.addEventListener('keypress', e=>{ if(e.key==='Enter') chatbotSend.click(); });

/* SKILL ANIMATION */
const skillCircles = document.querySelectorAll('.skill-circle');
skillCircles.forEach(circle => {
  const percent = circle.dataset.percent;
  const progress = circle.querySelector('.progress');
  const percentText = circle.querySelector('.percent');
  const offset = 314 - (314 * percent) / 100;
  setTimeout(() => { 
    progress.style.strokeDashoffset = offset; 
    let count=0;
    const interval = setInterval(() => { 
      count++; 
      percentText.textContent = count+'%'; 
      if(count>=percent) clearInterval(interval);
    }, 12);
  }, 500);
});

/* HERO TYPING EFFECT */
const typingText = document.getElementById('typing-text');
const words = ["Data Analyst","Power BI Developer","SQL Specialist","Python Programmer","Excel Expert","BI Consultant"];
let wordIndex=0, charIndex=0;
function type() {
  if(wordIndex>=words.length) wordIndex=0;
  const word=words[wordIndex];
  typingText.textContent = word.slice(0,charIndex);
  charIndex++;
  if(charIndex>word.length){ charIndex=0; wordIndex++; setTimeout(type,1000); } else { setTimeout(type,150); }
}
type();
