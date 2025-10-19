// ================== PORTFOLIO MAIN JS (FULLY UPGRADED) ==================
(() => {
  "use strict";

  // ================= HEADER & NAV =================
const header = document.getElementById("header");
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

// Mobile menu toggle
menuToggle?.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

// Scroll events: sticky header & active link
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  // Sticky header
  header?.classList.toggle("sticky", scrollY > 50);

  // Active nav links
  document.querySelectorAll("section[id]").forEach(section => {
    const top = section.offsetTop - header.offsetHeight - 5; // header offset
    const bottom = top + section.offsetHeight;
    const link = document.querySelector(`#nav-menu a[href="#${section.id}"]`);
    if (link) {
      link.classList.toggle("active", scrollY >= top && scrollY < bottom);
    }
  });
});

// ================= THEME TOGGLE =================
const themeBtn = document.getElementById("theme-toggle-btn");
const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.dataset.theme = savedTheme;
themeBtn.textContent = savedTheme === "dark" ? "🌙" : "☀️";

themeBtn?.addEventListener("click", () => {
  const isDark = document.documentElement.dataset.theme === "dark";
  document.documentElement.dataset.theme = isDark ? "light" : "dark";
  themeBtn.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", document.documentElement.dataset.theme);
});

  
  // ================= HERO SCRIPT =================
document.addEventListener("DOMContentLoaded", () => {
  /* ---------- TYPING EFFECT ---------- */
  const typingText = document.getElementById("typing-text");
  const highlightText = document.querySelector(".hero-title .highlight");
  const roles = ["Data Analyst", "Business Analyst", "Power BI Developer", "Python Enthusiast"];
  const typingSpeed = 120;
  const deletingSpeed = 50;
  const delayAfterWord = 1200;
  const nextWordDelay = 500;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    if (!typingText || !highlightText) return;

    const currentWord = roles[wordIndex];
    charIndex += isDeleting ? -1 : 1;

    const displayedText = currentWord.substring(0, charIndex);
    typingText.textContent = displayedText;
    highlightText.textContent = displayedText;
    highlightText.classList.add("highlight-gradient"); // gradient animation

    let timeout = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      timeout = delayAfterWord;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % roles.length;
      timeout = nextWordDelay;
    }

    setTimeout(typeEffect, timeout);
  }

  typeEffect();

  /* ---------- HERO BUTTONS VISIBILITY ---------- */
  const heroButtons = document.querySelectorAll(".hero-buttons .btn");
  heroButtons.forEach(btn => btn.classList.add("visible"));

  /* ---------- SMOOTH SCROLL ---------- */
  const header = document.getElementById("header");
  const navMenu = document.getElementById("nav-menu");

  document.querySelectorAll("#nav-menu a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const targetId = link.getAttribute("href")?.slice(1);
      const targetSection = targetId ? document.getElementById(targetId) : null;

      if (targetSection) {
        const offset = header ? header.offsetHeight : 0;
        window.scrollTo({
          top: targetSection.offsetTop - offset,
          behavior: "smooth"
        });
        if (navMenu) navMenu.classList.remove("active");
      }
    });
  });

  /* ---------- PROFILE PIC 3D PARALLAX ---------- */
  const wrapper = document.querySelector('.profile-pic-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 15; // max tilt 15deg
      const rotateX = ((y / rect.height) - 0.5) * -15;
      wrapper.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    });

    wrapper.addEventListener('mouseleave', () => {
      wrapper.style.transform = `rotateY(0deg) rotateX(0deg)`;
    });
  }
});


  // ===== Experince section  =====
document.querySelectorAll('.experience-card').forEach(card => {
  const particleCount = 15; // particles per card
  const container = card.querySelector('.card-particles');

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    container.appendChild(particle);

    // Random initial position
    particle.style.top = Math.random() * 100 + '%';
    particle.style.left = Math.random() * 100 + '%';

    // Animate particle randomly
    const animateParticle = () => {
      const newTop = Math.random() * 100;
      const newLeft = Math.random() * 100;
      const duration = 4000 + Math.random() * 4000; // 4–8s

      particle.animate([
        { top: particle.style.top, left: particle.style.left },
        { top: newTop + '%', left: newLeft + '%' }
      ], {
        duration: duration,
        iterations: 1,
        easing: 'ease-in-out'
      }).onfinish = () => {
        particle.style.top = newTop + '%';
        particle.style.left = newLeft + '%';
        animateParticle();
      };
    };

    animateParticle();
  }
});

