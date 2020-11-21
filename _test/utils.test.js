const { 
  generateStartBtnText, 
  fetchJSONData, 
  isJSON, 
  calculateAverageTime,
  checkInputIsCorrect 
} = require('../src/js/utils');

test('if is playing game the start button text should be 초기화', () => {
  const startBtnText = generateStartBtnText(true);
  expect(startBtnText).toBe('초기화');
})

test('if is not playing game the start button text should be 시작', () => {
  const startBtnText = generateStartBtnText(false);
  expect(startBtnText).toBe('시작');
})

test('should get JSON content and is JSON', () => {
  const jsonServerUrl = 'https://my-json-server.typicode.com/kakaopay-fe/resources/words';
  const jsonContent = fetchJSONData(jsonServerUrl);
  jsonContent.then((res)=> expect(isJSON(res).toBe(true)));
})

test('should get average time to input a word', () => {
  expect(calculateAverageTime(14, 10)).toBeCloseTo(1.4);
})

test('if total correct amount is 0, the average time should be 0', () => {
  expect(calculateAverageTime(10, 0)).toEqual(0);
})

test('input value should be equal to question text', () => {
  const inputValue = 'kakaopay';
  const questionText = 'kakaopay';
  expect(checkInputIsCorrect(inputValue, questionText)).toBe(true);
  const inputValue2 = 'developers';
  const questionText2 = 'developers';
  expect(checkInputIsCorrect(inputValue, questionText)).toBe(true);
  const inputValueWrong = 'kakao';
  expect(checkInputIsCorrect(inputValueWrong, questionText)).not.toBe(true);
})


