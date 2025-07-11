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

  // Simple memory test example (will be replaced by more fun types)
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

