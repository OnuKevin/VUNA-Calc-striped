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

// ===============================
// Matrix Panel Toggle
// ===============================

function toggleMatrixPanel() {
  const panel = document.getElementById("matrix-panel");
  if (panel) {
    const shown = panel.style.display !== "none";
    panel.style.display = shown ? "none" : "block";
    if (!shown) {
      renderMatrixA();
      renderMatrixB();
    }
  }
}

// ===============================
// Matrix Operations
// ===============================

function createMatrix(rows, cols, fill) {
  const arr = [];
  for (let i = 0; i < rows; i++) {
    arr[i] = [];
    for (let j = 0; j < cols; j++) {
      arr[i][j] = typeof fill === "number" ? fill : 0;
    }
  }
  return arr;
}

function cloneMatrix(M) {
  return M.map(row => [...row]);
}

function matrixAdd(A, B) {
  const rows = A.length, cols = A[0].length;
  const res = createMatrix(rows, cols);
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++)
      res[i][j] = A[i][j] + B[i][j];
  return res;
}

function matrixSubtract(A, B) {
  const rows = A.length, cols = A[0].length;
  const res = createMatrix(rows, cols);
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++)
      res[i][j] = A[i][j] - B[i][j];
  return res;
}

function matrixMultiply(A, B) {
  const rows = A.length, cols = B[0].length, inner = A[0].length;
  const res = createMatrix(rows, cols);
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++) {
      let sum = 0;
      for (let k = 0; k < inner; k++) sum += A[i][k] * B[k][j];
      res[i][j] = sum;
    }
  return res;
}

function matrixScale(A, s) {
  const rows = A.length, cols = A[0].length;
  const res = createMatrix(rows, cols);
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++)
      res[i][j] = A[i][j] * s;
  return res;
}

function matrixDeterminant(M) {
  const n = M.length;
  if (n === 1) return M[0][0];
  if (n === 2) return M[0][0] * M[1][1] - M[0][1] * M[1][0];
  let det = 0;
  for (let j = 0; j < n; j++) {
    const sub = M.slice(1).map(row => row.filter((_, idx) => idx !== j));
    det += (j % 2 === 0 ? 1 : -1) * M[0][j] * matrixDeterminant(sub);
  }
  return det;
}

function matrixTranspose(M) {
  const rows = M.length, cols = M[0].length;
  const res = createMatrix(cols, rows);
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++)
      res[i][j] = M[j][i];
  return res;
}

function matrixInverse(M) {
  const n = M.length;
  const det = matrixDeterminant(M);
  if (Math.abs(det) < 1e-12) return null;
  if (n === 1) return [[1 / M[0][0]]];
  if (n === 2) {
    const inv = createMatrix(2, 2);
    inv[0][0] = M[1][1] / det;
    inv[0][1] = -M[0][1] / det;
    inv[1][0] = -M[1][0] / det;
    inv[1][1] = M[0][0] / det;
    return inv;
  }
  const inv = createMatrix(n, n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const sub = M.filter((_, ri) => ri !== i).map(row => row.filter((_, ci) => ci !== j));
      const cof = ((i + j) % 2 === 0 ? 1 : -1) * matrixDeterminant(sub);
      inv[j][i] = cof / det;
    }
  }
  return inv;
}

function matrixToString(M) {
  if (!M) return "";
  return M.map(row => "[" + row.map(v => +v.toFixed(6)).join(", ") + "]").join("\n");
}

function matrixHTML(M) {
  if (!M) return "<span class=\"text-muted\">—</span>";
  let html = "<table class=\"matrix-table\">";
  for (let i = 0; i < M.length; i++) {
    html += "<tr>";
    for (let j = 0; j < M[i].length; j++) {
      html += "<td>" + (+M[i][j].toFixed(6)) + "</td>";
    }
    html += "</tr>";
  }
  return html + "</table>";
}

function readMatrixValues(prefix) {
  const rows = parseInt(document.getElementById(prefix + "-rows").value, 10);
  const cols = parseInt(document.getElementById(prefix + "-cols").value, 10);
  const data = createMatrix(rows, cols);
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++) {
      const el = document.getElementById(prefix + "-" + i + "-" + j);
      data[i][j] = parseFloat(el.value) || 0;
    }
  return data;
}

function buildMatrixInputs(prefix, containerId) {
  const container = document.getElementById(containerId);
  const rows = parseInt(document.getElementById(prefix + "-rows").value, 10);
  const cols = parseInt(document.getElementById(prefix + "-cols").value, 10);
  let html = "<table class=\"matrix-input-table\">";
  for (let i = 0; i < rows; i++) {
    html += "<tr>";
    for (let j = 0; j < cols; j++) {
      html += "<td><input type=\"number\" step=\"any\" class=\"form-control form-control-sm matrix-cell\" id=\"" + prefix + "-" + i + "-" + j + "\" value=\"0\"></td>";
    }
    html += "</tr>";
  }
  html += "</table>";
  container.innerHTML = html;
}

function resizeMatrix(prefix) {
  const callbacks = { A: renderMatrixA, B: renderMatrixB };
  callbacks[prefix] && callbacks[prefix]();
}

function renderMatrixA() {
  buildMatrixInputs("A", "matrix-a-inputs");
}

function renderMatrixB() {
  buildMatrixInputs("B", "matrix-b-inputs");
}

function renderMatrixResult(M) {
  const el = document.getElementById("matrix-result-display");
  if (!el) return;
  if (M === null || M === undefined) {
    el.innerHTML = "<span class=\"text-danger\">Not invertible (det = 0)</span>";
    return;
  }
  el.innerHTML = matrixHTML(M);
}

function matrixOperation(op) {
  const A = readMatrixValues("A");
  const B = readMatrixValues("B");
  let result = null;
  try {
    switch (op) {
      case "add": result = matrixAdd(A, B); break;
      case "sub": result = matrixSubtract(A, B); break;
      case "mul": result = matrixMultiply(A, B); break;
      case "detA": result = [[matrixDeterminant(A)]]; break;
      case "detB": result = [[matrixDeterminant(B)]]; break;
      case "trA": result = matrixTranspose(A); break;
      case "trB": result = matrixTranspose(B); break;
      case "invA": result = matrixInverse(A); break;
      case "invB": result = matrixInverse(B); break;
    }
  } catch (e) {
    result = null;
  }
  renderMatrixResult(result);
}
