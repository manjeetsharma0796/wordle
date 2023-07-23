class Player {
  #guessedHistory;

  constructor() {
    this.#guessedHistory = [];
  }

  registerGuess(guessedWord) {
    this.#guessedHistory.push(guessedWord);
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
  constructor(player, word, totalChance) {
    this.#player = player;
    this.#correctWord = word;
    this.#totalChance = totalChance;
    this.#chanceLeft = totalChance;
    this.#guessed = false;
  }

  isGuessCorrect(guessedWord) {
    return guessedWord === this.#correctWord;
  }

  updateGame(guessedWord) {
    this.#player.registerGuess(guessedWord);
    this.#guessed = this.isGuessCorrect(guessedWord);
    this.#chanceLeft = this.#chanceLeft - 1;
  }

  isGameOver() {
    return this.#chanceLeft === 0 || this.#guessed ? true : false;
  }

  get status() {
    const guessedHistory = [...this.#player.guessHistory];
    const guessed = this.#guessed;
    const chanceLeft = this.#chanceLeft;
    return { guessed, guessedHistory, chanceLeft };
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
    const status = this.game.status;
    this.renderer.render(status);
  }
}

class Renderer {
  constructor() {
    this.resultElement = document.querySelector("#result");
    this.chancesLeft = document.querySelector("#chance-left");
    this.guessedHistory = document.querySelector("#guess-history");
  }

  #renderGuessHistory(guessHistory) {
    this.guessedHistory.replaceChildren();

    guessHistory.forEach((guess) => {
      const guessElement = document.createElement("p");
      guessElement.innerText = guess;
      this.guessedHistory.appendChild(guessElement);
    });
  }

  render(status) {
    const { guessed, guessedHistory, chanceLeft } = status;

    this.resultElement.innerText = guessed ? "correct" : "incorrect";
    this.chancesLeft.innerText = chanceLeft;
    this.#renderGuessHistory(guessedHistory);
  }
}

window.onload = () => {
  const guessButton = document.querySelector("#guess-button");
  const resultElement = document.querySelector("#result");
  const guessedWordElement = document.querySelector("#guess-area");
  const word = "hello";
  const totalChance = 2;

  const renderer = new Renderer(resultElement);
  const player = new Player();

  const game = new Game(player, word, totalChance);
  const controller = new Controller(game, renderer);

  guessButton.onclick = () => {
    const guessedWord = guessedWordElement.value;
    controller.takeGuess(guessedWord);
  };
};
