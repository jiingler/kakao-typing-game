const startBtn = document.querySelector('#start-btn');
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
let totalTime = 0;
let totalCorrect = 0;
let aWordUseTime = 0;

window.onload = (()=> {
  finishContainer.style.display = 'none';
  startBtn.disabled = true;
})


startBtn.addEventListener('click', (event) => {
  event.preventDefault()
  isPlayingGame = !isPlayingGame;
  startBtn.innerHTML = !isPlayingGame ? '시작' : '초기화';

  if (isPlayingGame) {
    nextQuestion()
  } else {
    clearInterval(countdown);
    resetGame();
  }
});


/**
 * 下一題、時間重設
 */
function nextQuestion() {
  clearInterval(countdown);
  if (jsonContent.length === 0) {
    startContainer.style.display = 'none';
    finishContainer.style.display = 'block';
    finishScore.innerHTML = nowScore;
    averageTime.innerHTML = totalCorrect === 0 ? 0 : Math.round(totalTime/totalCorrect*10)/10;
    window.history.pushState(null, '게임종료', '/finish');
    // reset
    resetGame();

    return;
  }

  // 下一題
  let randomNum = _.random(0, jsonContent.length - 1)
  nowQuestion = jsonContent[randomNum].text;
  nowSecond = jsonContent[randomNum].second;
  
  // 移除出過的題目
  jsonContent.splice(randomNum, 1);

  // 時間重設
  secondSpan.innerHTML = nowSecond;
  aWordUseTime = 0;
  countdown = setInterval(() => {
    if (nowSecond > 0) {
      nowSecond--;
      secondSpan.innerHTML = nowSecond;
      aWordUseTime++;
      if (nowSecond === 0) {
        scoreSpan.innerHTML = Number(scoreSpan.innerHTML - 1);
        nowScore = Number(scoreSpan.innerHTML);
        nextQuestion();
      }
    }    
  }, 1000)
  questionLabel.innerHTML = nowQuestion;
}

answerInput.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    checkAnswer();
  }
})

function checkAnswer() {
  const inputValue = answerInput.value;
  answerInput.value = '';
  if (inputValue === nowQuestion) {
    totalCorrect++;
    totalTime += aWordUseTime;
    nextQuestion();
  }
}

function getJson() {
  fetch('https://my-json-server.typicode.com/kakaopay-fe/resources/words')
    .then(res => res.json())
    .then((output) => {
      jsonContent = output;
      setScore(output)
      startBtn.disabled = false;
    })
    .catch(err => console.error(err));
}

function setScore(jsonRes) {
  let score = jsonRes.length;
  scoreSpan.innerHTML = score;
  nowScore = score;
}

function resetGame() {
  getJson();
  totalTime = 0;
  totalCorrect = 0;
  isPlayingGame = false;
  startBtn.innerHTML = '시작';
  secondSpan.innerHTML = '?';
  questionLabel.innerHTML = '문제 단어'
  answerInput.value = '';
}

getJson();

const restartBtn = document.querySelector('#restart-btn');

restartBtn.addEventListener('click', (event) => {
  event.preventDefault()
  startContainer.style.display = 'block';
  finishContainer.style.display = 'none';
  window.history.pushState(null, '타자게임', '/start');
  resetGame();
})


