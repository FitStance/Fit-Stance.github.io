/* ==========================
   FitStance Master JS
   Works across all pages
   Merged + Fixed (adds workout goals functions back)
   ========================== */

document.addEventListener("DOMContentLoaded", () => {


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
     2. Smooth Scrolling for Anchors
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
     3. Accordion Toggle (Workouts / FAQs)
  ------------------------------ */
  const accordionHeaders = document.querySelectorAll(".accordion-header");
  accordionHeaders.forEach(header => {
    header.addEventListener("click", () => {
      const item = header.parentElement;

      accordionHeaders.forEach(h => {
        if (h !== header && h.parentElement) h.parentElement.classList.remove("active");
      });

      if (item) item.classList.toggle("active");
    });
  });

  
  const sublevels = document.querySelectorAll(".sublevels");
  const workoutPlans = document.querySelectorAll(".workout-plan");

  // Toggle a specific sublevel by logical id. Example: toggleSublevels('beginner')
  // The corresponding container should have id="beginner-sub" (note the -sub suffix).
  window.toggleSublevels = (id) => {
    if (!id) return;
    const targetId = String(id) + "-sub";

    sublevels.forEach(sub => {
      if (sub.id === targetId) {
        sub.classList.toggle("show");
      } else {
        sub.classList.remove("show");
      }
    });

    // When opening sublevels collapse any shown workout plans
    workoutPlans.forEach(plan => plan.classList.remove("show"));
  };

  // Show a specific workout plan and hide others. Example: showPlan('plan-1')
  window.showPlan = (id) => {
    if (!id) return;
    const target = String(id);
    workoutPlans.forEach(plan => {
      if (plan.id === target) {
        plan.classList.add("show");
        // optionally focus/scroll the plan into view
        plan.scrollIntoView({ behavior: "smooth", block: "center" });
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
     - Supports height input as Feet + Inches (newer pages) or single cm input.
  ------------------------------ */
  const fitnessForm = document.getElementById("fitness-form");
  const resultsBox = document.querySelector(".results");

  if (fitnessForm && resultsBox) {
    fitnessForm.addEventListener("submit", e => {
      e.preventDefault();
      const form = e.target;

      // Inputs
      const age = parseInt(form.age?.value);
      const gender = form.gender?.value;
      const activity = parseFloat(form.activity?.value);
      const goal = form.goal?.value;

      // Support both weightKg and weight inputs
      const weight = parseFloat(form.weightKg?.value || form.weight?.value);

      // Height: prefer feet+inches fields if present, otherwise use cm field
      const feet = parseFloat(form.heightFt?.value) || 0;
      const inches = parseFloat(form.heightIn?.value) || 0;
      let height = 0;
      if (feet || inches) {
        height = (feet * 30.48) + (inches * 2.54);
      } else if (form.heightCm) {
        height = parseFloat(form.heightCm.value);
      }

      // Validation
      if (
        [age, height, weight, activity].some(v => isNaN(v)) ||
        !gender ||
        !goal
      ) {
        alert("⚠ Please fill in all fields correctly.");
        return;
      }

      // BMR (Mifflin-St Jeor)
      const bmr =
        gender === "male"
          ? 10 * weight + 6.25 * height - 5 * age + 5
          : 10 * weight + 6.25 * height - 5 * age - 161;

      // TDEE
      const tdee = bmr * activity;

      // Calories based on goal
      let calories = tdee;
      if (goal === "gain") calories += 300;
      if (goal === "lose") calories -= 300;

      // BMI
      const bmi = weight / Math.pow(height / 100, 2);
      let bmiCategory = "";
      let bmiClass = "";

      if (bmi < 18.5) {
        bmiCategory = "Underweight";
        bmiClass = "bmi-warning";
      } else if (bmi < 25) {
        bmiCategory = "Normal weight";
        bmiClass = "bmi-normal";
      } else if (bmi < 30) {
        bmiCategory = "Overweight";
        bmiClass = "bmi-warning";
      } else {
        bmiCategory = "Obese";
        bmiClass = "bmi-danger";
      }

      // Water Intake (40 ml per kg)
      const water = (weight * 40) / 1000;

      // Macronutrients
      const protein = Math.round(weight * 1.7);
      const proteinCalories = protein * 4;
      const remainingCalories = calories - proteinCalories;
      const carbs = Math.round((remainingCalories * 0.6) / 4);
      const fats = Math.round((remainingCalories * 0.4) / 9);

      // Update results dynamically
      const updateResult = (id, value, cssClass = null) => {
        const el = document.getElementById(id);
        if (el) {
          el.textContent = value;
          el.className = ""; // reset old class
          if (cssClass) el.classList.add(cssClass);
          el.classList.add("highlight");
          setTimeout(() => el.classList.remove("highlight"), 800);
        }
      };

      updateResult("bmr", Math.round(bmr));
      updateResult("bmi", bmi.toFixed(1));
      updateResult("bmi-category", bmiCategory, bmiClass);
      updateResult("tdee", Math.round(tdee));
      updateResult("water", water.toFixed(2));
      updateResult("protein", protein);
      updateResult("carbs", carbs);
      updateResult("fats", fats);

      // Show results with animation
      resultsBox.classList.add("show");
      resultsBox.scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ------------------------------
     7. Responsive Media Auto-Scaling
  ------------------------------ */
  const mediaElements = document.querySelectorAll(
    ".media-container img, .media-container video"
  );
  mediaElements.forEach(media => {
    media.style.width = "100%";
    media.style.height = "auto";
  });
});
