// ================== EMAIL.JS — FULL WORKING VERSION WITH SUCCESS POPUP ==================
(function () {
  // ✅ Initialize EmailJS with your public key
  emailjs.init("ILlSd42qf_3o8DE93");
})();

document.addEventListener("DOMContentLoaded", () => {
  // ===== ELEMENT REFERENCES =====
  const contactForm = document.getElementById("contactForm");
  const statusMsg = document.getElementById("statusMsg");
  const contactBg = document.querySelector(".contact-bg");
  const submitBtn = contactForm.querySelector(".btn-glow");
  const formFields = contactForm.querySelectorAll("input, textarea");

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

    const fromName = contactForm.from_name?.value.trim();
    const fromEmail = contactForm.from_email?.value.trim();
    const message = contactForm.message?.value.trim();

    // ===== VALIDATION =====
    if (!fromName || !fromEmail || !message) {
      showStatus("⚠️ Please fill in all fields.", "error");
      return;
    }

    // ===== VISUAL FEEDBACK DURING SEND =====
    submitBtn.classList.add("sending");
    contactForm.style.boxShadow =
      "0 0 40px rgba(75,95,255,0.6), 0 0 60px rgba(168,85,247,0.4)";
    showStatus("📨 Sending your message...", "sending");

    try {
      // 1️⃣ Send message to yourself
      await emailjs.sendForm("service_q9049ro", "template_7seawpc", contact_form);

      // ✅ SUCCESS MESSAGE
      showStatus("✅ Message sent successfully! Auto-reply delivered.", "success");

      // 🎉 SHOW POPUP
      showSuccessPopup();

      // Reset form
      contactForm.reset();
      formFields.forEach((f) => f.classList.remove("focused"));
    } catch (error) {
      console.error("EmailJS Error:", error);
      showStatus("❌ Failed to send message. Please try again later.", "error");
    }

    // ===== CLEANUP EFFECT =====
    setTimeout(() => {
      submitBtn.classList.remove("sending");
      contactForm.style.boxShadow = "0 0 25px rgba(75,95,255,0.2)";
      statusMsg.style.opacity = "0";
    }, 4000);
  });

  // ===== STATUS MESSAGE FUNCTION =====
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

  // ===== POPUP FUNCTION =====
  function showSuccessPopup() {
    const popup = document.getElementById("successPopup");
    if (!popup) return;
    popup.classList.add("show");

    // Hide after 3 seconds or on click
    setTimeout(() => popup.classList.remove("show"), 3000);
    popup.addEventListener("click", () => popup.classList.remove("show"));
  }
});
