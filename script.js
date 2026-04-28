(() => {
  // Theme toggle
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("cd_theme");
  if (savedTheme === "dark" || savedTheme === "light") {
    root.setAttribute("data-theme", savedTheme);
  }
  toggle?.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("cd_theme", next);
  });

  // Intro
  const intro = document.getElementById("intro");
  const introLogo = document.getElementById("introLogo");
  const skipIntro = document.getElementById("skipIntro");

  const INTRO_MIN_MS = 1700;
  const INTRO_MAX_MS = 4500;
  const INTRO_SEEN_KEY = "cd_intro_seen_v2";

  let introClosed = false;
  const introStart = performance.now();

  const closeIntro = () => {
    if (!intro || introClosed) return;
    introClosed = true;
    intro.classList.add("hidden");
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    setTimeout(() => { intro.style.display = "none"; }, 760);
  };

  const closeWhenReady = () => {
    const elapsed = performance.now() - introStart;
    const waitMore = Math.max(0, INTRO_MIN_MS - elapsed);
    setTimeout(closeIntro, waitMore);
  };

  if (sessionStorage.getItem(INTRO_SEEN_KEY)) {
    if (intro) {
      intro.classList.add("hidden");
      intro.style.display = "none";
    }
  } else if (intro && introLogo) {
    const finalizeLogo = () => {
      intro.classList.add("logo-ready");
      closeWhenReady();
    };

    const failSafe = setTimeout(() => {
      intro.classList.add("logo-ready");
      closeIntro();
    }, INTRO_MAX_MS);

    const handleReady = () => {
      clearTimeout(failSafe);
      if (typeof introLogo.decode === "function") {
        introLogo.decode().then(finalizeLogo).catch(finalizeLogo);
      } else {
        finalizeLogo();
      }
    };

    if (introLogo.complete && introLogo.naturalWidth > 0) {
      handleReady();
    } else {
      introLogo.addEventListener("load", handleReady, { once: true });
      introLogo.addEventListener("error", () => {
        clearTimeout(failSafe);
        intro.classList.add("logo-ready");
        closeWhenReady();
      }, { once: true });
    }

    skipIntro?.addEventListener("click", closeIntro);
  }

  // Reveal on scroll
  const revealEls = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  revealEls.forEach((el) => observer.observe(el));

  // Cursor glow
  const glow = document.getElementById("cursorGlow");
  window.addEventListener("pointermove", (e) => {
    if (!glow) return;
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  }, { passive: true });

  // Tilt effect
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

  // Form validation
  const form = document.getElementById("inquiryForm");
  if (form) {
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
  }

  // Chatbot (MVP UI)
  const chatbot = document.getElementById("chatbot");
  const chatToggle = document.getElementById("chatToggle");
  const chatClose = document.getElementById("chatClose");
  const chatPanel = document.getElementById("chatPanel");

  const openChat = () => {
    if (!chatbot || !chatToggle || !chatPanel) return;
    chatbot.classList.add("open");
    chatToggle.setAttribute("aria-expanded", "true");
    chatPanel.setAttribute("aria-hidden", "false");
  };

  const closeChat = () => {
    if (!chatbot || !chatToggle || !chatPanel) return;
    chatbot.classList.remove("open");
    chatToggle.setAttribute("aria-expanded", "false");
    chatPanel.setAttribute("aria-hidden", "true");
  };

  chatToggle?.addEventListener("click", () => {
    if (chatbot?.classList.contains("open")) closeChat();
    else openChat();
  });

  chatClose?.addEventListener("click", closeChat);

  // Back to top
  const backToTopBtn = document.getElementById("backToTop");

  const updateBackToTopVisibility = () => {
    if (!backToTopBtn) return;
    if (window.scrollY > 420) backToTopBtn.classList.add("show");
    else backToTopBtn.classList.remove("show");
  };

  window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
  updateBackToTopVisibility();

  backToTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
