document.getElementById("fitness-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;

  const age = parseInt(form.age.value);
  const gender = form.gender.value;
  const height = parseFloat(form.height.value); // cm
  const weight = parseFloat(form.weight.value); // kg
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

  // Adjusted calories based on goal
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

  // Macros split by goal
  let proteinRatio, carbRatio, fatRatio;

  if (goal === "gain") {
    proteinRatio = 0.30;
    carbRatio = 0.50;
    fatRatio = 0.20;
  } else if (goal === "lose") {
    proteinRatio = 0.40;
    carbRatio = 0.35;
    fatRatio = 0.25;
  } else {
    proteinRatio = 0.30;
    carbRatio = 0.45;
    fatRatio = 0.25;
  }

  const protein = Math.round((calories * proteinRatio) / 4);
  const carbs = Math.round((calories * carbRatio) / 4);
  const fats = Math.round((calories * fatRatio) / 9);

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
