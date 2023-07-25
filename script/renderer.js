class Renderer {
  constructor() {
    this.chancesLeft = document.querySelector("#chance-left");
    this.guessedHistory = document.querySelector("#guess-history");
    this.scoreElement = document.querySelector("#score");
    this.correctWordElement = document.querySelector("#correct-word");
    this.guessArea = document.querySelector("#guess-area");
    this.previousScore = document.querySelector("#previous-score");
    this.previousWord = document.querySelector("#previous-word");
  }

  #createGuessContainer() {
    const guessContainer = document.createElement("section");
    guessContainer.classList.add("flex-row");
    return guessContainer;
  }

  #appendClassToLetter(letterElement, isPresent, isCorrectPosition) {
    if (isPresent) {
      const color = isCorrectPosition ? "green" : "yellow";
      letterElement.classList.add(color);
    }
    letterElement.classList.add("box");
    letterElement.classList.add("flex-row");
  }

  #renderLetter(correctStats, guessContainer) {
    correctStats.forEach((letterWithStat) => {
      const { letter, isPresent, isCorrectPosition } = letterWithStat;
      const letterElement = document.createElement("p");

      this.#appendClassToLetter(letterElement, isPresent, isCorrectPosition);
      letterElement.innerText = letter.toUpperCase();
      guessContainer.appendChild(letterElement);
    });
  }

  #renderGuessHistory(guessHistory) {
    this.guessedHistory.replaceChildren();

    guessHistory.forEach((guess) => {
      const { correctStats } = guess;

      const guessContainer = this.#createGuessContainer();

      this.#renderLetter(correctStats, guessContainer);
      this.guessedHistory.appendChild(guessContainer);
    });
  }

  #renderScore(score) {
    const scoreElement = this.scoreElement;
    scoreElement.innerText = `Score: ${Number(score)}`;
  }

  #renderCorrectWord(word) {
    const correctWordElement = this.correctWordElement;
    correctWordElement.innerText = `Correct Word: ${word.toUpperCase()}`;
  }

  #renderPreviousScore(previousScore) {
    this.previousScore.innerText = previousScore;
  }

  #renderPreviousWord(previousWord) {
    this.previousWord.innerText = previousWord;
  }
  render(status) {
    const { guessed, guessedHistory, chanceLeft, score, word } = status;
    this.#renderPreviousScore();
    this.#renderPreviousWord();
    this.guessArea.value = "";
    this.chancesLeft.innerText = chanceLeft;
    this.#renderGuessHistory(guessedHistory);
    if (chanceLeft === 0 || guessed) {
      this.#renderCorrectWord(word);
      const finalScore = guessed ? score : 0;
      this.#renderScore(finalScore);
      localStorage.setItem("previousWord", word);
      localStorage.setItem("previousScore", finalScore);
    }
  }
}

