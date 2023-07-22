const guessOutcomeAndDisplay = (word, resultElement) => {
  const guessedWordElement = document.querySelector("#guess-area");
  if (guessedWordElement.value === word) {
    resultElement.innerText = "Correct";
  }
  resultElement.innerText = "Incorrect";
};

window.onload = () => {
  const guessButton = document.querySelector("#guess-button");
  const resultElement = document.querySelector("#result");
  const word = "hello";

  guessButton.onclick = () => {
    guessOutcomeAndDisplay(word, resultElement);
  };
};
