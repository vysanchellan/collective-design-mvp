(() => {
  // Sticky header state
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Theme toggle with persistence
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const storedTheme = localStorage.getItem("cd_theme");

  if (storedTheme === "light" || storedTheme === "dark") {
    root.setAttribute("data-theme", storedTheme);
  }

  toggle?.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("cd_theme", next);
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
  const formStatus = document.getElementById("formStatus");
  const submitBtn = form.querySelector(".submit-btn");

  const validEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test((value || "").trim());

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

    if (!validEmail(emailInput.value)) {
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
      formStatus.textContent = "";
      formStatus.className = "form-status";
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    formStatus.textContent = "";
    formStatus.className = "form-status";

    if (!validate()) {
      formStatus.textContent = "Please fix the highlighted fields.";
      formStatus.classList.add("error");
      return;
    }

    const original = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      // MVP simulated submission
      await new Promise((resolve) => setTimeout(resolve, 900));
      form.reset();
      formStatus.textContent = "Inquiry sent successfully. We will contact you shortly.";
      formStatus.classList.add("success");
    } catch {
      formStatus.textContent = "Something went wrong. Please try again.";
      formStatus.classList.add("error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = original;
    }
  });
})();
