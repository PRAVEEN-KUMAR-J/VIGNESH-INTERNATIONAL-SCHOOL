document.addEventListener("click", (e) => {
  const link = e.target.closest("a[href^='#']");
  if (!link) return;

  const targetId = link.getAttribute("href").slice(1);
  if (!targetId) return;

  const target = document.getElementById(targetId);
  if (!target) return;

  e.preventDefault();
  const headerOffset = 90;
  const rect = target.getBoundingClientRect();
  const offsetTop = rect.top + window.pageYOffset - headerOffset;

  window.scrollTo({
    top: offsetTop,
    behavior: "smooth",
  });
});

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    navLinks.classList.toggle("open");
    navToggle.classList.toggle("active");
  });

  // Handle dropdowns on mobile
  const dropdownWrappers = document.querySelectorAll(".nav-dropdown-wrapper");
  dropdownWrappers.forEach(wrapper => {
    const trigger = wrapper.querySelector("a");
    trigger.addEventListener("click", (e) => {
      if (window.innerWidth <= 720) {
        e.preventDefault();
        e.stopPropagation();

        // Close other dropdowns
        dropdownWrappers.forEach(other => {
          if (other !== wrapper) other.classList.remove("active");
        });

        wrapper.classList.toggle("active");
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      navLinks.classList.remove("open");
      navToggle.classList.remove("active");
    }
  });

  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A" && !e.target.closest(".nav-dropdown-wrapper")) {
      navLinks.classList.remove("open");
      navToggle.classList.remove("active");
    }
  });
}

const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in-view"));
}

// Hero slider logic
const heroSlides = document.querySelectorAll(".hero-slide");
const prevBtn = document.getElementById("prevSlide");
const nextBtn = document.getElementById("nextSlide");

if (heroSlides.length > 1) {
  let currentSlide = 0;
  let slideInterval;

  const showSlide = (index) => {
    heroSlides[currentSlide].classList.remove("active");
    currentSlide = (index + heroSlides.length) % heroSlides.length;
    heroSlides[currentSlide].classList.add("active");
  };

  const nextSlide = () => showSlide(currentSlide + 1);
  const prevSlide = () => showSlide(currentSlide - 1);

  const startAutoPlay = () => {
    slideInterval = setInterval(nextSlide, 3000);
  };

  const resetAutoPlay = () => {
    clearInterval(slideInterval);
    startAutoPlay();
  };

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetAutoPlay();
    });
  }

  startAutoPlay();
}

// Animated counters for stats
const counterEls = document.querySelectorAll(".stat-number[data-count]");

function animateCounter(el) {
  const target = parseInt(el.getAttribute("data-count"), 10);
  const suffix = el.getAttribute("data-suffix") || "";
  const duration = 1600;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(progress * target);
    el.textContent = value.toLocaleString() + suffix;
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

if (counterEls.length) {
  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            animateCounter(el);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );

    counterEls.forEach((el) => counterObserver.observe(el));
  } else {
    counterEls.forEach((el) => animateCounter(el));
  }
}

