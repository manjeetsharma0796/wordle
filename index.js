class Player {
  #guessedHistory;

  constructor() {
    this.#guessedHistory = [];
  }

  registerGuess(guessedWord, correctStats) {
    this.#guessedHistory.push({ guessedWord, correctStats });
  }

  get guessHistory() {
    return [...this.#guessedHistory];
  }
}

class Game {
  #player;
  #correctWord;
  #totalChance;
  #chanceLeft;
  #guessed;
  #score;
  constructor(player, word, totalChance) {
    this.#player = player;
    this.#correctWord = word;
    this.#totalChance = totalChance;
    this.#chanceLeft = totalChance;
    this.#guessed = false;
    this.#score = 0;
  }

  isGuessCorrect(guessedWord) {
    return guessedWord === this.#correctWord;
  }

  #calculateCorrectStats(guessedWord) {
    const word = [...this.#correctWord];
    const summary = [];

    [...guessedWord].forEach((letter, index) => {
      if (word[index] === guessedWord[index]) {
        summary[index] = { letter, isPresent: true, isCorrectPosition: true };
        word[index] = "'";
      }
    });

    [...guessedWord].forEach((letter, index) => {
      if (word.includes(letter) && summary[index] === undefined) {
        const indexToClear = word.indexOf(letter);
        summary[index] = { letter, isPresent: true, isCorrectPosition: false };
        word[indexToClear] = "'";
      }

      if (word.includes(letter) === false && summary[index] === undefined) {
        summary[index] = {
          letter,
          isPresent: false,
          isCorrectPosition: false,
        };
      }
    });

    return summary;
  }

  #calculateScore() {
    this.#score =
      (this.#totalChance - (this.#totalChance - this.#chanceLeft) + 1) * 10;
  }

  updateGame(guessedWord) {
    this.#guessed = this.isGuessCorrect(guessedWord);
    this.#chanceLeft = this.#chanceLeft - 1;
    this.#calculateScore();

    const correctStats = this.#calculateCorrectStats(guessedWord);
    this.#player.registerGuess(guessedWord, correctStats);
  }

  isGameOver() {
    return this.#chanceLeft === 0 || this.#guessed;
  }

  get status() {
    const guessedHistory = [...this.#player.guessHistory];
    const guessed = this.#guessed;
    const chanceLeft = this.#chanceLeft;
    const score = this.#score;
    const word = this.#correctWord;

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
    this.resultElement = document.querySelector("#result");
    this.chancesLeft = document.querySelector("#chance-left");
    this.guessedHistory = document.querySelector("#guess-history");
    this.scoreElement = document.querySelector("#score");
    this.correctWordElement = document.querySelector("#correct-word");
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

    this.resultElement.innerText = guessed ? "Correct" : "Incorrect";
    this.chancesLeft.innerText = chanceLeft;
    this.#renderGuessHistory(guessedHistory);
    if (guessed || chanceLeft === 0) {
      this.#renderScore(score);
      this.#renderCorrectWord(word);
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
    "sight",
    "alarm",
    "force",
    "hello",
  ];

  const randomIndex = Math.floor(Math.random() * 10) % 1;
  const word = words[randomIndex];
  const totalChance = 6;
  const renderer = new Renderer();
  const player = new Player();

  const game = new Game(player, word, totalChance);
  const controller = new Controller(game, renderer);

  guessButton.onclick = () => {
    const guessedWord = guessedWordElement.value;
    controller.takeGuess(guessedWord);
  };
};
