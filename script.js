document.addEventListener("DOMContentLoaded", () => {
  // ===== Sticky Header =====
  const header = document.querySelector("header");
  if (header) {
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 0) {
          header.classList.add("sticky");
        } else {
          header.classList.remove("sticky");
        }
      },
      { passive: true }
    );
  }

  // ===== Mobile Menu Toggle =====
  const menu = document.querySelector("#menu-icon");
  const navbar = document.querySelector(".navbar");

  if (menu && navbar) {
    menu.addEventListener("click", () => {
      const expanded = menu.getAttribute("aria-expanded") === "true";
      menu.setAttribute("aria-expanded", String(!expanded));

      menu.classList.toggle("bx-x");
      navbar.classList.toggle("active");
    });

    // Close navbar when clicking a link (mobile UX)
    document.querySelectorAll(".navbar a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("bx-x");
        navbar.classList.remove("active");
        menu.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ===== Intersection Observer for Scroll Animations =====
  const revealElements = document.querySelectorAll(
    ".home-text, .about, .services, .portfolio, .contact"
  );

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target); // animate once, then stop observing
          }
        });
      },
      {
        threshold: 0.2, // reveal when 20% visible
        rootMargin: "0px 0px -50px 0px",
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }
});
