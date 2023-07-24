class Player {
  #guessedHistory;

  constructor() {
    this.#guessedHistory = [];
  }

  registerGuess(guessedWord, correctLetters) {
    this.#guessedHistory.push({ guessedWord, correctLetters });
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
  #correctFrequency;

  constructor(player, word, totalChance) {
    this.#player = player;
    this.#correctWord = word;
    this.#totalChance = totalChance;
    this.#chanceLeft = totalChance;
    this.#guessed = false;
    this.#correctFrequency = {};
  }

  isGuessCorrect(guessedWord) {
    return guessedWord === this.#correctWord;
  }

  #countFrequency(word) {
    return [...word].reduce((freq, letter) => {
      if (freq[letter] === undefined) {
        freq[letter] = 0;
      }
      freq[letter] += 1;
      return freq;
    }, {});
  }

  #calculateMatchLetter(count, guessWithCount) {
    const [guessedLetter, guessedCount] = guessWithCount;
    const correctFrequency = this.#correctFrequency;

    if (!correctFrequency[guessedLetter]) return count;

    let toAdd = 0;
    const correctCount = correctFrequency[guessedLetter];
    toAdd = guessedCount < correctCount ? guessedCount : correctCount;

    return count + toAdd;
  }

  #countCorrectLetters(guessedWord) {
    this.#correctFrequency = this.#countFrequency(this.#correctWord);
    const guessedFrequency = this.#countFrequency(guessedWord);

    return Object.entries(guessedFrequency).reduce(
      (count, guessWithCount) =>
        this.#calculateMatchLetter(count, guessWithCount),
      0
    );
  }

  updateGame(guessedWord) {
    this.#guessed = this.isGuessCorrect(guessedWord);
    const correctLetters = this.#countCorrectLetters(guessedWord);
    this.#player.registerGuess(guessedWord, correctLetters);
    this.#chanceLeft = this.#chanceLeft - 1;
  }

  isGameOver() {
    return this.#chanceLeft === 0 || this.#guessed;
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
    const status = { ...this.game.status };
    this.renderer.render(status);
  }
}

class Renderer {
  constructor() {
    this.resultElement = document.querySelector("#result");
    this.chancesLeft = document.querySelector("#chance-left");
    this.guessedHistory = document.querySelector("#guess-history");
  }

  #createGuessContainer() {
    const guessContainer = document.createElement("section");
    guessContainer.classList.add("flexRow");
    return guessContainer;
  }

  #createGuessElement(guessedWord) {
    const guessElement = document.createElement("p");
    guessElement.innerText = guessedWord;

    return guessElement;
  }

  #createCorrectLetterElement(correctLetters) {
    const correctLettersElement = document.createElement("p");
    correctLettersElement.innerText = `Correct Letters: ${correctLetters}`;
    return correctLettersElement;
  }

  #renderGuessHistory(guessHistory) {
    this.guessedHistory.replaceChildren();

    guessHistory.forEach((guess) => {
      const { guessedWord, correctLetters } = guess;
      const guessContainer = this.#createGuessContainer();

      const guessElement = this.#createGuessElement(guessedWord);

      const correctLettersElement =
        this.#createCorrectLetterElement(correctLetters);

      guessContainer.appendChild(guessElement);
      guessContainer.appendChild(correctLettersElement);
      this.guessedHistory.appendChild(guessContainer);
    });
  }

  render(status) {
    const { guessed, guessedHistory, chanceLeft } = status;

    this.resultElement.innerText = guessed ? "Correct" : "Incorrect";
    this.chancesLeft.innerText = chanceLeft;
    this.#renderGuessHistory(guessedHistory);
  }
}

window.onload = () => {
  const guessButton = document.querySelector("#guess-button");
  const guessedWordElement = document.querySelector("#guess-area");
  const word = "hello";
  const totalChance = 2;
  const renderer = new Renderer();
  const player = new Player();

  const game = new Game(player, word, totalChance);
  const controller = new Controller(game, renderer);

  guessButton.onclick = () => {
    const guessedWord = guessedWordElement.value;
    controller.takeGuess(guessedWord);
  };
};
