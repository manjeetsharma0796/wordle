class Word {
  correctWord;

  constructor(word) {
    this.correctWord = word;
  }

  isSame(guessedWord) {
    return this.correctWord === guessedWord;
  }

  calculateLetterStats(guessedWord) {
    const word = [...this.correctWord];
    const stats = [];

    [...guessedWord].forEach((letter, index) => {
      if (word[index] === guessedWord[index]) {
        stats[index] = { letter, isPresent: true, isCorrectPosition: true };
        word[index] = "'";
      }
    });

    [...guessedWord].forEach((letter, index) => {
      if (word.includes(letter) && stats[index] === undefined) {
        const indexToClear = word.indexOf(letter);
        stats[index] = { letter, isPresent: true, isCorrectPosition: false };
        word[indexToClear] = "'";
      }

      if (word.includes(letter) === false && stats[index] === undefined) {
        stats[index] = {
          letter,
          isPresent: false,
          isCorrectPosition: false,
        };
      }
    });

    return stats;
  }
}

class Game {
  #wordle;
  #totalChance;
  #chanceLeft;
  #guessed;
  #score;
  #guessedHistory;

  constructor(wordle, totalChance) {
    this.#wordle = wordle;
    this.#totalChance = totalChance;
    this.#chanceLeft = totalChance;
    this.#guessed = false;
    this.#score = 0;
    this.#guessedHistory = [];
  }

  isGuessCorrect(guessedWord) {
    return this.#wordle.isSame(guessedWord);
  }

  #calculateScore() {
    this.#score =
      (this.#totalChance - (this.#totalChance - this.#chanceLeft) + 1) * 10;
  }

  updateGame(guessedWord) {
    this.#guessed = this.isGuessCorrect(guessedWord);
    this.#chanceLeft = this.#chanceLeft - 1;
    this.#calculateScore();
    const letterStats = this.#wordle.calculateLetterStats(guessedWord);
    this.#registerGuess(guessedWord, letterStats);
  }

  isGameOver() {
    return this.#chanceLeft === 0 || this.#guessed;
  }

  #registerGuess(guessedWord, correctStats) {
    this.#guessedHistory.push({ guessedWord, correctStats });
  }

  get status() {
    const guessedHistory = [...this.#guessedHistory];
    const guessed = this.#guessed;
    const chanceLeft = this.#chanceLeft;
    const score = this.#score;
    const word = this.#wordle.correctWord;

    return { guessed, guessedHistory, chanceLeft, score, word };
  }
}

class Controller {
  constructor(game, renderer) {
    this.game = game;
    this.renderer = renderer;
  }

  takeGuess(guessedWord) {
    if (this.game.isGameOver()) {
      return;
    }

    this.game.updateGame(guessedWord);
    const status = { ...this.game.status };
    this.renderer.render(status);
  }
}

class Renderer {
  constructor() {
    this.chancesLeft = document.querySelector("#chance-left");
    this.guessedHistory = document.querySelector("#guess-history");
    this.scoreElement = document.querySelector("#score");
    this.correctWordElement = document.querySelector("#correct-word");
    this.guessArea = document.querySelector("#guess-area");
  }

  #createGuessContainer() {
    const guessContainer = document.createElement("section");
    guessContainer.classList.add("flex-row");
    return guessContainer;
  }

  #renderLetter(correctStats, guessContainer) {
    correctStats.forEach((letterWithStat) => {
      const { letter, isPresent, isCorrectPosition } = letterWithStat;
      const letterElement = document.createElement("p");

      letterElement.classList.add("box");

      if (isPresent && isCorrectPosition) {
        letterElement.classList.add("green");
      }

      if (isPresent && !isCorrectPosition) {
        letterElement.classList.add("yellow");
      }

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
  render(status) {
    const { guessed, guessedHistory, chanceLeft, score, word } = status;
    this.guessArea.value = "";
    this.chancesLeft.innerText = chanceLeft;
    this.#renderGuessHistory(guessedHistory);
    if (chanceLeft === 0 || guessed) {
      this.#renderCorrectWord(word);
      guessed ? this.#renderScore(score) : this.#renderScore(0);
    }
  }
}

window.onload = () => {
  const guessButton = document.querySelector("#guess-button");
  const guessedWordElement = document.querySelector("#guess-area");
  const words = [
    "dream",
    "guard",
    "flood",
    "adult",
    "brisk",
    "broad",
    "broil",
    "broke",
    "brood",
    "bylaw",
    "sight",
    "alarm",
    "force",
    "hello",
  ];

  const randomIndex = Math.floor(Math.random() * 10) % words.length;
  const word = words[randomIndex];
  const totalChance = 6;
  const renderer = new Renderer();
  const wordle = new Word(word);

  const game = new Game(wordle, totalChance);
  const controller = new Controller(game, renderer);

  guessButton.onclick = () => {
    const guessedWord = guessedWordElement.value;
    controller.takeGuess(guessedWord);
  };
};