/* ================= FULL SKILLS NEON UPGRADE ================= */
document.addEventListener('DOMContentLoaded', () => {

  const skills = [
    { selector: '.skill-circle[data-percent="90"]', target: 90 },
    { selector: '.skill-circle[data-percent="80"]', target: 80 },
    { selector: '.skill-circle[data-percent="75"]', target: 75 },
    { selector: '.skill-circle[data-percent="85"]', target: 85 }
  ];

  skills.forEach(skill => {
    const circle = document.querySelector(skill.selector);
    const percentSpan = circle.querySelector('.skill-percent');
    const ringProgress = circle.querySelector('.ring-progress');

    const radius = ringProgress.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    ringProgress.style.strokeDasharray = circumference;
    ringProgress.style.strokeDashoffset = circumference;

    let currentPercent = 0;

    // Animate the ring from 0 to target %
    function animateRing() {
      if (currentPercent < skill.target) {
        currentPercent++;
        percentSpan.textContent = currentPercent + '%';
        const offset = circumference - (currentPercent / 100) * circumference;
        ringProgress.style.strokeDashoffset = offset;
        requestAnimationFrame(animateRing);
      } else {
        percentSpan.textContent = skill.target + '%';
      }
    }

    // Start animation with slight random delay for staggered effect
    setTimeout(animateRing, Math.random() * 500);

    // ================= NEON PARTICLES =================
    const particlesContainer = circle.querySelector('.skill-particles');
    particlesContainer.innerHTML = '';
    const particleCount = 12;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.top = Math.random() * 100 + '%';
      particle.style.left = Math.random() * 100 + '%';
      const size = Math.random() * 4 + 2;
      particle.style.width = particle.style.height = size + 'px';
      particle.style.animationDuration = (Math.random() * 6 + 4) + 's';
      particle.style.animationDelay = Math.random() * 5 + 's';
      particle.style.background = `rgba(${75 + Math.random()*180}, ${95 + Math.random()*160}, 255, ${Math.random()*0.5 + 0.3})`;
      particlesContainer.appendChild(particle);
    }

    // ================= COLOR GRADIENT & GLOW PULSE =================
    let hue = Math.random() * 360;
    let pulse = 0;

    function animateGlow() {
      hue = (hue + 1) % 360;
      ringProgress.style.stroke = `hsl(${hue}, 100%, 60%)`;
      pulse += 0.05;
      const glow = 15 + Math.sin(pulse) * 10;
      circle.style.boxShadow = `0 0 ${glow}px hsl(${hue}, 100%, 60%), inset 0 0 ${glow/2}px hsl(${hue}, 100%, 60%)`;
      requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // ================= HOVER PARTICLE EXPLOSION =================
    circle.addEventListener('mouseenter', () => {
      for (let i = 0; i < particleCount; i++) {
        const particle = particlesContainer.children[i];
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 50 + 20;
        particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
        particle.style.opacity = 0;
      }
    });
    circle.addEventListener('mouseleave', () => {
      for (let i = 0; i < particleCount; i++) {
        const particle = particlesContainer.children[i];
        particle.style.transform = `translate(0px, 0px)`;
        particle.style.opacity = 1;
      }
    });

  });

});



