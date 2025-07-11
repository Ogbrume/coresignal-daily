const startBtn = document.getElementById("start-btn");
const gameArea = document.getElementById("game-area");
const result = document.getElementById("result");
const message = document.getElementById("daily-message");
const companionText = document.getElementById("companion-text");

// Generate a consistent puzzle based on today’s date
function getDailySeed() {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
}

function startGame() {
  document.getElementById("game-instruction").style.display = "block";
  gameArea.innerHTML = "";
  result.textContent = "";
  startBtn.style.display = "none";
  const day = new Date().getDate();

  if (day % 3 === 0) {
    companionText.textContent = "🧠 Today’s Brain Focus: Mental Math & Reasoning — Helping you stay quick with everyday calculations and logic.";
    quickMathGame();
  } else if (day % 2 === 0) {
    companionText.textContent = "🧠 Today’s Brain Focus: Working Memory — Strengthening your ability to retain and recall information quickly.";
    memoryNumberGame();
  } else {
    companionText.textContent = "🧠 Today’s Brain Focus: Visual Attention — Training your ability to scan and spot subtle differences.";
    patternMatchGame();
  }
}

function memoryNumberGame() {
  const number = Math.floor(Math.random() * 1000);
  gameArea.innerHTML = `<p>Memorize this number:</p><h2>${number}</h2>`;
  
  setTimeout(() => {
    gameArea.innerHTML = `
      <p>What was the number?</p>
      <input id="guess" type="number" />
      <button onclick="checkAnswer(${number})">Submit</button>
    `;
  }, 3000);
}

function patternMatchGame() {
  const icons = ["🍎", "🍌", "🍒", "🍇", "🍉"];
  const chosenIcon = icons[Math.floor(Math.random() * icons.length)];
  let wrongIcon;
  do {
    wrongIcon = icons[Math.floor(Math.random() * icons.length)];
  } while (wrongIcon === chosenIcon);

  const gridSize = 9;
  const differentIndex = Math.floor(Math.random() * gridSize);

  gameArea.innerHTML = `<p>Find the one that’s different 👀</p><div id="grid" style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; justify-items:center;"></div>`;
  const grid = document.getElementById("grid");

  const startTime = Date.now();

  for (let i = 0; i < gridSize; i++) {
    const btn = document.createElement("button");
    btn.textContent = (i === differentIndex) ? wrongIcon : chosenIcon;
    btn.style.fontSize = "2rem";
    btn.onclick = () => {
  // Haptic on mobile
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }

  // Visual feedback on desktop
  btn.style.transition = "background 0.1s";
  btn.style.backgroundColor = "#b2fab4";
  setTimeout(() => {
    btn.style.backgroundColor = "#f0f0f0";
  }, 100);

  const elapsed = (Date.now() - startTime) / 1000;
  const rounded = elapsed.toFixed(2);

  if (i === differentIndex) {
    let message;
    if (elapsed < 2) {
      message = `⚡ Incredible! ${rounded}s`;
    } else if (elapsed < 5) {
      message = `✅ Good job! ${rounded}s`;
    } else {
      message = `🙂 You got it in ${rounded}s — try faster tomorrow!`;
    }

    result.textContent = message;
    trackBestTime(rounded);
  } else {
    result.textContent = "❌ Nope! That wasn’t it.";
  }
};
    grid.appendChild(btn);
  }
}

function trackBestTime(currentTime) {
  const today = new Date().toDateString();
  const bestKey = `patternBest-${today}`;

  const current = parseFloat(currentTime);
  const stored = localStorage.getItem(bestKey);

  if (!stored || current < parseFloat(stored)) {
    localStorage.setItem(bestKey, current);
    result.textContent += `\n🏆 New personal best!`;
  } else {
    result.textContent += `\nYour best today: ${stored}s`;
  }
}

function checkAnswer(correctNumber) {
  const guess = document.getElementById("guess").value;
  if (parseInt(guess) === correctNumber) {
    result.textContent = "✅ Great job! You remembered it.";
  } else {
    result.textContent = `❌ Oops! It was ${correctNumber}. Try again tomorrow.`;
  }
}

startBtn.addEventListener("click", () => {
  document.getElementById("game-instruction").style.display = "none";
  startGame();
});

document.getElementById("today-date").textContent = new Date().toDateString();

