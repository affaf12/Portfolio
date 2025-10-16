/* ========================== SCRIPT.JS ========================== */

/* ================= MENU TOGGLE ================= */
(() => {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
})();

/* ================= STICKY HEADER + ACTIVE NAV ================= */
(() => {
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('#nav-menu a');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Sticky header
    if(scrollY > 50) header.classList.add('sticky');
    else header.classList.remove('sticky');

    // Highlight active nav
    let current = '';
    sections.forEach(section => {
      if(scrollY >= section.offsetTop - 100) current = section.id;
    });
    navLinks.forEach(link => link.classList.remove('active'));
    navLinks.forEach(link => {
      if(link.getAttribute('href') === '#' + current) link.classList.add('active');
    });

    // Scroll top button & slide header
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if(scrollTopBtn){
      scrollTopBtn.classList.toggle('show', scrollY > 200);
    }
    if(scrollY > 50){
      if(scrollY > lastScroll) header.style.transform = 'translateY(-120px)';
      else header.style.transform = 'translateY(0)';
    } else header.style.transform = 'translateY(0)';
    lastScroll = scrollY;
  });

  // Scroll to top button
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if(scrollTopBtn){
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();

/* ================= THEME TOGGLE ================= */
(() => {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const body = document.body;
  if(!themeBtn) return;

  const savedTheme = localStorage.getItem('theme');
  if(savedTheme === 'dark'){
    body.classList.add('dark-theme');
    themeBtn.textContent = '🌞';
    themeBtn.classList.add('active');
  } else {
    body.classList.remove('dark-theme');
    themeBtn.textContent = '🌙';
    themeBtn.classList.remove('active');
  }

  themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    themeBtn.textContent = isDark ? '🌞' : '🌙';
    themeBtn.classList.toggle('active', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
})();

/* ================= HERO & ABOUT ANIMATIONS ================= */
(() => {
  function animateSection(sectionId){
    const items = document.querySelectorAll(`#${sectionId} [data-animate]`);
    if(items.length === 0) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const index = Array.from(items).indexOf(entry.target);
        if(entry.isIntersecting){
          entry.target.style.transitionDelay = `${index*0.2}s`;
          entry.target.classList.add('visible');
          if(entry.target.classList.contains('btn') || entry.target.classList.contains('btn-contact')){
            setTimeout(() => entry.target.classList.add('glow'), 300);
          }
        } else {
          entry.target.style.transitionDelay = '0s';
          entry.target.classList.remove('visible');
          entry.target.classList.remove('glow');
        }
      });
    }, { threshold: 0.2 });

    items.forEach(item => observer.observe(item));
  }

  ['home', 'about'].forEach(animateSection);

  // Contact button scroll
  const contactBtn = document.getElementById('contactBtn');
  if(contactBtn){
    contactBtn.addEventListener('click', () => {
      const contactSection = document.getElementById('contact');
      if(contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
})();

/* ================= EXPERIENCE ANIMATION ================= */
(() => {
  const cards = document.querySelectorAll('.experience-card');
  if(cards.length === 0) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const index = Array.from(cards).indexOf(entry.target);
      if(entry.isIntersecting){
        entry.target.style.transitionDelay = `${index*0.2}s`;
        entry.target.classList.add('visible');
      } else {
        entry.target.style.transitionDelay = '0s';
        entry.target.classList.remove('visible');
        entry.target.style.transform = 'translateY(50px) scale(1)';
        entry.target.style.opacity = '0';
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(card => observer.observe(card));
})();

/* ================= SKILLS CIRCLES ================= */
(() => {
  const circles = document.querySelectorAll('.skill-circle');
  if(circles.length === 0) return;

  let animated = false;
  function animateSkills(){
    if(animated) return;
    const skillsSection = document.getElementById('skills');
    if(!skillsSection) return;
    const rect = skillsSection.getBoundingClientRect();
    if(rect.top < window.innerHeight && rect.bottom >= 0){
      animated = true;
      circles.forEach(circle => {
        const percent = parseInt(circle.getAttribute('data-percent'));
        const progress = circle.querySelector('.progress');
        const text = circle.querySelector('.percent');
        const color = circle.getAttribute('data-color');
        const radius = progress.r.baseVal.value;
        const circumference = 2*Math.PI*radius;

        progress.style.strokeDasharray = circumference;
        progress.style.stroke = color;
        text.style.color = color;
        circle.querySelector('h3').style.color = color;

        let current = 0;
        const interval = setInterval(() => {
          if(current >= percent) clearInterval(interval);
          else{
            current++;
            text.textContent = current + '%';
            progress.style.strokeDashoffset = circumference - (current/100)*circumference;
          }
        }, 20);
      });
    }
  }

  animateSkills();
  window.addEventListener('scroll', animateSkills);
})();

/* ================= GENERIC SLIDER FUNCTION ================= */
function setupSlider(wrapperSelector, prevBtnSelector, nextBtnSelector){
  const slider = document.querySelector(wrapperSelector);
  if(!slider) return;
  const slides = slider.children;
  const prevBtn = document.querySelector(prevBtnSelector);
  const nextBtn = document.querySelector(nextBtnSelector);
  let index = 0;

  function showSlide(i){
    index = (i + slides.length) % slides.length;
    slider.style.transform = `translateX(${-index*100}%)`;
  }

  if(prevBtn) prevBtn.addEventListener('click', ()=>showSlide(index-1));
  if(nextBtn) nextBtn.addEventListener('click', ()=>showSlide(index+1));
  document.addEventListener('keydown', e => {
    if(e.key==='ArrowLeft') showSlide(index-1);
    if(e.key==='ArrowRight') showSlide(index+1);
  });

  let startX = 0;
  slider.addEventListener('touchstart', e => startX=e.touches[0].clientX);
  slider.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    if(startX-endX>50) showSlide(index+1);
    if(endX-startX>50) showSlide(index-1);
  });

  showSlide(0);
}

// Initialize sliders
setupSlider('.achievements-wrapper', '.ach-left-btn', '.ach-right-btn');
setupSlider('.projects-wrapper', '.left-btn', '.right-btn');

/* ================= CONTACT FORM ================= */
(() => {
  const form = document.getElementById('contactForm');
  if(!form) return;
  const submitBtn = form.querySelector('button[type="submit"]');

  const toast = document.createElement('div');
  toast.className = 'form-toast';
  toast.style.cssText = `
    position: fixed; top: 20px; right: 20px; background: rgba(0,255,255,0.1);
    color: #00fff0; padding: 15px 25px; border-radius: 12px;
    box-shadow: 0 0 15px #00fff0; font-weight: bold; opacity: 0;
    pointer-events: none; transition: opacity 0.5s, transform 0.5s; z-index: 9999;
  `;
  document.body.appendChild(toast);

  const SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec";

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    if(form.dataset.sending==='true') return;
    form.dataset.sending='true';
    submitBtn.disabled=true;
    submitBtn.innerHTML='<span class="loader"></span> Sending...';

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim() || "No Subject",
      message: form.message.value.trim()
    };

    if(!data.name || !data.email || !data.message){
      showToast('⚠️ Please fill all required fields', false);
      resetBtn(); return;
    }

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)){
      showToast('⚠️ Invalid email format', false);
      resetBtn(); return;
    }

    try {
      const res = await fetch(SCRIPT_URL,{
        method:'POST',
        body: JSON.stringify(data),
        headers:{ 'Content-Type':'application/json' }
      });
      const result = await res.json();
      if(result.status==='success') showToast('✅ Message sent successfully!', true);
      else showToast('⚠️ Something went wrong.', false);
      form.reset();
    } catch(err){
      console.error(err);
      showToast('⚠️ Network error.', false);
    } finally { resetBtn(); form.dataset.sending='false'; }

    function resetBtn(){
      submitBtn.disabled=false;
      submitBtn.innerHTML='<i class="bx bx-send"></i> Send Message';
    }
  });

  function showToast(msg, success=true){
    toast.textContent=msg;
    toast.style.background=success?'rgba(0,255,255,0.1)':'rgba(255,50,50,0.15)';
    toast.style.color=success?'#00fff0':'#ff5555';
    toast.style.boxShadow=success?'0 0 20px #00fff0':'0 0 20px #ff5555';
    toast.style.opacity=1;
    toast.style.transform='translateY(0px)';
    setTimeout(()=>{ toast.style.opacity=0; toast.style.transform='translateY(-20px)'; },4000);
  }
})();



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
  const quickRepliesEl = document.getElementById('chatbot-quick-replies');
  const notificationEl = document.getElementById('chatbot-notification');
  const headerEl = document.getElementById('chatbot-header');

  /* ================= CHAT SOUND ================= */
  let inactivityTimer;
  const chatSound = new Audio('https://raw.githubusercontent.com/affaf12/Portfolio/162e9272addefb04d11992d0017d4da47afcc9e2/live-chat-353605.mp3');

  function playChatSound() {
    if (!chatSound.paused) {
      chatSound.pause();
      chatSound.currentTime = 0;
    }
    chatSound.play();
  }

  /* ---------------- TOGGLE CHATBOT ---------------- */
  function toggleChat() {
    const isOpen = chatbotWindow.classList.toggle('open');
    toggleBtn.classList.toggle('open', isOpen);
    if (isOpen) {
      chatbotWindow.style.display = "flex";
      notificationEl.style.display = 'none';
      toggleBtn.textContent = "❌";
      resetInactivityTimer();
    } else {
      chatbotWindow.style.display = "none";
      toggleBtn.textContent = "💬";
      clearTimeout(inactivityTimer);
    }
  }
  toggleBtn.addEventListener('click', toggleChat);
  if (closeBtn) closeBtn.addEventListener('click', toggleChat);

  /* ---------------- SEND MESSAGE ---------------- */
  sendBtn.addEventListener('click', () => sendMessage());
  inputEl.addEventListener('keypress', e => { if(e.key==='Enter') sendMessage(); });

  function sendMessage(msg=null){
    const message = msg || inputEl.value.trim();
    if(!message) return;

    const userMsg = document.createElement('div');
    userMsg.className = 'chatbot-message user-msg';
    userMsg.textContent = message;
    bodyEl.appendChild(userMsg);
    inputEl.value = '';
    scrollToBottom();

    quickRepliesEl.innerHTML = '';
    typingEl.style.display = 'block';
    resetInactivityTimer();

    setTimeout(()=>{
      typingEl.style.display='none';
      const response = getBotResponse(message);
      displayBotTypingWithDots(response);
    }, 400);
  }

  /* ---------------- BOT TYPING WITH LINK STYLING ---------------- */
  function displayBotTypingWithDots(text) {
    const botMsg = document.createElement('div');
    botMsg.className = 'chatbot-message bot-msg';
    bodyEl.appendChild(botMsg);
    scrollToBottom();

    const dots = document.createElement('span');
    dots.className = 'typing-dots';
    dots.textContent = '...';
    botMsg.appendChild(dots);

    let dotInterval = setInterval(() => {
      dots.textContent = dots.textContent.length < 3 ? dots.textContent + '.' : '.';
      scrollToBottom();
    }, 400);

    setTimeout(() => {
      clearInterval(dotInterval);
      botMsg.textContent = ''; 

      const parts = text.split('\n');
      parts.forEach((line, index) => {
        const linkMatch = line.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          const linkEl = document.createElement('a');
          linkEl.href = linkMatch[2];
          linkEl.target = "_blank";
          linkEl.rel = "noopener noreferrer";
          linkEl.textContent = linkMatch[1];
          linkEl.className = "chatbot-link"; // ✅ style class
          botMsg.appendChild(linkEl);
        } else {
          const p = document.createElement('p');
          p.textContent = line;
          botMsg.appendChild(p);
        }
        if (index < parts.length - 1) botMsg.appendChild(document.createElement('br'));
      });

      scrollToBottom();
      addBotExtras(botMsg, text);
    }, 1200);
  }

  /* ---------------- EXTRAS: EMOJIS & QUICK REPLIES ---------------- */
  function addBotExtras(botMsg, response){
    const reactions = document.createElement('div');
    reactions.className = 'emoji-reactions';
    ['👍','❤️','😂'].forEach(emoji=>{
      const span = document.createElement('span');
      span.textContent = emoji;
      span.onclick = ()=>alert(`You reacted with ${emoji}`);
      reactions.appendChild(span);
    });
    botMsg.appendChild(reactions);

    addQuickRepliesFromAnswer(response);
    playChatSound();

    if(!chatbotWindow.classList.contains('open'))
      notificationEl.style.display='inline-block';
  }

  function addQuickRepliesFromAnswer(response){
    quickRepliesEl.innerHTML='';
    let replies = [];
    for(let qa of chatbotQA){
      if(qa.answer === response){
        replies.push(...qa.question.slice(0,3));
        break;
      }
    }
    replies = [...new Set(replies)];
    replies.forEach(text=>{
      const btn = document.createElement('button');
      btn.className='quick-btn';
      btn.textContent = text;
      btn.onclick = ()=>sendMessage(text);
      quickRepliesEl.appendChild(btn);
    });
  }

  /* ---------------- AUTO-HIDE ---------------- */
  function resetInactivityTimer(){
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(()=>{
      chatbotWindow.classList.remove('open');
      toggleBtn.classList.remove('open');
      chatbotWindow.style.display="none";
      toggleBtn.textContent="💬";
    }, 60000);
  }

  /* ---------------- DRAG & SNAP ---------------- */
  let isDragging=false, offsetX, offsetY;
  headerEl.addEventListener('mousedown', e=>{
    isDragging=true;
    offsetX = e.clientX - chatbotWindow.offsetLeft;
    offsetY = e.clientY - chatbotWindow.offsetTop;
    chatbotWindow.style.transition="none";
  });
  document.addEventListener('mouseup', ()=>{
    if(isDragging){
      isDragging=false;
      chatbotWindow.style.transition="all 0.25s ease";
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const rect = chatbotWindow.getBoundingClientRect();
      const snapThreshold = 120;
      if((vw-rect.right)<snapThreshold && (vh-rect.bottom)<snapThreshold){
        chatbotWindow.style.left="auto";
        chatbotWindow.style.top="auto";
        chatbotWindow.style.right="25px";
        chatbotWindow.style.bottom="25px";
      }
    }
  });
  document.addEventListener('mousemove', e=>{
    if(isDragging){
      chatbotWindow.style.left=`${e.clientX - offsetX}px`;
      chatbotWindow.style.top=`${e.clientY - offsetY}px`;
      chatbotWindow.style.right="auto";
      chatbotWindow.style.bottom="auto";
    }
  });

  function scrollToBottom(){ bodyEl.scrollTop = bodyEl.scrollHeight; }
});

/* ================= CHATBOT LINK STYLES ================= */
const style = document.createElement('style');
style.textContent = `
  .chatbot-link {
    color: #0078ff;
    text-decoration: underline;
    font-weight: 500;
    cursor: pointer;
  }
  .chatbot-link:hover {
    color: #0056cc;
    text-decoration: none;
  }
`;
document.head.appendChild(style);
