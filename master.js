/* ==========================
   FitStance Master JS
   Works across all pages
   ========================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------
     1. Mobile Navigation Toggle
  ------------------------------ */
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-links");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      menuToggle.classList.toggle("open"); // animate hamburger
    });
  }

  /* ------------------------------
     2. Smooth Scrolling
  ------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }

      // Close mobile nav after clicking link
      if (navMenu && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
        menuToggle.classList.remove("open");
      }
    });
  });

  /* ------------------------------
     3. Accordion (Workouts / FAQs)
  ------------------------------ */
  const buttons = document.querySelectorAll(".goal-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const plan = btn.nextElementSibling;
      if (plan) {
        plan.classList.toggle("hidden");
        btn.classList.toggle("active"); // highlight active button
      }
    });
  });

  /* ------------------------------
     4. Back to Top Button
  ------------------------------ */
  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTop.classList.add("show");
        backToTop.style.display = "flex"; // ensure visible
      } else {
        backToTop.classList.remove("show");
        backToTop.style.display = "none"; // hide when top
      }
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ------------------------------
     5. Fade-in Animations
  ------------------------------ */
  const faders = document.querySelectorAll(".fade-in");
  const appearOptions = { threshold: 0.3, rootMargin: "0px 0px -50px 0px" };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("appear");
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });

  /* ------------------------------
     6. Tools Page - Fitness Calculator
  ------------------------------ */
  const fitnessForm = document.getElementById("fitness-form");

  if (fitnessForm) {
    fitnessForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const form = e.target;

      const age = parseInt(form.age.value);
      const gender = form.gender.value;
      const height = parseFloat(form.height.value); // in cm
      const weight = parseFloat(form.weight.value); // in kg
      const activity = parseFloat(form.activity.value);
      const goal = form.goal.value;

      if (!age || !gender || !height || !weight || !activity || !goal) {
        alert("⚠️ Please fill in all fields.");
        return;
      }

      // BMR Calculation (Mifflin-St Jeor)
      let bmr;
      if (gender === "male") {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }

      // TDEE
      const tdee = bmr * activity;

      // Adjust calories based on goal
      let calories = tdee;
      if (goal === "gain") calories += 300;
      if (goal === "lose") calories -= 300;

      // BMI
      const heightM = height / 100;
      const bmi = weight / (heightM * heightM);
      let bmiCategory = "";
      if (bmi < 18.5) bmiCategory = "Underweight";
      else if (bmi < 24.9) bmiCategory = "Normal weight";
      else if (bmi < 29.9) bmiCategory = "Overweight";
      else bmiCategory = "Obese";

      // Water intake in liters/day (40 ml per kg)
      const water = (weight * 40) / 1000;

      // Macronutrients
      // Protein: 1.7g per kg body weight (instead of per lbs)
      const protein = Math.round(weight * 1.7);

      // Remaining calories for carbs & fats after protein
      const proteinCalories = protein * 4;
      const remainingCalories = calories - proteinCalories;

      // 60% carbs, 40% fats
      const carbs = Math.round((remainingCalories * 0.6) / 4);
      const fats = Math.round((remainingCalories * 0.4) / 9);

      // Display results with smooth highlight
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

      // Scroll to results smoothly
      const results = document.querySelector(".results");
      if (results) {
        results.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
});
