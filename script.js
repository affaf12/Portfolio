document.addEventListener("DOMContentLoaded", () => {
    // ===== Sticky Header =====
    const header = document.querySelector("header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 0) header.classList.add("sticky");
        else header.classList.remove("sticky");
    }, { passive: true });

    // ===== Mobile Menu =====
    const menu = document.querySelector("#menu-icon");
    const navbar = document.querySelector(".navbar");
    menu.addEventListener("click", () => {
        const expanded = menu.getAttribute("aria-expanded") === "true";
        menu.setAttribute("aria-expanded", String(!expanded));
        menu.classList.toggle("bx-x");
        navbar.classList.toggle("active");
    });
    document.querySelectorAll(".navbar a").forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.remove("bx-x");
            navbar.classList.remove("active");
            menu.setAttribute("aria-expanded", "false");
        });
    });

    // ===== Scroll Reveal =====
    const revealElements = document.querySelectorAll("section");
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal-visible");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    revealElements.forEach(el => observer.observe(el));
});

// ===== Chatbot =====
const chatbot = document.getElementById('chatbot');
const toggleBtn = document.getElementById('chatbot-toggle');
const closeBtn = document.getElementById('chatbot-close');
const typingIndicator = document.getElementById('chatbot-typing');
const sendBtn = document.getElementById('chatbot-send');
const input = document.getElementById('chatbot-input');
const messages = document.getElementById('chatbot-messages');

// Predefined bot responses
const botResponses = {
    "retail": "Yes! Here is the Retail Analytics demo report: <a href='https://your-retail-report.com' target='_blank'>View Report</a>",
    "finance": "Finance Analytics demo report is ready: <a href='https://your-finance-report.com' target='_blank'>View Report</a>",
    "hr": "HR Analytics demo report is available: <a href='https://your-hr-report.com' target='_blank'>View Report</a>",
    "hello": "Hello! Ask me about reports: Retail, Finance, HR...",
    "hi": "Hi there! I can provide demo reports for Retail, Finance, HR...",
    "default": "Sorry, I didn't understand that. Please ask about Retail, Finance, or HR reports."
};

// ===== Chatbot Toggle =====
toggleBtn.addEventListener('click', () => { chatbot.style.display = 'flex'; });
closeBtn.addEventListener('click', () => { chatbot.style.display = 'none'; });

// ===== Send Message =====
sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keypress', (e) => { if (e.key === "Enter") sendMessage(); });

function sendMessage() {
    const userText = input.value.trim();
    if (!userText) return;

    addMessage(userText, "user");
    input.value = "";
    typingIndicator.style.display = "block";

    setTimeout(() => {
        typingIndicator.style.display = "none";
        const response = botResponses[userText.toLowerCase()] || botResponses["default"];
        addMessage(response, "bot");
    }, 800); // Slightly faster for better UX
}

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('chatbot-message', sender);
    div.innerHTML = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}
