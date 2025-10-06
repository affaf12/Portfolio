/* ================= MENU TOGGLE ================= */
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const sections = document.querySelectorAll("section");
  const themeBtn = document.getElementById("theme-toggle-btn");
  const body = document.body;

  // ================= STICKY HEADER =================
  window.addEventListener("scroll", () => {
    if(window.scrollY > 50) header.classList.add("sticky");
    else header.classList.remove("sticky");

    // Active nav link
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const id = section.id;
      if(scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight){
        document.querySelectorAll("#nav-menu a").forEach(link => link.classList.remove("active"));
        const activeLink = document.querySelector(`#nav-menu a[href="#${id}"]`);
        if(activeLink) activeLink.classList.add("active");
      }
    });
  });

  // ================= MOBILE MENU =================
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show");
    menuToggle.classList.toggle("glow-pulse");
  });

  // ================= THEME TOGGLE =================
  const savedTheme = localStorage.getItem("theme");
  if(savedTheme === "dark"){
    body.classList.add("dark-theme");
    themeBtn.textContent = "🌞";
    themeBtn.classList.add("active");
  } else {
    body.classList.remove("dark-theme");
    themeBtn.textContent = "🌙";
    themeBtn.classList.remove("active");
  }

  themeBtn.addEventListener("click", () => {
    body.classList.toggle("dark-theme");
    const isDark = body.classList.contains("dark-theme");
    themeBtn.textContent = isDark ? "🌞" : "🌙";
    themeBtn.classList.toggle("active", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});


// ================= HERO SECTION ANIMATION =================
document.addEventListener("DOMContentLoaded", () => {
  const heroItems = document.querySelectorAll("#home [data-animate]");
  const resumeBtn = document.querySelector("#home .btn");

  const observerOptions = { threshold: 0.2 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const index = Array.from(heroItems).indexOf(entry.target);

      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${index * 0.2}s`;
        entry.target.classList.add("visible");

        // Add glow animation to resume button
        if(entry.target.classList.contains("btn")){
          setTimeout(() => entry.target.classList.add("glow"), 300);
        }
      } else {
        entry.target.style.transitionDelay = "0s";
        entry.target.classList.remove("visible");
        if(entry.target.classList.contains("btn")){
          entry.target.classList.remove("glow");
        }
      }
    });
  }, observerOptions);

  heroItems.forEach(item => observer.observe(item));
});



// ================= ABOUT SECTION STAGGERED ANIMATION =================
document.addEventListener("DOMContentLoaded", () => {
  const animItems = document.querySelectorAll("#about [data-animate]");
  const contactBtn = document.getElementById("contactBtn");

  const observerOptions = { threshold: 0.2 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const index = Array.from(animItems).indexOf(entry.target);

      if (entry.isIntersecting) {
        // Staggered transition for all items
        entry.target.style.transitionDelay = `${index * 0.2}s`;
        entry.target.classList.add("visible");

        // Button: add glow + bounce animation
        if(entry.target.classList.contains("btn-contact")){
          setTimeout(() => entry.target.classList.add("glow"), index * 200);
        }
      } else {
        entry.target.style.transitionDelay = "0s";
        entry.target.classList.remove("visible");
        if(entry.target.classList.contains("btn-contact")){
          entry.target.classList.remove("glow");
        }
      }
    });
  }, observerOptions);

  animItems.forEach(item => observer.observe(item));

  // ================= SCROLL TO CONTACT =================
  contactBtn.addEventListener("click", () => {
    const contactSection = document.getElementById("contact");
    contactSection.scrollIntoView({ behavior: "smooth" });
  });
});




// ================= EXPERIENCE SECTION ENHANCED STAGGERED ANIMATION =================
document.addEventListener("DOMContentLoaded", () => {
  const expCards = document.querySelectorAll(".experience-card");

  const observerOptions = {
    threshold: 0.2, // trigger when 20% of the card is visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const index = Array.from(expCards).indexOf(entry.target);

      if (entry.isIntersecting) {
        // Add staggered delay
        entry.target.style.transition = `transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55), 
                                         opacity 0.6s ease, 
                                         box-shadow 0.3s ease`;
        entry.target.style.transitionDelay = `${index * 0.2}s`;

        // Add visible + scale
        entry.target.classList.add("visible");
      } else {
        // Reset for repeat animation
        entry.target.style.transitionDelay = "0s";
        entry.target.classList.remove("visible");
        entry.target.style.transform = "translateY(50px) scale(1)";
      }
    });
  }, observerOptions);

  expCards.forEach(card => observer.observe(card));
});



// ================= Skill Section =================
document.addEventListener("DOMContentLoaded", () => {
  const circles = document.querySelectorAll(".skill-circle");
  let animated = false;

  function animateSkills() {
    if (animated) return; // prevent multiple triggers
    const skillsSection = document.querySelector("#skills");
    const rect = skillsSection.getBoundingClientRect();

    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      animated = true;
      circles.forEach(circle => {
        const percent = parseInt(circle.getAttribute("data-percent"));
        const progress = circle.querySelector(".progress");
        const text = circle.querySelector(".percent");
        const color = circle.getAttribute("data-color");
        const radius = progress.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;

        progress.style.strokeDasharray = circumference;
        progress.style.stroke = color;
        text.style.color = color;
        circle.querySelector("h3").style.color = color;

        let current = 0;
        const animate = setInterval(() => {
          if (current >= percent) {
            clearInterval(animate);
          } else {
            current++;
            text.textContent = current + "%";
            progress.style.strokeDashoffset =
              circumference - (current / 100) * circumference;
          }
        }, 20);
      });
    }
  }

  window.addEventListener("scroll", animateSkills);
});


// ================= ACHIEVEMENTS SLIDER =================
const achSlider = document.querySelector(".achievements-wrapper");
const achSlides = document.querySelectorAll(".achievement-card");
const achNextBtn = document.querySelector(".ach-right-btn");
const achPrevBtn = document.querySelector(".ach-left-btn");

let achIndex = 0;

// Show specific slide
function showAchSlide(i) {
  achIndex = (i + achSlides.length) % achSlides.length;
  achSlider.style.transform = `translateX(${-achIndex * 100}%)`;
}

// Next / Prev
function nextAchSlide() { showAchSlide(achIndex + 1); }
function prevAchSlide() { showAchSlide(achIndex - 1); }

// Navigation buttons
achNextBtn.addEventListener("click", nextAchSlide);
achPrevBtn.addEventListener("click", prevAchSlide);

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") nextAchSlide();
  if (e.key === "ArrowLeft") prevAchSlide();
});

// Swipe for touch devices
let achStartX = 0;
achSlider.addEventListener("touchstart", (e) => achStartX = e.touches[0].clientX);
achSlider.addEventListener("touchend", (e) => {
  const achEndX = e.changedTouches[0].clientX;
  if (achStartX - achEndX > 50) nextAchSlide();   // swipe left
  if (achEndX - achStartX > 50) prevAchSlide();   // swipe right
});

// Init
showAchSlide(0);




// ================= PROJECTS SLIDER =================
const slider = document.querySelector(".projects-wrapper");
const slides = document.querySelectorAll(".project-card");
const nextBtn = document.querySelector(".right-btn");
const prevBtn = document.querySelector(".left-btn");

let index = 0;

// Show specific slide
function showSlide(i) {
  index = (i + slides.length) % slides.length;
  slider.style.transform = `translateX(${-index * 100}%)`;
}

// Next / Prev
function nextSlide() { showSlide(index + 1); }
function prevSlide() { showSlide(index - 1); }

// Navigation buttons
nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") nextSlide();
  if (e.key === "ArrowLeft") prevSlide();
});

// Swipe for touch devices
let startX = 0;
slider.addEventListener("touchstart", (e) => startX = e.touches[0].clientX);
slider.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) nextSlide();   // swipe left
  if (endX - startX > 50) prevSlide();   // swipe right
});

// Init
showSlide(0);

// ================= CONTACT FORM SCRIPT (NEON CONFIRMATION EDITION v2.0) =================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const submitBtn = form.querySelector('button[type="submit"]');

  // Create floating toast container
  const toast = document.createElement("div");
  toast.className = "form-toast";
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0,255,255,0.1);
    color: #00fff0;
    padding: 15px 25px;
    border-radius: 12px;
    box-shadow: 0 0 15px #00fff0;
    font-weight: bold;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.5s, transform 0.5s;
    z-index: 9999;
  `;
  document.body.appendChild(toast);

  // Google Apps Script EXEC URL
  const SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (form.dataset.sending === "true") return;
    form.dataset.sending = "true";

    // Button loader
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="loader"></span> Sending...`;

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim() || "No Subject",
      message: form.message.value.trim(),
    };

    // Validation
    if (!data.name || !data.email || !data.message) {
      showToast("⚠️ Please fill all required fields", false);
      resetButton();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      showToast("⚠️ Invalid email format", false);
      resetButton();
      return;
    }

    try {
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json(); // parse JSON from Apps Script

      if (result.status === "success") {
        showToast("✅ Message sent successfully! Check your email confirmation.", true);
        form.reset();
      } else if (result.status === "warning") {
        showToast("⚠️ Admin email sent, but user confirmation failed.", false);
        form.reset();
      } else {
        showToast("⚠️ Something went wrong. Try again later.", false);
        console.error("Apps Script error:", result);
      }
    } catch (err) {
      console.error("Network/App Script Error:", err);
      showToast("⚠️ Network error. Check your connection.", false);
    } finally {
      resetButton();
      setTimeout(() => { form.dataset.sending = "false"; }, 5000);
    }
  });

  // Neon toast popup
  function showToast(msg, success = true) {
    toast.textContent = msg;
    toast.style.background = success ? "rgba(0,255,255,0.1)" : "rgba(255,50,50,0.15)";
    toast.style.color = success ? "#00fff0" : "#ff5555";
    toast.style.boxShadow = success ? "0 0 20px #00fff0" : "0 0 20px #ff5555";
    toast.style.opacity = 1;
    toast.style.transform = "translateY(0px)";
    setTimeout(() => {
      toast.style.opacity = 0;
      toast.style.transform = "translateY(-20px)";
    }, 4000);
  }

  function resetButton() {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="bx bx-send"></i> Send Message`;
  }
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

/* ================= CHATBOT QUESTION-ANSWER LIST ================= */
const chatbotQA = [
  { question: ["hi", "hello", "hey"], answer: "Hello! 👋 How can I help you today?" },
  { question: ["power bi", "dashboard", "bi report"], answer: "✅ Yes! I build amazing Power BI dashboards. Here is a demo you can check out: [Insert Your Demo Link Here]" },
  { question: ["contact", "email", "reach you"], answer: "📩 You can reach me at muhammadaffaf746@gmail.com" },
  { question: ["portfolio", "projects", "work"], answer: "💼 Check out my projects in the Projects section of this site!" },
  { question: ["services", "what do you do"], answer: "I provide Data Analytics, Power BI, SQL, and Excel consulting services." },
  { question: ["pricing", "cost"], answer: "💰 For pricing details, please contact me directly via email." },
  { question: ["demo", "show me demo"], answer: "🎯 I can show you live demos of my Power BI dashboards!" },
  { question: ["hr report", "human resources report", "employee report", "hr dashboard"], 
    answer: "✅ Yes! I create HR reports. Here is a demo you can check out: [Insert Your Demo Link Here]" 
  },
  { question: ["financial report", "finance dashboard", "financial analysis"], 
    answer: "✅ Absolutely! I create Financial reports in Power BI. Here is a demo: [Insert Financial Demo Link]" 
  },
  { question: ["healthcare report", "medical dashboard", "hospital report"], 
    answer: "✅ I build Healthcare reports using Power BI. Here is a demo: [Insert Healthcare Demo Link]" 
  },
  { question: ["sales report", "sales dashboard", "revenue report"], 
    answer: "✅ Yes! I make Sales reports in Power BI. Demo: [Insert Sales Demo Link]" 
  },
  { question: ["marketing report", "marketing dashboard", "campaign report"], 
    answer: "✅ I can create Marketing reports. Demo: [Insert Marketing Demo Link]" 
  },
  { question: ["insurance report", "insurance dashboard", "policy report"], 
    answer: "✅ Sure! I make Insurance reports in Power BI. Demo: [Insert Insurance Demo Link]" 
  }
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

/* ================= UPGRADED CHATBOT JS WITH TYPING DOTS ================= */
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

// Load chat sound from your GitHub repo
const chatSound = new Audio('https://raw.githubusercontent.com/affaf12/Portfolio/162e9272addefb04d11992d0017d4da47afcc9e2/live-chat-353605.mp3');

// Function to play sound without overlapping
function playChatSound() {
    if (!chatSound.paused) {
        chatSound.pause();       // Stop if already playing
        chatSound.currentTime = 0; // Reset to start
    }
    chatSound.play();            // Play the sound
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

    // User message
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
    }, 400); // small delay before bot starts typing
  }

  /* ---------------- BOT TYPING WITH DOTS ---------------- */
  function displayBotTypingWithDots(text) {
    const botMsg = document.createElement('div');
    botMsg.className = 'chatbot-message bot-msg';
    bodyEl.appendChild(botMsg);

    scrollToBottom();

    // Add "typing dots" animation first
    const dots = document.createElement('span');
    dots.className = 'typing-dots';
    dots.textContent = '...';
    botMsg.appendChild(dots);

    let dotInterval = setInterval(() => {
      dots.textContent = dots.textContent.length < 3 ? dots.textContent + '.' : '.';
      scrollToBottom();
    }, 500);

    // After short delay, start typing the actual text
    setTimeout(() => {
      clearInterval(dotInterval);
      botMsg.removeChild(dots);
      typeText(botMsg, text);
    }, 1200); // duration of "thinking"
  }

  /* ---------------- CHARACTER-BY-CHARACTER TYPING ---------------- */
  function typeText(botMsg, text) {
    let i = 0;
    const typingInterval = setInterval(() => {
      botMsg.textContent += text.charAt(i);
      i++;
      scrollToBottom();
      if(i >= text.length) {
        clearInterval(typingInterval);
        addBotExtras(botMsg, text);
      }
    }, 35);
  }

  /* ---------------- EMOJIS & QUICK REPLIES ---------------- */
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

    chatSound.play();
    if(!chatbotWindow.classList.contains('open')) notificationEl.style.display='inline-block';
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
