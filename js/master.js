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

  fetch("../footer.html")
    .then(res => res.ok ? res.text() : Promise.reject("Footer not found"))
    .then(html => (footerContainer.innerHTML = html))
    .catch(err => console.warn("⚠ Footer load skipped:", err));

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

      if (navMenu && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
        menuToggle?.classList.remove("open");
      }
    });
  });

  /* ------------------------------
     3. Workout Goals & Plans Collapsible
  ------------------------------ */
  const goalCards = document.querySelectorAll(".goal-card");
  const sublevels = document.querySelectorAll(".sublevels");
  const workoutPlans = document.querySelectorAll(".workout-plan");

  window.toggleSublevels = id => {
    sublevels.forEach(sub => {
      if (sub.id === `${id}-sub`) {
        sub.classList.toggle("show");
      } else {
        sub.classList.remove("show");
      }
    });

    workoutPlans.forEach(plan => plan.classList.remove("show"));
  };

  window.showPlan = id => {
    workoutPlans.forEach(plan => {
      if (plan.id === id) {
        plan.classList.add("show");
      } else {
        plan.classList.remove("show");
      }
    });
  };

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
      const activity = parseFloat(form.activity.value);
      const goal = form.goal.value;

      // Height handling (cm OR ft+in)
      let height = 0;
      if (form.heightCm.value) {
        height = parseFloat(form.heightCm.value);
      } else if (form.heightFt.value || form.heightIn.value) {
        const feet = parseFloat(form.heightFt.value) || 0;
        const inches = parseFloat(form.heightIn.value) || 0;
        height = (feet * 30.48) + (inches * 2.54);
      }

      // Weight handling (kg OR lbs)
      let weight = 0;
      if (form.weightKg.value) {
        weight = parseFloat(form.weightKg.value);
      } else if (form.weightLbs.value) {
        weight = parseFloat(form.weightLbs.value) * 0.453592;
      }

      if ([age, height, weight, activity].some(v => isNaN(v)) || !gender || !goal) {
        alert("⚠ Please fill in all fields correctly.");
        return;
      }

      // Core calculations
      const bmr =
        gender === "male"
          ? 10 * weight + 6.25 * height - 5 * age + 5
          : 10 * weight + 6.25 * height - 5 * age - 161;

      const tdee = bmr * activity;

      let calories = tdee;
      if (goal === "gain") calories += 300;
      if (goal === "lose") calories -= 300;

      const bmi = weight / Math.pow(height / 100, 2);
      const bmiCategory =
        bmi < 18.5
          ? "Underweight"
          : bmi < 25
          ? "Normal weight"
          : bmi < 30
          ? "Overweight"
          : "Obese";

      const water = (weight * 40) / 1000;

      const protein = Math.round(weight * 1.7);
      const proteinCalories = protein * 4;
      const remainingCalories = calories - proteinCalories;
      const carbs = Math.round((remainingCalories * 0.6) / 4);
      const fats = Math.round((remainingCalories * 0.4) / 9);

      // Conversion back for display
      const weightLbs = (weight / 0.453592).toFixed(1);
      const heightFt = Math.floor(height / 30.48);
      const heightIn = Math.round((height - heightFt * 30.48) / 2.54);

      const updateResult = (id, value, color = null) => {
        const el = document.getElementById(id);
        if (el) {
          el.textContent = value;
          if (color) el.style.color = color;
          el.classList.add("highlight");
          setTimeout(() => el.classList.remove("highlight"), 800);
        }
      };

      // Update Results
      updateResult("weight-display", `${weight.toFixed(1)} kg (${weightLbs} lbs)`);
      updateResult("height-display", `${Math.round(height)} cm (${heightFt} ft ${heightIn} in)`);
      updateResult("bmr", Math.round(bmr));
      updateResult("bmi", bmi.toFixed(1));

      // BMI category with color
      let bmiColor = "red";
      if (bmi < 18.5) bmiColor = "orange";
      else if (bmi < 25) bmiColor = "green";
      else if (bmi < 30) bmiColor = "orange";
      else bmiColor = "red";
      updateResult("bmi-category", bmiCategory, bmiColor);

      updateResult("tdee", Math.round(tdee));
      updateResult("water", water.toFixed(2));
      updateResult("protein", protein);
      updateResult("carbs", carbs);
      updateResult("fats", fats);

      document.querySelector(".results")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ------------------------------
     7. Responsive Media Auto-Scaling
  ------------------------------ */
  const mediaElements = document.querySelectorAll(".media-container img, .media-container video");
  mediaElements.forEach(media => {
    media.style.width = "100%";
    media.style.height = "auto";
  });
});
