const startBtn = document.getElementById("start-btn");
const gameArea = document.getElementById("game-area");
const result = document.getElementById("result");
const companionText = document.getElementById("companion-text");
console.log("📌 companionText element:", companionText);

const tips = [
  "🧘 Breathe deeply for 10 seconds before you begin — it primes your brain.",
  "📵 Remove distractions for 60 seconds — this is your focus moment.",
  "💡 Daily repetition strengthens your working memory — you’re doing it.",
  "🚶 A short walk before mental tasks improves performance. Try it tomorrow!",
  "📈 Aim to beat your own time, not perfection — small gains matter.",
  "🛌 Sleep fuels focus — did you rest well last night?",
  "🔁 Come back daily — mental sharpness compounds over time.",
  "🧩 Missed today? That’s okay. What matters is coming back tomorrow.",
];
function getDailyTip() {
  const seed = new Date().getDate();
  return tips[seed % tips.length];
}

// Generate a consistent puzzle based on today’s date
function getDailySeed() {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
}

function getTodayFocusMessage() {
  const day = new Date().getDate();
  if (day % 3 === 0) {
    return "🧠 Today’s Brain Focus: Mental Math & Reasoning — Helping you stay quick with everyday calculations and logic.";
  } else if (day % 2 === 0) {
    return "🧠 Today’s Brain Focus: Working Memory — Strengthening your ability to retain and recall information quickly.";
  } else {
    return "🧠 Today’s Brain Focus: Visual Attention — Training your ability to scan and spot subtle differences.";
  }
}



