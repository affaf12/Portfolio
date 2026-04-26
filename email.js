// ============================================================
//  NextGen Analytics — VIP Contact Form  (email.js)
//  Features: Field-level validation · Character counter
//            Step-by-step send status · Retry logic
//            Spam protection · Rate limiting · Input memory
//            Confetti burst · Accessible error states
// ============================================================

// ── Initialize EmailJS ───────────────────────────────────────
(function () {
  emailjs.init("ILlSd42qf_3o8DE93");
})();

// ── Config ───────────────────────────────────────────────────
const CFG = {
  SERVICE_ID    : "service_q9049ro",
  TEMPLATE_ADMIN: "template_7seawpc",
  TEMPLATE_REPLY: "template_wehotjb",
  MAX_CHARS     : 1000,     // message char limit
  RATE_LIMIT_MS : 60000,    // 1 min between submissions
  MAX_RETRIES   : 2,        // auto-retry on network fail
  MEMORY_KEY    : "nga_form_memory",  // localStorage key
};

// ── Validation rules ─────────────────────────────────────────
const RULES = {
  from_name: {
    minLen : 2,
    maxLen : 60,
    pattern: /^[a-zA-Z\s\u0600-\u06FF'-]+$/,
    msgs: {
      empty  : "Please enter your name.",
      short  : "Name must be at least 2 characters.",
      long   : "Name must be under 60 characters.",
      pattern: "Name may only contain letters and spaces.",
    }
  },
  from_email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    msgs: {
      empty  : "Please enter your email address.",
      pattern: "Please enter a valid email (e.g. you@example.com).",
    }
  },
  message: {
    minLen : 15,
    maxLen : CFG.MAX_CHARS,
    msgs: {
      empty  : "Please enter your message.",
      short  : "Message must be at least 15 characters.",
      long   : `Message must be under ${CFG.MAX_CHARS} characters.`,
    }
  }
};

// ── Spam keyword detection ────────────────────────────────────
const SPAM_PATTERNS = [
  /\b(viagra|casino|lottery|click here|free money|bitcoin|crypto investment)\b/i,
  /https?:\/\/[^\s]{3,}/gi,   // URLs in message
];

