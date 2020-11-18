import _ from 'lodash';
import './all.scss';

let isPlayingGame = false;
const startBtn = document.querySelector('#start-btn');

startBtn.addEventListener('click', () => {
  startBtn.innerHTML = isPlayingGame? '시작' : '초기화';
  isPlayingGame = !isPlayingGame;
  console.log('isPlayingGame:', isPlayingGame);
})


// function component() {
//   let element = document.createElement('div');

//   // lodash（目前通过一个 script 引入）对于执行这一行是必需的
//   element.innerHTML = _.join(['Hello', 'webpack222'], ' ');

//   return element;
// }

// document.body.appendChild(component());