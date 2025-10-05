/* ================= MENU TOGGLE ================= */
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));

// ================= THEME TOGGLE JS =================
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const lightBtn = document.getElementById("light-theme-btn");
  const darkBtn = document.getElementById("dark-theme-btn");

  // Apply Light Theme
  lightBtn.addEventListener("click", () => {
    body.classList.remove("dark-theme");
    localStorage.setItem("theme", "light");
  });

  // Apply Dark Theme
  darkBtn.addEventListener("click", () => {
    body.classList.add("dark-theme");
    localStorage.setItem("theme", "dark");
  });

  // Remember theme on page load
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-theme");
  } else {
    body.classList.remove("dark-theme");
  }
});


// ================= HEADER JS =================
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  // Sticky header on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) header.classList.add("sticky");
    else header.classList.remove("sticky");

    setActiveNavLink();
  });

  // Mobile menu toggle with neon glow
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show");
    menuToggle.classList.toggle("glow-pulse");
  });

  // Dark/Light theme toggle
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-theme");
    themeToggle.innerHTML = body.classList.contains("dark-theme")
                             ? "<i class='bx bx-sun'></i>"
                             : "<i class='bx bx-moon'></i>";
  });

  // Highlight active section link with neon underline
  const sections = document.querySelectorAll("section");
  function setActiveNavLink() {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const id = section.id;
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        document.querySelectorAll("#nav-menu a").forEach(link => link.classList.remove("active"));
        const activeLink = document.querySelector(`#nav-menu a[href="#${id}"]`);
        if(activeLink) activeLink.classList.add("active");
      }
    });
  }
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
