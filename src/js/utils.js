exports.generateStartBtnText = (isPlayingGame) => {
  const startText = '시작';
  const resetText = '초기화';
  return isPlayingGame ? resetText : startText;
}

exports.fetchJSONData = async (jsonServerUrl) => {
  const result = await fetch(jsonServerUrl);
  const data = await result.json();
  return data;
}

exports.isJSON = (str) => {
  const json = JSON.parse(str);
  if (Object.prototype.toString.call(json).slice(8, -1) !== 'Object') {
    return false
  }
}

exports.calculateAverageTime = (totalTime, totalCorrect) => {
  return totalCorrect === 0 ? 0 : Math.round(totalTime/totalCorrect*10)/10;
}

exports.checkInputIsCorrect = (inputValue, questionText) => {
  return inputValue === questionText;
}


