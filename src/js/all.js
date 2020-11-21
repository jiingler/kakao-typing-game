const { 
  generateStartBtnText, 
  fetchJSONData, 
  calculateAverageTime,
  checkInputIsCorrect
} = require('./utils')

const startBtn = document.querySelector('#start-btn');
const restartBtn = document.querySelector('#restart-btn');

const secondSpan = document.querySelector('#second');
const scoreSpan = document.querySelector('#score');
const questionLabel = document.querySelector('#question-label');

const answerInput = document.querySelector('#answer-input');

const startContainer = document.querySelector('#start');
const finishContainer = document.querySelector('#finish');

const finishScore = document.querySelector('#finish-score');
const averageTime = document.querySelector('#average-time');

let isPlayingGame = false;
let jsonContent = [];
let nowQuestion = '';
let nowSecond = 0;
let countdown;
let nowScore;

// total time the game takes
let totalTime = 0;
// total correct questions
let totalCorrect = 0;
// time which a word takes
let aWordUseTime = 0;

const gameOverText = '게임종료';
const questionLabelText = '문제 단어';
const gameTitleText = '타자게임';

const jsonServerUrl = 'https://my-json-server.typicode.com/kakaopay-fe/resources/words';

/**
 * initialize game
 */
window.onload = (async ()=> {
  finishContainer.style.display = 'none';
  startBtn.disabled = true;
  await getJson();
})

/**
 * start or reset
 */
startBtn.addEventListener('click', (event) => {
  event.preventDefault()
  isPlayingGame = !isPlayingGame;

  startBtn.innerHTML = generateStartBtnText(isPlayingGame);

  if (isPlayingGame) {
    nextQuestion()
  } else {
    clearInterval(countdown);
    resetGame();
  }
})

/**
 * back to the start page and reset game 
 */
restartBtn.addEventListener('click', (event) => {
  event.preventDefault()
  startContainer.style.display = 'block';
  finishContainer.style.display = 'none';
  window.history.pushState(null, gameTitleText, '/start');
  resetGame();
})

/**
 * next question
 */
function nextQuestion() {
  clearInterval(countdown);
  
  // if out of questions
  if (jsonContent.length === 0) {
    startContainer.style.display = 'none';
    finishContainer.style.display = 'block';
    finishScore.textContent = nowScore;
    averageTime.textContent = calculateAverageTime(totalTime, totalCorrect)
    window.history.pushState(null, gameOverText, '/finish');
    resetGame();

    return;
  }

  // next
  let randomNum = _.random(0, jsonContent.length - 1)
  nowQuestion = jsonContent[randomNum].text;
  nowSecond = jsonContent[randomNum].second;
  
  // remove question from JSON list
  jsonContent.splice(randomNum, 1);

  // time reset
  secondSpan.textContent = nowSecond;
  aWordUseTime = 0;
  countdown = setInterval(() => {
    if (nowSecond > 0) {
      nowSecond--;
      secondSpan.textContent = nowSecond;
      aWordUseTime++;
      if (nowSecond === 0) {
        scoreSpan.textContent = Number(scoreSpan.textContent) - 1;
        nowScore = Number(scoreSpan.textContent);
        nextQuestion();
      }
    }    
  }, 1000)
  questionLabel.textContent = nowQuestion;
}

/**
 * when answerInput was focused and 
 * detect the ENTER was clicked or not
 * to check answer is correct or wrong.
 */
answerInput.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    checkAnswer();
  }
})

/**
 * check answerInput's input
 */
function checkAnswer() {
  const inputValue = answerInput.value;
  answerInput.value = '';
  if (checkInputIsCorrect(inputValue, nowQuestion)) {
    totalCorrect++;
    totalTime += aWordUseTime;
    nextQuestion();
  }
}

/**
 * fetch JSON content from URL
 */
async function getJson() {
  jsonContent = await fetchJSONData(jsonServerUrl);
  initScore(jsonContent)
  startBtn.disabled = false;
}

/**
 * initialize the score which is amount of the questions
 */
function initScore(jsonRes) {
  let score = jsonRes.length;
  scoreSpan.textContent = score;
  nowScore = score;
}


/**
 * reset was clicked and get to reset the game settings
 */
function resetGame() {
  getJson();
  totalTime = 0;
  totalCorrect = 0;
  isPlayingGame = false;
  startBtn.textContent = generateStartBtnText(isPlayingGame);
  secondSpan.textContent = '?';
  questionLabel.textContent = questionLabelText;
  answerInput.value = '';
}


