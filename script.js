// ================= MENU TOGGLE =================
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));

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

  // ================= SKILLS ANIMATION =================
  const skillCircles = document.querySelectorAll('.skill-circle');
  skillCircles.forEach(circle => {
    const percent = circle.getAttribute('data-percent');
    const progress = circle.querySelector('.progress');
    const percentText = circle.querySelector('.percent');
    let count = 0;

    const radius = progress.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    progress.style.strokeDasharray = circumference;
    progress.style.strokeDashoffset = circumference;

    const animate = () => {
      if (count <= percent) {
        percentText.textContent = count + '%';
        const offset = circumference - (count / 100) * circumference;
        progress.style.strokeDashoffset = offset;
        count++;
        requestAnimationFrame(animate); // CSP-safe replacement for string-based setTimeout
      }
    };
    animate();
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
  const quickRepliesEl = document.getElementById('chatbot-quick-replies');
  const notificationEl = document.getElementById('chatbot-notification');
  const headerEl = document.getElementById('chatbot-header');

  /* ================= CHAT SOUND ================= */
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

  // Dummy QA array to prevent errors
  const chatbotQA = [
    { question: ["Hi","Hello"], answer: "Hello! How can I help you?" },
    { question: ["Bye"], answer: "Goodbye! Have a nice day." }
  ];

  let inactivityTimer;
  const chatSound = new Audio('https://raw.githubusercontent.com/affaf12/Portfolio/162e9272addefb04d11992d0017d4da47afcc9e2/live-chat-353605.mp3');

  function playChatSound(){ chatSound.pause(); chatSound.currentTime=0; chatSound.play(); }

  function toggleChat(){
    const isOpen = chatbotWindow.classList.toggle('open');
    toggleBtn.classList.toggle('open', isOpen);
    if(isOpen){ chatbotWindow.style.display="flex"; notificationEl.style.display='none'; toggleBtn.textContent="❌"; resetInactivityTimer();}
    else{ chatbotWindow.style.display="none"; toggleBtn.textContent="💬"; clearTimeout(inactivityTimer);}
  }

  toggleBtn.addEventListener('click', toggleChat);
  if(closeBtn) closeBtn.addEventListener('click', toggleChat);
  sendBtn.addEventListener('click', ()=>sendMessage());
  inputEl.addEventListener('keypress', e=>{ if(e.key==='Enter') sendMessage(); });

  function sendMessage(msg=null){
    const message = msg || inputEl.value.trim();
    if(!message) return;

    const userMsg = document.createElement('div');
    userMsg.className='chatbot-message user-msg';
    userMsg.textContent=message;
    bodyEl.appendChild(userMsg);
    inputEl.value=''; scrollToBottom();

    quickRepliesEl.innerHTML=''; typingEl.style.display='block'; resetInactivityTimer();

    setTimeout(()=>{
      typingEl.style.display='none';
      const response = getBotResponse(message);
      displayBotTypingWithDots(response);
    }, 400);
  }

  function getBotResponse(msg){
    for(let qa of chatbotQA){
      if(qa.question.some(q=>q.toLowerCase()===msg.toLowerCase())) return qa.answer;
    }
    return "I didn't understand that.";
  }

  function displayBotTypingWithDots(text){
    const botMsg = document.createElement('div');
    botMsg.className='chatbot-message bot-msg';
    bodyEl.appendChild(botMsg); scrollToBottom();

    const dots = document.createElement('span');
    dots.className='typing-dots';
    dots.textContent='...';
    botMsg.appendChild(dots);

    let dotInterval = setInterval(()=>{
      dots.textContent = dots.textContent.length < 3 ? dots.textContent + '.' : '.';
      scrollToBottom();
    },400);

    setTimeout(()=>{
      clearInterval(dotInterval);
      botMsg.textContent='';

      text.split('\n').forEach((line,index)=>{
        const linkMatch = line.match(/\[(.*?)\]\((.*?)\)/);
        if(linkMatch){
          const linkEl = document.createElement('a');
          linkEl.href=linkMatch[2]; linkEl.target="_blank"; linkEl.rel="noopener noreferrer"; linkEl.textContent=linkMatch[1]; linkEl.className="chatbot-link";
          botMsg.appendChild(linkEl);
        }else{ const p=document.createElement('p'); p.textContent=line; botMsg.appendChild(p);}
        if(index<text.split('\n').length-1) botMsg.appendChild(document.createElement('br'));
      });

      scrollToBottom();
      addBotExtras(botMsg,text);
    },1200);
  }

  function addBotExtras(botMsg,response){
    const reactions=document.createElement('div'); reactions.className='emoji-reactions';
    ['👍','❤️','😂'].forEach(e=>{
      const span=document.createElement('span'); span.textContent=e; span.onclick=()=>alert(`You reacted with ${e}`); reactions.appendChild(span);
    });
    botMsg.appendChild(reactions);

    addQuickRepliesFromAnswer(response); playChatSound();
    if(!chatbotWindow.classList.contains('open')) notificationEl.style.display='inline-block';
  }

  function addQuickRepliesFromAnswer(response){
    quickRepliesEl.innerHTML=''; let replies=[];
    for(let qa of chatbotQA){ if(qa.answer===response){ replies.push(...qa.question.slice(0,3)); break; } }
    [...new Set(replies)].forEach(t=>{
      const btn=document.createElement('button'); btn.className='quick-btn'; btn.textContent=t; btn.onclick=()=>sendMessage(t); quickRepliesEl.appendChild(btn);
    });
  }

  function resetInactivityTimer(){
    clearTimeout(inactivityTimer);
    inactivityTimer=setTimeout(()=>{
      chatbotWindow.classList.remove('open'); toggleBtn.classList.remove('open'); chatbotWindow.style.display="none"; toggleBtn.textContent="💬";
    },60000);
  }

  let isDragging=false, offsetX, offsetY;
  headerEl.addEventListener('mousedown', e=>{
    isDragging=true; offsetX=e.clientX-chatbotWindow.offsetLeft; offsetY=e.clientY-chatbotWindow.offsetTop; chatbotWindow.style.transition="none";
  });
  document.addEventListener('mouseup',()=>{
    if(isDragging){ isDragging=false; chatbotWindow.style.transition="all 0.25s ease";
      const vw=window.innerWidth, vh=window.innerHeight, rect=chatbotWindow.getBoundingClientRect(), snapThreshold=120;
      if((vw-rect.right)<snapThreshold && (vh-rect.bottom)<snapThreshold){ chatbotWindow.style.left="auto"; chatbotWindow.style.top="auto"; chatbotWindow.style.right="25px"; chatbotWindow.style.bottom="25px"; }
    }
  });
  document.addEventListener('mousemove',e=>{ if(isDragging){ chatbotWindow.style.left=`${e.clientX-offsetX}px`; chatbotWindow.style.top=`${e.clientY-offsetY}px`; chatbotWindow.style.right="auto"; chatbotWindow.style.bottom="auto"; } });

  function scrollToBottom(){ bodyEl.scrollTop=bodyEl.scrollHeight; }
});

// Chatbot link styles
const style=document.createElement('style');
style.textContent=`
  .chatbot-link { color:#0078ff; text-decoration:underline; font-weight:500; cursor:pointer; }
  .chatbot-link:hover { color:#0056cc; text-decoration:none; }
`;
document.head.appendChild(style);