// ===== Certitfication Section  =====
 // ===== Certification Carousel =====
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".carousel-container");
  const track = document.querySelector(".certifications-carousel");
  const cards = Array.from(track.querySelectorAll(".certification-card"));
  const prevBtn = document.querySelector(".left-btn");
  const nextBtn = document.querySelector(".right-btn");

  if (!container || !track || cards.length === 0) return;

  let index = 0;
  let width = container.clientWidth;
  let isAnimating = false;

  // ===== Initialize layout =====
  track.style.display = "flex";
  track.style.transition = "transform 0.6s ease";
  track.style.willChange = "transform";

  cards.forEach((card) => {
    card.style.flex = "0 0 100%";
    card.style.maxWidth = "100%";
  });

  // ===== Move to card =====
  const goTo = (i, animate = true) => {
    if (i < 0) i = cards.length - 1;
    if (i >= cards.length) i = 0;
    index = i;

    track.style.transition = animate ? "transform 0.6s ease" : "none";
    track.style.transform = `translateX(${-index * width}px)`;
    updateActiveCard();
  };

  // ===== Active card glowing effect =====
  const updateActiveCard = () => {
    cards.forEach((card, i) => {
      if (i === index) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
    });
  };

  // ===== Arrow button events =====
  prevBtn.addEventListener("click", () => {
    if (isAnimating) return;
    goTo(index - 1);
  });

  nextBtn.addEventListener("click", () => {
    if (isAnimating) return;
    goTo(index + 1);
  });

  // ===== Transition lock =====
  track.addEventListener("transitionstart", () => (isAnimating = true));
  track.addEventListener("transitionend", () => (isAnimating = false));

  // ===== Resize listener =====
  window.addEventListener("resize", () => {
    width = container.clientWidth;
    goTo(index, false);
  });

  // ===== Init =====
  goTo(0, false);
});

 

(function() {
  // Initialize EmailJS with your public key
  emailjs.init("xPog1F9WTz3rvgvXbxzsL");
})();

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  const statusMsg = document.getElementById("statusMsg");
  const contactBg = document.querySelector(".contact-bg");
  const submitBtn = contactForm.querySelector(".btn-glow");

  // ===== VIP FLOATING NEON PARTICLES =====
  const particleCount = 50;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.classList.add("neon-particle");
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.width = 2 + Math.random() * 6 + "px";
    particle.style.height = particle.style.width;
    particle.style.animationDuration = 4 + Math.random() * 6 + "s";
    particle.style.opacity = 0.3 + Math.random() * 0.5;
    contactBg.appendChild(particle);
  }

  // ===== FLOATING LABELS EFFECT =====
  const formFields = contactForm.querySelectorAll("input, textarea");
  formFields.forEach(field => {
    field.addEventListener("focus", () => field.classList.add("focused"));
    field.addEventListener("blur", () => {
      if (!field.value) field.classList.remove("focused");
    });
  });

  // ===== FORM SUBMISSION =====
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fromName = contactForm.from_name.value.trim();
    const fromEmail = contactForm.from_email.value.trim();
    const message = contactForm.message.value.trim();

    // ===== VALIDATION =====
    if (!fromName || !fromEmail || !message) {
      statusMsg.textContent = "⚠️ Please fill in all fields.";
      statusMsg.className = "status-message status-error";
      statusMsg.style.opacity = "1";
      return;
    }

    // ===== VIP EFFECTS DURING SENDING =====
    submitBtn.classList.add("sending"); // button neon pulse
    contactForm.style.boxShadow = "0 0 40px rgba(75,95,255,0.6), 0 0 60px rgba(168,85,247,0.4)"; // form glow
    statusMsg.textContent = "📨 Sending...";
    statusMsg.className = "status-message";
    statusMsg.style.color = "#4b5fff";
    statusMsg.style.opacity = "1";

    try {
      // 1️⃣ Send message to yourself
      await emailjs.sendForm("service_q9049ro", "template_7seawpc", contactForm);

      // 2️⃣ Auto-reply to sender
      await emailjs.send("service_q9049ro", "template_wehotjb", {
        from_name: fromName,
        from_email: fromEmail,
        message: message
      });

      // 3️⃣ Success feedback
      statusMsg.textContent = "✅ Message sent! Auto-reply delivered.";
      statusMsg.className = "status-message status-success";
      statusMsg.style.opacity = "1";

      // Reset form & floating labels
      contactForm.reset();
      formFields.forEach(f => f.classList.remove("focused"));

    } catch (error) {
      console.error("EmailJS Error:", error);
      statusMsg.textContent = "❌ Failed to send. Please try again later.";
      statusMsg.className = "status-message status-error";
      statusMsg.style.opacity = "1";
    }

    // ===== CLEANUP AFTER 4s =====
    setTimeout(() => {
      submitBtn.classList.remove("sending");
      contactForm.style.boxShadow = "0 0 25px rgba(75,95,255,0.2)";
      statusMsg.style.opacity = "0";
    }, 4000);
  });
});









