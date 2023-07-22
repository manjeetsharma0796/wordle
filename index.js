const guessOutcomeAndDisplay = (word, resultElement) => {
  const guessedWordElement = document.querySelector("#guess-area");
  console.log(guessedWordElement.value);
  if (guessedWordElement.value === word) {
    resultElement.innerText = "correct";
  }
  resultElement.innerText = "incorrect";
};

window.onload = () => {
  const guessButton = document.querySelector("#guess-button");
  const resultElement = document.querySelector("#result");
  const word = "hello";

  guessButton.onclick = () => {
    guessOutcomeAndDisplay(word, resultElement);
  };
};
