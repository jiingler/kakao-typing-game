import _ from 'lodash';
import './all.scss';

const startBtn = document.querySelector('#start-btn');
const secondSpan = document.querySelector('#second');
const scoreSpan = document.querySelector('#score');
const questionLabel = document.querySelector('#question-label');
const answerInput = document.querySelector('#answer-input');

let isPlayingGame = false;
let jsonContent = [];
let nowQuestion = '';
let nowSecond = 0;
let countdown;


startBtn.addEventListener('click', () => {
  isPlayingGame = !isPlayingGame;
  startBtn.innerHTML = !isPlayingGame? '시작' : '초기화';
  console.log('isPlayingGame:', isPlayingGame, _.random(0, jsonContent.length - 1));

  if (isPlayingGame) {
    nextQuestion()
  } else {
    clearInterval(countdown);
  }
});

/**
 * 下一題、時間重設
 */
function nextQuestion() {
  if (jsonContent.length === 0) {
    // end
    // 到中止頁
    window.location.replace('./finish.html');
    return;
  }

  // 下一題
  let randomNum =  _.random(0, jsonContent.length - 1)
  nowQuestion = jsonContent[randomNum].text;
  nowSecond = jsonContent[randomNum].second;

  console.log(jsonContent[randomNum], nowSecond, nowQuestion)
  // 移除出過的題目
  jsonContent.splice(randomNum, 1);

  // 時間重設
  secondSpan.innerHTML = nowSecond;
  clearInterval(countdown);
  countdown = setInterval(() => {
    if (nowSecond > 0) {
      nowSecond--;
      secondSpan.innerHTML = nowSecond;
      if (nowSecond === 0) {
        nextQuestion();
        // 總分扣一分
        scoreSpan.innerHTML = Number(scoreSpan.innerHTML - 1);
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
    // 下一題
    // 時間重設
    
    nextQuestion();
  }
}

function getJson() {
  fetch('https://my-json-server.typicode.com/kakaopay-fe/resources/words')
    .then(res => res.json())
    .then((output) => {
      jsonContent = output;
      setScore(output)
      // console.log('Output: ', jsonContent);
    })
    .catch(err => console.error(err));
}

function setScore(jsonRes) {
  let score = jsonRes.length;
  scoreSpan.innerHTML = score;
}

function resetGame() {

}

getJson();

// function component() {
//   let element = document.createElement('div');

//   // lodash（目前通过一个 script 引入）对于执行这一行是必需的
//   element.innerHTML = _.join(['Hello', 'webpack222'], ' ');

//   return element;
// }

// document.body.appendChild(component());