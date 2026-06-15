// ===============================
// 🧠 SMART RESULT MEMORY FEATURE
// ===============================

let LAST_RESULT = 0;
var currentExpression = "";

// ===============================
// 🧠 BRAIN SCORE TRACKER
// ===============================
let BRAIN_SCORE = 0;
let CALC_COUNT = 0;
const BRAIN_LEVELS = [
  { min: 0, label: "Novice", emoji: "🌱" },
  { min: 50, label: "Learner", emoji: "📖" },
  { min: 150, label: "Thinker", emoji: "🤔" },
  { min: 350, label: "Scholar", emoji: "🎓" },
  { min: 700, label: "Genius", emoji: "🧠" },
  { min: 1200, label: "Mastermind", emoji: "💎" },
];

function calculateBrainScore(expression) {
  let points = 10;
  if (expression.includes("(")) points += 15;
  if (expression.includes("**")) points += 20;
  if (expression.includes("*") || expression.includes("/")) points += 10;
  if (expression.includes("%")) points += 12;
  var ops = (expression.match(/[+\-*/]/g) || []).length;
  points += ops * 5;
  var digits = (expression.match(/[0-9]/g) || []).length;
  points += Math.floor(digits / 3) * 5;
  return points;
}

function getBrainLevel(score) {
  var level = BRAIN_LEVELS[0];
  for (var i = 0; i < BRAIN_LEVELS.length; i++) {
    if (score >= BRAIN_LEVELS[i].min) level = BRAIN_LEVELS[i];
  }
  return level;
}

function getNextLevel(score) {
  for (var i = 0; i < BRAIN_LEVELS.length; i++) {
    if (score < BRAIN_LEVELS[i].min) return BRAIN_LEVELS[i];
  }
  return null;
}

function updateBrainScoreUI() {
  var el = document.getElementById("brain-score-display");
  if (!el) return;
  var level = getBrainLevel(BRAIN_SCORE);
  var next = getNextLevel(BRAIN_SCORE);
  var progress = 100;
  if (next) {
    var range = next.min - level.min;
    var current = BRAIN_SCORE - level.min;
    progress = Math.min(100, Math.floor((current / range) * 100));
  }
  el.innerHTML =
    "<div class=\"brain-level\">" + level.emoji + " " + level.label + "</div>" +
    "<div class=\"brain-score-val\">Score: " + BRAIN_SCORE + "</div>" +
    "<div class=\"brain-progress\"><div class=\"brain-progress-fill\" style=\"width:" + progress + "%\"></div></div>" +
    "<div class=\"brain-calc-count\">Calculations: " + CALC_COUNT + "</div>";
}

// ------------------------------
// Theme Toggle Logic
// ------------------------------
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    btn.innerHTML = "☀️";
    btn.title = "Switch to light mode";
    localStorage.setItem("theme", "dark");
  } else {
    btn.innerHTML = "🌙";
    btn.title = "Switch to dark mode";
    localStorage.setItem("theme", "light");
  }
}

// Set theme on page load from localStorage
window.addEventListener("DOMContentLoaded", function () {
  const theme = localStorage.getItem("theme");
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  if (btn) {
    if (theme === "dark") {
      body.classList.add("dark-mode");
      btn.innerHTML = "☀️";
      btn.title = "Switch to light mode";
    } else {
      btn.innerHTML = "🌙";
      btn.title = "Switch to dark mode";
    }
  }
});

// ------------------------------
// Calculator State
// ------------------------------
let left = "";
let operator = "";
let right = "";
let steps = [];
const MAX_STEPS = 6;

// ------------------------------
// Basic Calculator Functions
// ------------------------------
function appendToResult(value) {
  currentExpression += value.toString();
  updateResult();
}

function bracketToResult(value) {
  currentExpression += value;
  updateResult();
}

function backspace() {
  currentExpression = currentExpression.slice(0, -1);
  updateResult();
}

function operatorToResult(value) {
  if (value === "^") {
    currentExpression += "**";
  } else {
    currentExpression += value;
  }
  updateResult();
}

function clearResult() {
  currentExpression = "";
  updateResult();
}


function normalizeExpression(expr) {
  return expr
    .replace(/asin\(/g, "asinDeg(")
    .replace(/acos\(/g, "acosDeg(")
    .replace(/atan\(/g, "atanDeg(")
    .replace(/sin\(/g, "sinDeg(")
    .replace(/cos\(/g, "cosDeg(")
    .replace(/tan\(/g, "tanDeg(")
    .replace(/asinh\(/g, "asinh(")
    .replace(/sinh\(/g, "sinh(")
    .replace(/\be\b/g, "Math.E")
    .replace(/\bpi\b/g, "Math.PI");
}

function percentToResult() {
  if (!currentExpression) return;

  const match = currentExpression.match(/(.+?)(\*\*|[+\-*/^])([0-9.]*)$/);

  if (!match) {
    const num = parseFloat(currentExpression);
    if (isNaN(num)) return;

    currentExpression = (num / 100).toString();
  } else {
    const leftPart = match[1];
    const rightPart = match[3];

    if (!rightPart) return;

    let leftVal;

    try {
      leftVal = eval(leftPart);
    } catch (e) {
      leftVal = parseFloat(leftPart);
    }

    const rightVal = parseFloat(rightPart);
    if (isNaN(leftVal) || isNaN(rightVal)) return;

    const percentVal = (leftVal * rightVal) / 100;

    currentExpression = percentVal.toString();
  }

  // 🔥 ADD THIS LINE
  currentExpression += "*";

  updateResult();
}

// ------------------------------
// Calculate Result
// ------------------------------
function calculateExpression(expression) {
  try {
   
    let normalizedExpression = normalizeExpression(expression);

    // 🧠 Replace "ans" with last result automatically
    normalizedExpression = normalizedExpression.replace(
      /\bans\b/gi,
      LAST_RESULT,
    );

    // Calculate result
    let result = eval(normalizedExpression);
    console.log("Calculated result for expression:", expression, "->", result);
 
    if (isNaN(result) || !isFinite(result)) {
      throw new Error();
    }

    return result;
  } catch (e) {
    return "Error";
  }
}
function calculateResult() {
  if (!currentExpression) return;
    const display = document.getElementById("result"); 
    // Calculate result
    let result = calculateExpression(currentExpression);
    result = String(result);

    // Save result for future expressions
    LAST_RESULT = result;

    // Update Brain Score
    var points = calculateBrainScore(currentExpression);
    BRAIN_SCORE += points;
    CALC_COUNT += 1;
    updateBrainScoreUI();

    // Display normally
    display.value = result;

    currentExpression = result;
    updateResult();
}


function updateResult() {
  document.getElementById("result").value = currentExpression || "0";
}
