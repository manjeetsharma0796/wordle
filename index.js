const createGuessMadeElement = (guess) => {
  const guessElement = document.createElement("p");
  guessElement.innerText = guess;
  return guessElement;
};

const disableGuessButton = (guessButton) => {
  guessButton.disabled = true;
};

const guessOutcomeAndDisplay = (
  guessedWord,
  word,
  resultElement,
  chanceLeft,
  guessButton
) => {
  resultElement.innerText = guessedWord === word ? "Correct" : "Incorrect";
  chanceLeft.innerText = Number(chanceLeft.innerText) - 1;
  if (Number(chanceLeft.innerText) === 0) {
    disableGuessButton(guessButton);
  }
};

window.onload = () => {
  const guessButton = document.querySelector("#guess-button");
  const resultElement = document.querySelector("#result");
  const word = "hello";
  const chanceLeft = document.querySelector("#chance-left");
  const guessContainer = document.querySelector("#guess-history");
  const guessedWordElement = document.querySelector("#guess-area");

  guessButton.onclick = () => {
    const guessedWord = guessedWordElement.value;
    guessOutcomeAndDisplay(
      guessedWord,
      word,
      resultElement,
      chanceLeft,
      guessButton
    );

    const guessElement = createGuessMadeElement(guessedWordElement.value);
    guessContainer.appendChild(guessElement);
  };
};
