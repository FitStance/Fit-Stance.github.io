document.getElementById("fitness-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;

  const age = parseInt(form.age.value);
  const gender = form.gender.value;
  const height = parseFloat(form.height.value); // in cm
  const weight = parseFloat(form.weight.value); // in kg
  const activity = parseFloat(form.activity.value);
  const goal = form.goal.value;

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

  // Water intake in liters/day (35 ml per kg)
  const water = (weight * 35) / 1000;

  // Macronutrients
  //  Protein: 1 gram per pound of body weight
  const weightLbs = weight * 2.20462;
  const protein = Math.round(weightLbs);

  //  Remaining calories for carbs & fats after protein
  const proteinCalories = protein * 4;
  const remainingCalories = calories - proteinCalories;

  //  60% carbs, 40% fats (or adjust as needed)
  const carbs = Math.round((remainingCalories * 0.6) / 4);
  const fats = Math.round((remainingCalories * 0.4) / 9);

  // Display results
  document.getElementById("bmr").textContent = Math.round(bmr);
  document.getElementById("bmi").textContent = bmi.toFixed(1);
  document.getElementById("bmi-category").textContent = bmiCategory;
  document.getElementById("tdee").textContent = Math.round(tdee);
  document.getElementById("water").textContent = water.toFixed(2);
  document.getElementById("protein").textContent = protein;
  document.getElementById("carbs").textContent = carbs;
  document.getElementById("fats").textContent = fats;
});
