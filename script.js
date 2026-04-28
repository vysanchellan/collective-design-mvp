(() => {
  // Theme toggle
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const saved = localStorage.getItem("cd_theme");

  if (saved === "dark" || saved === "light") {
    root.setAttribute("data-theme", saved);
  }

  toggle?.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("cd_theme", next);
  });

  // Intro animation control
  const intro = document.getElementById("intro");
  const skipIntro = document.getElementById("skipIntro");
  const introSeen = sessionStorage.getItem("cd_intro_seen");

  const closeIntro = () => {
    if (!intro) return;
    intro.classList.add("hidden");
    sessionStorage.setItem("cd_intro_seen", "1");
    setTimeout(() => {
      intro.style.display = "none";
    }, 750);
  };

  if (introSeen) {
    if (intro) {
      intro.classList.add("hidden");
      intro.style.display = "none";
    }
  } else {
    setTimeout(closeIntro, 2600);
  }

  skipIntro?.addEventListener("click", closeIntro);

  // Reveal on scroll
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );
  revealEls.forEach((el) => io.observe(el));

  // Cursor glow
  const glow = document.getElementById("cursorGlow");
  window.addEventListener(
    "pointermove",
    (e) => {
      if (!glow) return;
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    },
    { passive: true }
  );

  // Light tilt effect
  const tiltEls = document.querySelectorAll(".tilt");
  tiltEls.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      el.style.transform = `perspective(900px) rotateX(${(-dy * 4).toFixed(2)}deg) rotateY(${(dx * 5).toFixed(2)}deg) translateY(-2px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  });

  // Contact form validation
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

  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test((v || "").trim());

  function clearErrors() {
    nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";
  }

  function validate() {
    clearErrors();
    let ok = true;

    if ((nameInput.value || "").trim().length < 2) {
      nameError.textContent = "Please enter your full name.";
      ok = false;
    }

    if (!validEmail(emailInput.value || "")) {
      emailError.textContent = "Please enter a valid business email.";
      ok = false;
    }

    if ((messageInput.value || "").trim().length < 12) {
      messageError.textContent = "Please provide more project details.";
      ok = false;
    }

    return ok;
  }

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
      await new Promise((resolve) => setTimeout(resolve, 900));
      form.reset();
      status.textContent = "Inquiry sent successfully. We’ll contact you shortly.";
      status.classList.add("success");
    } catch {
      status.textContent = "Something went wrong. Please try again.";
      status.classList.add("error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = original;
    }
  });
})();
