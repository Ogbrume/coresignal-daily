const startBtn = document.getElementById("start-btn");
const gameArea = document.getElementById("game-area");
const result = document.getElementById("result");
const message = document.getElementById("daily-message");

// Generate a consistent puzzle based on today’s date
function getDailySeed() {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
}

function startGame() {
  gameArea.innerHTML = "";
  result.textContent = "";

  // Alternate between games based on the day
  const seed = new Date().getDate();
  if (seed % 2 === 0) {
    memoryNumberGame(); // existing game
  } else {
    patternMatchGame(); // new game
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

  for (let i = 0; i < gridSize; i++) {
    const btn = document.createElement("button");
    btn.textContent = (i === differentIndex) ? wrongIcon : chosenIcon;
    btn.style.fontSize = "2rem";
    btn.onclick = () => {
      if (i === differentIndex) {
        result.textContent = "✅ Correct! You found the odd one.";
      } else {
        result.textContent = "❌ Nope! Try again tomorrow.";
      }
    };
    grid.appendChild(btn);
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
  startGame();
});

message.textContent = `Welcome! This is your challenge for ${new Date().toDateString()}.`;

