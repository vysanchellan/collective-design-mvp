(() => {
  // Sticky style for header
  const header = document.querySelector(".site-header");
  const setHeader = () => {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  setHeader();
  window.addEventListener("scroll", setHeader, { passive: true });

  // Cursor glow
  const glow = document.querySelector(".cursor-glow");
  window.addEventListener("pointermove", (e) => {
    if (!glow) return;
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  }, { passive: true });

  // Reveal on scroll
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealEls.forEach(el => io.observe(el));

  // Theme toggle with persistence
  const root = document.documentElement;
  const toggleBtn = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("cd_theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    root.setAttribute("data-theme", savedTheme);
  }

  toggleBtn?.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("cd_theme", next);
  });

  // Form validation (MVP frontend)
  const form = document.getElementById("inquiryForm");
  if (!form) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");
  const status = document.getElementById("formStatus");
  const submitBtn = form.querySelector(".submit-btn");

  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v.trim());

  const clearErrors = () => {
    nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";
  };

  const validate = () => {
    clearErrors();
    let valid = true;

    if ((nameInput.value || "").trim().length < 2) {
      nameError.textContent = "Please enter your full name.";
      valid = false;
    }

    if (!emailOk(emailInput.value || "")) {
      emailError.textContent = "Please enter a valid business email.";
      valid = false;
    }

    if ((messageInput.value || "").trim().length < 12) {
      messageError.textContent = "Please provide more project details.";
      valid = false;
    }

    return valid;
  };

  [nameInput, emailInput, messageInput].forEach((el) => {
    el?.addEventListener("input", () => {
      status.textContent = "";
      status.className = "form-status";
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    status.textContent = "";
    status.className = "form-status";

    if (!validate()) {
      status.textContent = "Please fix the highlighted fields.";
      status.classList.add("error");
      return;
    }

    const original = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      // Simulated network delay for MVP
      await new Promise(r => setTimeout(r, 900));

      form.reset();
      status.textContent = "Inquiry sent. We’ll get back to you shortly.";
      status.classList.add("success");
    } catch (err) {
      status.textContent = "Could not send inquiry. Please try again.";
      status.classList.add("error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = original;
    }
  });
})();
