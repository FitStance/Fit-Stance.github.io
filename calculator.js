
function calculate() {
  const age = parseInt(document.getElementById("age").value);
  const gender = document.getElementById("gender").value;
  const height = parseFloat(document.getElementById("height").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const activity = document.getElementById("activity").value;
  const goal = document.getElementById("goal").value;

  if (!age || !height || !weight || !gender || !activity || !goal) {
    alert("Please fill all fields.");
    return;
  }

  // BMR Calculation (Mifflin-St Jeor)
  let bmr = gender === "male"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;

  // BMI Calculation
  const heightMeters = height / 100;
  const bmi = weight / (heightMeters * heightMeters);
  let category = "";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal";
  else if (bmi < 30) category = "Overweight";
  else category = "Obese";

  // Activity Multiplier for TDEE
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
  };
  const tdee = bmr * activityMultipliers[activity];

  // Adjust TDEE based on Goal
  let goalCalories = tdee;
  if (goal === "gain") goalCalories += 300;
  else if (goal === "lose") goalCalories -= 300;

  // Macro Calculation (example split)
  const protein = weight * 2.2; // in grams
  const fat = weight * 0.9; // in grams
  const proteinCalories = protein * 4;
  const fatCalories = fat * 9;
  const carbs = (goalCalories - (proteinCalories + fatCalories)) / 4;

  // Water intake estimation
  const waterLiters = (weight * 0.033).toFixed(2);

  // Output results
  document.getElementById("bmrOutput").innerText = `${Math.round(bmr)} kcal/day`;
  document.getElementById("bmiOutput").innerText = `${bmi.toFixed(1)} (${category})`;
  document.getElementById("waterOutput").innerText = `${waterLiters} liters/day`;
  document.getElementById("tdeeOutput").innerText = `${Math.round(goalCalories)} kcal/day based on your goal`;
  document.getElementById("macroOutput").innerText = `
    Protein: ${Math.round(protein)}g | Carbs: ${Math.round(carbs)}g | Fat: ${Math.round(fat)}g
  `;
}