document.addEventListener("DOMContentLoaded", () => {

  // ── DOM refs ─────────────────────────────────────────────────
  const form      = document.getElementById("contactForm");
  const statusMsg = document.getElementById("statusMsg");
  const submitBtn = form?.querySelector(".btn-glow");
  const fields    = form?.querySelectorAll("input, textarea");
  const contactBg = document.querySelector(".contact-bg");

  if (!form || !submitBtn) return;

  // ── State ─────────────────────────────────────────────────────
  let lastSubmitTime = 0;
  let retryCount     = 0;
  let isSending      = false;

  // ── Inject enhanced CSS ───────────────────────────────────────
  injectStyles();

  // ── Build neon particle background ───────────────────────────
  buildParticles(contactBg);

  // ── Restore saved name/email ──────────────────────────────────
  restoreMemory(form);

  // ── Field error elements ──────────────────────────────────────
  ["from_name","from_email","message"].forEach(name => {
    const field = form.elements[name];
    if (!field) return;

    // Create inline error span
    const err = document.createElement("span");
    err.className    = "field-error";
    err.id           = `err-${name}`;
    err.setAttribute("role","alert");
    err.setAttribute("aria-live","polite");
    field.parentElement.appendChild(err);

    // Floating label focus/blur
    field.addEventListener("focus", () => field.classList.add("focused"));
    field.addEventListener("blur",  () => {
      if (!field.value.trim()) field.classList.remove("focused");
      validateField(field, name, true);     // validate on blur
    });

    // Clear error on input
    field.addEventListener("input", () => {
      clearFieldError(name);
      if (name === "message") updateCharCounter(field);
    });
  });

  // ── Character counter for message ─────────────────────────────
  const msgField = form.elements["message"];
  if (msgField) buildCharCounter(msgField);

  // ── Honeypot hidden field (spam trap) ─────────────────────────
  const pot = document.createElement("input");
  pot.type  = "text";
  pot.name  = "website";   // bots fill this; humans don't see it
  pot.style.cssText = "position:absolute;left:-9999px;opacity:0;height:0;";
  form.appendChild(pot);

  // ── FORM SUBMIT ───────────────────────────────────────────────
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (isSending) return;

    // ── Honeypot check ──
    if (form.elements["website"]?.value) {
      console.warn("Spam submission blocked.");
      return;
    }

    // ── Rate limit ──
    const now = Date.now();
    if (now - lastSubmitTime < CFG.RATE_LIMIT_MS) {
      const secLeft = Math.ceil((CFG.RATE_LIMIT_MS - (now - lastSubmitTime)) / 1000);
      setStatus(`⏳ Please wait ${secLeft}s before sending again.`, "warn");
      shakeForm();
      return;
    }

    // ── Validate all fields ──
    const nameOk  = validateField(form.elements["from_name"],  "from_name",  true);
    const emailOk = validateField(form.elements["from_email"], "from_email", true);
    const msgOk   = validateField(form.elements["message"],    "message",    true);
    if (!nameOk || !emailOk || !msgOk) { shakeForm(); return; }

    // ── Spam content check ──
    const msgVal = form.elements["message"].value;
    if (SPAM_PATTERNS.some(p => p.test(msgVal))) {
      setFieldError("message", "Message contains content that looks like spam.");
      shakeForm(); return;
    }

    // ── Begin send flow ──
    isSending = true;
    retryCount = 0;
    await sendWithProgress();
  });

  // ── SEND WITH PROGRESS STEPS ───────────────────────────────────
  async function sendWithProgress() {
    setButtonState("loading");
    animateProgress(0, 30, 600);

    try {
      // Step 1 — connecting
      setStatus("🔗 Connecting to mail server...", "sending");
      await delay(500);
      animateProgress(30, 55, 400);

      // Step 2 — send admin email
      setStatus("📨 Sending your message...", "sending");
      await emailjs.sendForm(CFG.SERVICE_ID, CFG.TEMPLATE_ADMIN, form);
      animateProgress(55, 80, 400);

      // Step 3 — send auto-reply
      setStatus("📬 Sending you a confirmation...", "sending");
      await emailjs.send(CFG.SERVICE_ID, CFG.TEMPLATE_REPLY, {
        from_name : form.elements["from_name"].value.trim(),
        from_email: form.elements["from_email"].value.trim(),
        message   : form.elements["message"].value.trim(),
      });
      animateProgress(80, 100, 500);

      // ── SUCCESS ──
      await delay(400);
      setButtonState("success");
      setStatus("✅ Message sent! Check your inbox for a confirmation email.", "success");
      saveMemory(form);
      launchConfetti();
      showSuccessPopup();
      retryCount = 0;
      lastSubmitTime = Date.now();
      form.reset();
      fields.forEach(f => f.classList.remove("focused"));
      resetCharCounter();

      // Reset button after 4s
      setTimeout(() => {
        setButtonState("idle");
        setStatus("", "");
        resetProgress();
      }, 4000);

    } catch (err) {
      console.error("EmailJS error:", err);

      if (retryCount < CFG.MAX_RETRIES) {
        retryCount++;
        setStatus(`⚠️ Network issue — retrying (${retryCount}/${CFG.MAX_RETRIES})...`, "warn");
        animateProgress(0, 20, 400);
        await delay(1500);
        await sendWithProgress();
        return;
      }

      // Max retries exhausted
      setButtonState("error");
      setStatus("❌ Failed to send. Please email us directly: muhammadaffaf746@gmail.com", "error");
      shakeForm();
      setTimeout(() => {
        setButtonState("idle");
        resetProgress();
      }, 5000);
    }

    isSending = false;
  }

  // ── FIELD VALIDATION ──────────────────────────────────────────
  function validateField(field, name, showErr) {
    if (!field) return true;
    const val   = field.value.trim();
    const rules = RULES[name];
    let errMsg  = "";

    if (!val) {
      errMsg = rules.msgs.empty;
    } else if (rules.minLen && val.length < rules.minLen) {
      errMsg = rules.msgs.short;
    } else if (rules.maxLen && val.length > rules.maxLen) {
      errMsg = rules.msgs.long;
    } else if (rules.pattern && !rules.pattern.test(val)) {
      errMsg = rules.msgs.pattern;
    }

    if (errMsg) {
      if (showErr) setFieldError(name, errMsg);
      field.setAttribute("aria-invalid","true");
      return false;
    }

    clearFieldError(name);
    field.setAttribute("aria-invalid","false");
    return true;
  }

  function setFieldError(name, msg) {
    const err   = document.getElementById(`err-${name}`);
    const field = form.elements[name];
    if (err)   { err.textContent = msg; err.classList.add("visible"); }
    if (field) { field.classList.add("field-invalid"); }
  }

  function clearFieldError(name) {
    const err   = document.getElementById(`err-${name}`);
    const field = form.elements[name];
    if (err)   { err.textContent = ""; err.classList.remove("visible"); }
    if (field) { field.classList.remove("field-invalid"); }
  }

  // ── BUTTON STATE MACHINE ──────────────────────────────────────
  const BTN_STATES = {
    idle   : { text: "Send Message",   cls: "",              disabled: false },
    loading: { text: "Sending...",     cls: "btn-loading",   disabled: true  },
    success: { text: "✅ Sent!",        cls: "btn-success",   disabled: true  },
    error  : { text: "❌ Failed",       cls: "btn-error",     disabled: false },
  };

  function setButtonState(state) {
    const s = BTN_STATES[state] || BTN_STATES.idle;
    submitBtn.textContent = s.text;
    submitBtn.className   = `btn-glow ${s.cls}`.trim();
    submitBtn.disabled    = s.disabled;
  }

  // ── STATUS MESSAGE ────────────────────────────────────────────
  function setStatus(msg, type) {
    if (!statusMsg) return;
    statusMsg.textContent = msg;
    statusMsg.className   = `status-message status-${type}`;
    statusMsg.style.opacity = msg ? "1" : "0";
  }

  // ── PROGRESS BAR ──────────────────────────────────────────────
  let progressBar = null;

  function ensureProgressBar() {
    if (progressBar) return;
    progressBar = document.createElement("div");
    progressBar.className = "send-progress";
    const fill = document.createElement("div");
    fill.className = "send-progress-fill";
    progressBar.appendChild(fill);
    form.insertBefore(progressBar, submitBtn);
  }

  function animateProgress(from, to, duration) {
    ensureProgressBar();
    const fill  = progressBar.querySelector(".send-progress-fill");
    const start = performance.now();
    const tick  = (now) => {
      const t = Math.min((now - start) / duration, 1);
      fill.style.width = (from + (to - from) * easeOut(t)) + "%";
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function resetProgress() {
    if (!progressBar) return;
    const fill = progressBar.querySelector(".send-progress-fill");
    fill.style.transition = "none";
    fill.style.width = "0%";
  }

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  // ── CHAR COUNTER ──────────────────────────────────────────────
  let charCounter = null;

  function buildCharCounter(field) {
    charCounter = document.createElement("div");
    charCounter.className = "char-counter";
    charCounter.textContent = `0 / ${CFG.MAX_CHARS}`;
    field.parentElement.appendChild(charCounter);
  }

  function updateCharCounter(field) {
    if (!charCounter) return;
    const len = field.value.length;
    charCounter.textContent = `${len} / ${CFG.MAX_CHARS}`;
    charCounter.classList.toggle("char-warn",  len > CFG.MAX_CHARS * 0.85);
    charCounter.classList.toggle("char-limit", len >= CFG.MAX_CHARS);
  }

  function resetCharCounter() {
    if (!charCounter) return;
    charCounter.textContent = `0 / ${CFG.MAX_CHARS}`;
    charCounter.classList.remove("char-warn","char-limit");
  }

  // ── SHAKE ANIMATION ───────────────────────────────────────────
  function shakeForm() {
    form.classList.add("shake");
    setTimeout(() => form.classList.remove("shake"), 600);
  }

  // ── CONFETTI BURST ────────────────────────────────────────────
  function launchConfetti() {
    const colors = ["#4b5fff","#6c5fff","#ff4bff","#22c55e","#fbbf24","#f87171"];
    for (let i = 0; i < 60; i++) {
      const c    = document.createElement("div");
      c.className = "confetti-piece";
      c.style.cssText = `
        left: ${Math.random() * 100}%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        width: ${5 + Math.random() * 6}px;
        height: ${8 + Math.random() * 8}px;
        animation-duration: ${0.8 + Math.random() * 1.4}s;
        animation-delay: ${Math.random() * 0.4}s;
        transform: rotate(${Math.random() * 360}deg);
      `;
      document.body.appendChild(c);
      c.addEventListener("animationend", () => c.remove());
    }
  }

  // ── SUCCESS POPUP ─────────────────────────────────────────────
  function showSuccessPopup() {
    const popup = document.getElementById("successPopup");
    if (!popup) return;
    popup.classList.remove("hidden");
    popup.classList.add("show");
    setTimeout(() => {
      popup.classList.remove("show");
      setTimeout(() => popup.classList.add("hidden"), 400);
    }, 3500);
    if (!popup.dataset.listener) {
      popup.addEventListener("click", () => {
        popup.classList.remove("show");
        setTimeout(() => popup.classList.add("hidden"), 400);
      });
      popup.dataset.listener = "1";
    }
  }

  // ── PARTICLE BACKGROUND ───────────────────────────────────────
  function buildParticles(bg) {
    if (!bg) return;
    for (let i = 0; i < 55; i++) {
      const p  = document.createElement("div");
      const sz = 2 + Math.random() * 5;
      p.className = "neon-particle";
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        top:  ${Math.random() * 100}%;
        width:  ${sz}px;
        height: ${sz}px;
        animation-duration: ${4 + Math.random() * 6}s;
        animation-delay:    ${Math.random() * 4}s;
        opacity: ${0.2 + Math.random() * 0.5};
      `;
      bg.appendChild(p);
    }
  }

  // ── MEMORY (remember name/email) ──────────────────────────────
  function saveMemory(f) {
    try {
      localStorage.setItem(CFG.MEMORY_KEY, JSON.stringify({
        name : f.elements["from_name"]?.value.trim(),
        email: f.elements["from_email"]?.value.trim(),
      }));
    } catch (_) {}
  }

  function restoreMemory(f) {
    try {
      const saved = JSON.parse(localStorage.getItem(CFG.MEMORY_KEY) || "{}");
      if (saved.name  && f.elements["from_name"])  {
        f.elements["from_name"].value = saved.name;
        f.elements["from_name"].classList.add("focused");
      }
      if (saved.email && f.elements["from_email"]) {
        f.elements["from_email"].value = saved.email;
        f.elements["from_email"].classList.add("focused");
      }
    } catch (_) {}
  }

  // ── UTILITY ───────────────────────────────────────────────────
  const delay = ms => new Promise(r => setTimeout(r, ms));

  // ── INJECT CSS ────────────────────────────────────────────────
  function injectStyles() {
    const s = document.createElement("style");
    s.textContent = `

      /* ── Field validation states ── */
      .field-invalid {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 2px rgba(239,68,68,0.2) !important;
      }
      .field-error {
        display: block;
        font-size: 11.5px;
        color: #f87171;
        margin-top: 4px;
        min-height: 16px;
        opacity: 0;
        transform: translateY(-4px);
        transition: all 0.2s;
        pointer-events: none;
      }
      .field-error.visible {
        opacity: 1;
        transform: translateY(0);
      }

      /* ── Character counter ── */
      .char-counter {
        font-size: 11px;
        color: #777;
        text-align: right;
        margin-top: 4px;
        transition: color 0.2s;
      }
      .char-counter.char-warn  { color: #fbbf24; }
      .char-counter.char-limit { color: #ef4444; font-weight: 600; }

      /* ── Progress bar ── */
      .send-progress {
        height: 3px;
        background: rgba(255,255,255,0.08);
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 14px;
      }
      .send-progress-fill {
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, #4b5fff, #6c5fff, #ff4bff);
        border-radius: 3px;
        transition: width 0.3s ease;
      }

      /* ── Button states ── */
      .btn-glow.btn-loading {
        opacity: 0.75;
        cursor: not-allowed;
        position: relative;
        padding-left: 42px;
      }
      .btn-glow.btn-loading::before {
        content: "";
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        width: 16px; height: 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
      }
      @keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }
      .btn-glow.btn-success {
        background: linear-gradient(135deg, #16a34a, #22c55e) !important;
        box-shadow: 0 0 20px rgba(34,197,94,0.4) !important;
      }
      .btn-glow.btn-error {
        background: linear-gradient(135deg, #b91c1c, #ef4444) !important;
        box-shadow: 0 0 20px rgba(239,68,68,0.3) !important;
      }

      /* ── Status message ── */
      .status-message {
        margin-top: 10px;
        font-size: 13px;
        font-weight: 500;
        transition: opacity 0.3s;
      }
      .status-sending { color: #818cf8; }
      .status-success { color: #22c55e; }
      .status-error   { color: #f87171; }
      .status-warn    { color: #fbbf24; }

      /* ── Shake animation ── */
      @keyframes shake {
        0%,100% { transform: translateX(0); }
        20%     { transform: translateX(-8px); }
        40%     { transform: translateX(8px); }
        60%     { transform: translateX(-5px); }
        80%     { transform: translateX(5px); }
      }
      .shake { animation: shake 0.55s ease; }

      /* ── Confetti ── */
      @keyframes confetti-fall {
        0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
        100% { transform: translateY(120vh) rotate(720deg); opacity: 0; }
      }
      .confetti-piece {
        position: fixed;
        top: 0;
        border-radius: 2px;
        z-index: 9999;
        pointer-events: none;
        animation: confetti-fall linear forwards;
      }

      /* ── Success popup upgrade ── */
      #successPopup {
        transition: opacity 0.4s, transform 0.4s;
        opacity: 0;
        transform: translateY(30px) scale(0.95);
      }
      #successPopup.show {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      #successPopup.hidden { display: none !important; }
    `;
    document.head.appendChild(s);
  }

}); // end DOMContentLoaded