function startGame() {
  console.log("🚀 startGame() triggered");
  const gameInstruction = document.getElementById("game-instruction");
  const dailyTip = document.getElementById("daily-tip");
  
  if (gameInstruction) gameInstruction.remove();
  if (dailyTip) dailyTip.remove();
  gameArea.innerHTML = "";
  result.textContent = "";
  document.getElementById("narration").style.display = "none";
  startBtn.style.display = "none";

  const focusMessage = getTodayFocusMessage();
  companionText.textContent = focusMessage;

  const day = new Date().getDate();
  if (day % 3 === 0) {
    quickMathGame();
  } else if (day % 2 === 0) {
    memoryNumberGame();
  } else {
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
    btn.addEventListener("click", () => {
  // Haptic on mobile
  if (navigator.vibrate) navigator.vibrate(50);

  // Remove highlights from previous clicks
  document.querySelectorAll("#grid button").forEach(b => {
    b.style.backgroundColor = "#f0f0f0";
    b.style.border = "none";
    b.style.fontWeight = "normal";
    b.style.boxShadow = "none";
  });

  // Highlight the clicked one
  btn.style.backgroundColor = "#b2fab4";
  btn.style.border = "2px solid #4caf50";
  btn.style.fontWeight = "bold";
  btn.style.boxShadow = "0 0 10px #4caf50";

  const elapsed = (Date.now() - startTime) / 1000;
  const rounded = elapsed.toFixed(2);
  let message = "";

  if (i === differentIndex) {
  let successLevel;
  if (elapsed < 2) {
    message = `⚡ Incredible! ${rounded}s`;
    successLevel = "high";
  } else if (elapsed < 5) {
    message = `✅ Good job! ${rounded}s`;
    successLevel = "medium";
  } else {
    message = `🙂 You got it in ${rounded}s — try faster tomorrow!`;
    successLevel = "low";
  }

  const narration = getCompanionNarration("pattern", successLevel);
    
    result.textContent = message;
    const narrationEl = document.getElementById("narration");
    narrationEl.textContent = narration;
    narrationEl.style.display = "block";
    trackBestTime(rounded);
  } else {
    message = "❌ Nope! That wasn’t it.";
result.textContent = message;

const narration = getCompanionNarration("pattern", "fail");
const narrationEl = document.getElementById("narration");
narrationEl.textContent = narration;
narrationEl.style.display = "block";

showCompanionDialogue("fail");
  }
});

  btn.onmouseenter = () => {
  btn.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.15)";
};
btn.onmouseleave = () => {
  if (btn.style.backgroundColor !== "rgb(178, 250, 180)") {
    btn.style.boxShadow = "";
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

function quickMathGame() {
  const a = Math.floor(Math.random() * 10);
  const b = Math.floor(Math.random() * 10);
  const correctSum = a + b;
  const isCorrect = Math.random() > 0.5;
  const shownSum = isCorrect ? correctSum : correctSum + (Math.random() > 0.5 ? 1 : -1);

  gameArea.innerHTML = `
    <p>Is this math correct?</p>
    <h2>${a} + ${b} = ${shownSum}</h2>
    <div style="margin-top: 1rem;">
      <button onclick="checkMathAnswer(${isCorrect})">✅</button>
      <button onclick="checkMathAnswer(${!isCorrect})">❌</button>
    </div>
  `;
}

function checkMathAnswer(isUserCorrect) {
  if (isUserCorrect) {
  result.textContent = "✅ Well done! Your math reflexes are sharp.";
  const narration = getCompanionNarration("math", "high");
    const narrationEl = document.getElementById("narration");
    narrationEl.textContent = narration;
    narrationEl.style.display = "block";
  } else {
    result.textContent = "❌ Not quite! Keep practicing.";
    const narration = getCompanionNarration("math", "fail");
    const narrationEl = document.getElementById("narration");
    narrationEl.textContent = narration;
    narrationEl.style.display = "block";
    
    showCompanionDialogue("fail");
  }
}

function checkAnswer(correctNumber) {
  const guess = document.getElementById("guess").value;
  if (parseInt(guess) === correctNumber) {
  result.textContent = "✅ Great job! You remembered it.";
  const narration = getCompanionNarration("memory", "high");
    const narrationEl = document.getElementById("narration");
    narrationEl.textContent = narration;
    narrationEl.style.display = "block";
  } else {
    result.textContent = `❌ Oops! It was ${correctNumber}. Try again tomorrow.`;
    const narration = getCompanionNarration("memory", "fail");
    const narrationEl = document.getElementById("narration");
    narrationEl.textContent = narration;
    narrationEl.style.display = "block";

showCompanionDialogue("fail");
  }
}

function getCompanionNarration(gameType, level) {
  const patternTips = {
    high: [
      "🧠 Your reaction time is on point! Keep scanning the world around you today.",
      "👁️‍🗨️ Great spotting! That kind of visual sharpness helps in real life, too.",
      "✨ Nailed it! Spotting patterns is how the brain filters chaos.",
    ],
    medium: [
      "✅ Nice job! You're getting sharper. Daily training compounds.",
      "🎯 Good recognition — aim to shave off a second next time!",
      "⏱️ Solid focus. Try pacing your scanning rhythm next round.",
    ],
    low: [
      "🔍 You found it — but let’s aim for faster tomorrow!",
      "🐢 Took a bit, but still a win. Try scanning by row next time.",
      "💡 Speed comes with reps — great start.",
    ],
    fail: [
      "❌ Not quite — but that’s okay. The brain learns fastest from misses.",
      "🌀 Almost there. Try focusing on *groups* of icons next time.",
      "💡 Mistakes are proof you’re trying. Let’s get it tomorrow.",
    ],
  };

  const memoryTips = {
    high: [
      "🧠 That’s some sharp memory! Want a challenge? Try recalling your last grocery list later.",
      "📦 Great recall — today’s rep just made your memory stronger.",
      "💭 You remembered it! These drills help in daily tasks too.",
    ],
    medium: [
      "✅ Solid memory! You’re on the right track — come back tomorrow for another rep.",
      "🧠 Nice! Try repeating the number out loud next time for even better results.",
      "🎯 Good job — lock it in quicker tomorrow!",
    ],
    low: [
      "🐌 You got it, but that pause was long — aim to react faster tomorrow.",
      "🧩 It counts! Still, see if you can shave off a few seconds next time.",
      "💡 Try visualizing the number like a code next round.",
    ],
    fail: [
      "🔁 No worries — memory flex takes time. Come back stronger tomorrow.",
      "🗂️ Almost had it. Memory lapses are natural, and improvable.",
      "🌱 Missed it today? That’s still a rep for your recall muscle.",
    ],
  };

  const mathTips = {
    high: [
      "🔢 Math reflexes like that help you tip, split bills, and more. You're sharp.",
      "🚀 Quick logic! Mental agility grows with every try.",
      "💡 Nicely done — even small math wins add up to strong habits.",
    ],
    medium: [
      "🎯 Nice job — a strong response! You’re sharpening your mental calculator.",
      "📊 Almost instant — keep pushing for speed.",
      "🧠 Quick math is powerful — and you’re getting better at it.",
    ],
    low: [
      "⌛ You got it, but slowly — try to answer more instinctively next time.",
      "🐢 A bit delayed, but correct — try to trust your gut tomorrow.",
      "⏱️ Speed up the decision — reaction time matters too.",
    ],
    fail: [
      "🤔 A small miss — no biggie. Your brain still worked through it.",
      "🧮 Try again tomorrow — the right answer often sticks better after a wrong one.",
      "⚙️ Mental gears are turning — and that’s what counts.",
    ],
  };

  const bank = {
    pattern: patternTips,
    memory: memoryTips,
    math: mathTips,
  };

  return bank[gameType][level][Math.floor(Math.random() * bank[gameType][level].length)];
}
window.onload = () => {
  document.getElementById("today-date").textContent = new Date().toDateString();
  document.getElementById("companion-text").textContent = getTodayFocusMessage();
  document.getElementById("daily-tip").textContent = getDailyTip();

  startBtn.classList.add("pulse");

startBtn.addEventListener("click", () => {
  startBtn.classList.remove("pulse");
  document.getElementById("game-instruction").style.display = "none";
  startGame();
});
};

