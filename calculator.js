
document.getElementById("bmiForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value) / 100;
  const bmi = weight / (height * height);
  const result = document.getElementById("bmiResult");

  if (!isNaN(bmi)) {
    result.textContent = "Your BMI is " + bmi.toFixed(2);
  } else {
    result.textContent = "Please enter valid values.";
  }
});
