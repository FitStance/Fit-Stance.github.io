/* ==========================
   FitStance Master JS
   Works across all pages
   ========================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ------------------------------
     0. Load Global Footer Dynamically
  ------------------------------ */
  const footerContainer = document.createElement("div");
  footerContainer.id = "footer-container";
  document.body.appendChild(footerContainer);

  fetch("./includes/footer.html") // correct relative path
    .then(res => res.ok ? res.text() : Promise.reject("Footer not found"))
    .then(html => (footerContainer.innerHTML = html))
    .catch(err => console.warn("⚠️ Footer load skipped:", err));

  /* ------------------------------
     1. Mobile Navigation Toggle
  ------------------------------ */
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-links");

  if (menuToggle && navMenu) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      navMenu.classList.toggle("active");
      menuToggle.classList.toggle("open");
    });
  }

  /* ------------------------------
     2. Smooth Scrolling
  ------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      // Close mobile nav after clicking link
      if (navMenu && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
        menuToggle?.classList.remove("open");
      }
    });
  });

  /* ------------------------------
     3. Accordion (Workouts / FAQs)
  ------------------------------ */
  const accordions = document.querySelectorAll(".accordion-header");

  accordions.forEach(header => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling;

      // close others
      accordions.forEach(h => {
        if (h !== header) {
          h.classList.remove("active");
          h.nextElementSibling?.classList.remove("open");
        }
      });

      // toggle clicked
      header.classList.toggle("active");
      content?.classList.toggle("open");
    });
  });

  /* ------------------------------
     4. Back to Top Button
  ------------------------------ */
  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("show", window.scrollY > 300);
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ------------------------------
     5. Fade-in Animations
  ------------------------------ */
  const faders = document.querySelectorAll(".fade-in");

  if ("IntersectionObserver" in window) {
    const appearOnScroll = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("appear");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -50px 0px" }
    );

    faders.forEach(fader => appearOnScroll.observe(fader));
  } else {
    // fallback
    faders.forEach(f => f.classList.add("appear"));
  }

  /* ------------------------------
     6. Tools Page - Fitness Calculator
  ------------------------------ */
  const fitnessForm = document.getElementById("fitness-form");

  if (fitnessForm) {
    fitnessForm.addEventListener("submit", e => {
      e.preventDefault();
      const form = e.target;

      const age = parseInt(form.age.value);
      const gender = form.gender.value;
      const height = parseFloat(form.height.value); // cm
      const weight = parseFloat(form.weight.value); // kg
      const activity = parseFloat(form.activity.value);
      const goal = form.goal.value;

      if (
        [age, height, weight, activity].some(v => isNaN(v)) ||
        !gender ||
        !goal
      ) {
        alert("⚠️ Please fill in all fields correctly.");
        return;
      }

      // BMR (Mifflin-St Jeor)
      const bmr =
        gender === "male"
          ? 10 * weight + 6.25 * height - 5 * age + 5
          : 10 * weight + 6.25 * height - 5 * age - 161;

      // TDEE
      const tdee = bmr * activity;

      // Goal adjustment
      let calories = tdee;
      if (goal === "gain") calories += 300;
      if (goal === "lose") calories -= 300;

      // BMI
      const bmi = weight / Math.pow(height / 100, 2);
      const bmiCategory =
        bmi < 18.5
          ? "Underweight"
          : bmi < 25
          ? "Normal weight"
          : bmi < 30
          ? "Overweight"
          : "Obese";

      // Water (40ml/kg)
      const water = (weight * 40) / 1000;

      // Macronutrients
      const protein = Math.round(weight * 1.7);
      const proteinCalories = protein * 4;
      const remainingCalories = calories - proteinCalories;
      const carbs = Math.round((remainingCalories * 0.6) / 4);
      const fats = Math.round((remainingCalories * 0.4) / 9);

      const updateResult = (id, value) => {
        const el = document.getElementById(id);
        if (el) {
          el.textContent = value;
          el.classList.add("highlight");
          setTimeout(() => el.classList.remove("highlight"), 800);
        }
      };

      updateResult("bmr", Math.round(bmr));
      updateResult("bmi", bmi.toFixed(1));
      updateResult("bmi-category", bmiCategory);
      updateResult("tdee", Math.round(tdee));
      updateResult("water", water.toFixed(2));
      updateResult("protein", protein);
      updateResult("carbs", carbs);
      updateResult("fats", fats);

      document.querySelector(".results")?.scrollIntoView({ behavior: "smooth" });
    });
  }
});
