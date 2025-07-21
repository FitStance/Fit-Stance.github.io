document.getElementById("fitness-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const age = parseInt(this.age.value);
  const gender = this.gender.value;
  const height = parseFloat(this.height.value);
  const weight = parseFloat(this.weight.value);
  const activity = parseFloat(this.activity.value);
  const goal = this.goal.value;

  // BMR Calculation
  let bmr;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // TDEE Calculation
  const tdee = bmr * activity;

  // Goal Adjustment
  let calories = tdee;
  if (goal === "gain") calories += 300;
  if (goal === "lose") calories -= 300;

  // BMI Calculation
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  let bmiCategory = "";
  if (bmi < 18.5) bmiCategory = "Underweight";
  else if (bmi < 24.9) bmiCategory = "Normal weight";
  else if (bmi < 29.9) bmiCategory = "Overweight";
  else bmiCategory = "Obese";

  // Water Intake (in liters)
  const water = (weight * 35) / 1000;

  // Macronutrient Distribution (in grams)
  const protein = Math.round((calories * 0.3) / 4);
  const carbs = Math.round((calories * 0.5) / 4);
  const fats = Math.round((calories * 0.2) / 9);

  // Output
  document.getElementById("bmr").textContent = Math.round(bmr);
  document.getElementById("bmi").textContent = bmi.toFixed(1);
  document.getElementById("bmi-category").textContent = bmiCategory;
  document.getElementById("tdee").textContent = Math.round(tdee);
  document.getElementById("water").textContent = water.toFixed(2);
  document.getElementById("protein").textContent = protein;
  document.getElementById("carbs").textContent = carbs;
  document.getElementById("fats").textContent = fats;
});
