// ================== EMAIL.JS — ULTIMATE CONTACT FORM ==================
(function () {
  // ✅ Initialize EmailJS
  emailjs.init("xPog1F9WTz3rvgvXbxzsL"); // Your public key
})();

document.addEventListener("DOMContentLoaded", () => {
  // ===== ELEMENT REFERENCES =====
  const contactForm = document.getElementById("contactForm") || document.getElementById("contact-form");
  const statusMsg = document.getElementById("statusMsg") || document.getElementById("status-msg");
  const contactBg = document.querySelector(".contact-bg");
  const submitBtn = contactForm.querySelector(".btn-glow") || document.getElementById("submit-btn");
  const formFields = contactForm.querySelectorAll("input, textarea, .form-field");

  // ===== CREATE NEON PARTICLES =====
  if (contactBg) {
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
  }

  // ===== FLOATING LABELS =====
  formFields.forEach((field) => {
    field.addEventListener("focus", () => field.classList.add("focused"));
    field.addEventListener("blur", () => {
      if (!field.value.trim()) field.classList.remove("focused");
    });
  });

  // ===== FORM SUBMISSION HANDLER =====
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fromName = contactForm.from_name?.value.trim() || "";
    const fromEmail = contactForm.from_email?.value.trim() || "";
    const message = contactForm.message?.value.trim() || "";

    // ===== VALIDATION =====
    if (!fromName || !fromEmail || !message) {
      showStatus("⚠️ Please fill in all fields.", "error");
      return;
    }

    // ===== VIP EFFECT DURING SENDING =====
    submitBtn.classList.add("sending");
    contactForm.style.boxShadow = "0 0 40px rgba(75,95,255,0.6), 0 0 60px rgba(168,85,247,0.4)";
    showStatus("📨 Sending...", "sending");

    try {
      // 1️⃣ Send message to yourself
      await emailjs.sendForm("service_q9049ro", "template_7seawpc", contactForm);

      // 2️⃣ Auto-reply to sender
      await emailjs.send("service_q9049ro", "template_wehotjb", {
        from_name: fromName,
        from_email: fromEmail,
        message: message,
      });

      // 3️⃣ Success message
      showStatus("✅ Message sent! Auto-reply delivered.", "success");

      // Reset fields
      contactForm.reset();
      formFields.forEach((f) => f.classList.remove("focused"));
    } catch (error) {
      console.error("EmailJS Error:", error);
      showStatus("❌ Failed to send. Please try again later.", "error");
    }

    // ===== CLEANUP EFFECTS =====
    setTimeout(() => {
      submitBtn.classList.remove("sending");
      contactForm.style.boxShadow = "0 0 25px rgba(75,95,255,0.2)";
      statusMsg.style.opacity = "0";
    }, 4000);
  });

  // ===== STATUS DISPLAY FUNCTION =====
  function showStatus(message, type) {
    statusMsg.textContent = message;
    statusMsg.className = `status-message status-${type}`;
    statusMsg.style.opacity = "1";

    switch (type) {
      case "sending":
        statusMsg.style.color = "#4b5fff";
        break;
      case "success":
        statusMsg.style.color = "#22c55e";
        break;
      case "error":
        statusMsg.style.color = "#ef4444";
        break;
      default:
        statusMsg.style.color = "#fff";
    }
  }
});