// ===== SCROLL TO TOP BUTTON =====
// Get the button element
let mybutton = document.getElementById("myBtn");

// Show button when user scrolls down 100px
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// Smooth scroll to top on click
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}


  // ===== CHATBOT =====
// ================= ULTRA-MODERN CHATBOT JS =================
document.addEventListener("DOMContentLoaded", () => {
  // ===== Get all required elements =====
  const chatbotToggle = document.getElementById("chatbot-toggle");
  const chatbotWindow = document.getElementById("chatbot-window");
  const chatbotClose = document.getElementById("chatbot-close");
  const chatbotSend = document.getElementById("chatbot-send");
  const chatbotInput = document.getElementById("chatbot-input");
  const chatbotBody = document.getElementById("chatbot-body");
  const botSound = document.getElementById("bot-sound");
  const userSound = document.getElementById("user-sound");
  const soundCheckbox = document.getElementById("sound-checkbox");

  // ===== Helper: Play Sound =====
  function playSound(type){
    if(!soundCheckbox.checked) return;
    if(type === "bot") botSound.play();
    if(type === "user") userSound.play();
  }

  // ===== Open/Close Chat Window =====
  chatbotToggle.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent closing from document click
    chatbotWindow.classList.toggle("chatbot-visible");
    chatbotToggle.classList.toggle("pulse"); // neon pulse when active
  });

  chatbotClose.addEventListener("click", () => {
    chatbotWindow.classList.remove("chatbot-visible");
    chatbotToggle.classList.remove("pulse");
  });

  // ===== Close on outside click =====
  document.addEventListener("click", (e) => {
    if (!chatbotWindow.contains(e.target) && !chatbotToggle.contains(e.target) && chatbotWindow.classList.contains("chatbot-visible")) {
      chatbotWindow.classList.remove("chatbot-visible");
      chatbotToggle.classList.remove("pulse");
    }
  });

  // ===== Send Message Function =====
  function sendMessage() {
    const msg = chatbotInput.value.trim();
    if(!msg) return;

    // --- User message ---
    const userMsgDiv = document.createElement("div");
    userMsgDiv.classList.add("user-msg");
    userMsgDiv.textContent = msg;
    chatbotBody.appendChild(userMsgDiv);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
    playSound("user");
    chatbotInput.value = "";

    // --- Bot typing indicator ---
    const botTypingDiv = document.createElement("div");
    botTypingDiv.classList.add("bot-msg");
    botTypingDiv.textContent = "AI is typing...";
    botTypingDiv.style.opacity = 0.6;
    chatbotBody.appendChild(botTypingDiv);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;

    // --- Bot reply after delay ---
    setTimeout(() => {
      chatbotBody.removeChild(botTypingDiv);
      const botReplyDiv = document.createElement("div");
      botReplyDiv.classList.add("bot-msg");
      botReplyDiv.textContent = "I’m here to help! You asked: " + msg;
      chatbotBody.appendChild(botReplyDiv);
      chatbotBody.scrollTop = chatbotBody.scrollHeight;
      playSound("bot");
    }, 1000);
  }

  // ===== Event Listeners for Sending =====
  chatbotSend.addEventListener("click", sendMessage);
  chatbotInput.addEventListener("keypress", (e) => {
    if(e.key === "Enter") sendMessage();
  });
});



//================= HIDDEN KEYWORDS SECTION ================= 
  const keywords = Array.from(document.querySelectorAll('.hidden-keyword')).map(el => el.textContent);
console.log(keywords); // ["Data Analytics", "Power BI", "Business Intelligence", "SQL"]

 
