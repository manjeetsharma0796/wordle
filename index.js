class Player {
  #guessedHistory;

  constructor() {
    this.#guessedHistory = [];
  }

  registerGuess(guessedWord, correctLetters, correctStats) {
    this.#guessedHistory.push({ guessedWord, correctLetters, correctStats });
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
  #score;
  constructor(player, word, totalChance) {
    this.#player = player;
    this.#correctWord = word;
    this.#totalChance = totalChance;
    this.#chanceLeft = totalChance;
    this.#guessed = false;
    this.#correctFrequency = {};
    this.#score = 0;
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

  #calculateCorrectStats(guessedWord) {
    const word = [...this.#correctWord];
    const summary = [];

    [...guessedWord].forEach((letter, index) => {
      let isPresent = false;
      let isCorrectPosition = false;

      if (word.includes(letter)) {
        isPresent = true;
        if (index === word.indexOf(letter)) {
          isCorrectPosition = true;
        }
      }

      summary.push({ letter: letter, isPresent, isCorrectPosition });
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
    const correctLetters = this.#countCorrectLetters(guessedWord);
    const correctStats = this.#calculateCorrectStats(guessedWord);
    this.#player.registerGuess(guessedWord, correctLetters, correctStats);
  }

  isGameOver() {
    return this.#chanceLeft === 0 || this.#guessed;
  }

  get status() {
    const guessedHistory = [...this.#player.guessHistory];
    const guessed = this.#guessed;
    const chanceLeft = this.#chanceLeft;
    const score = this.#score;

    return { guessed, guessedHistory, chanceLeft, score };
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
  }

  #createGuessContainer() {
    const guessContainer = document.createElement("section");
    guessContainer.classList.add("flex-row");
    return guessContainer;
  }

  #createLetterCountElement(correctLetters) {
    const correctLettersElement = document.createElement("p");
    correctLettersElement.innerText = `Correct Letters: ${correctLetters}`;
    return correctLettersElement;
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

      letterElement.innerText = letter;
      guessContainer.appendChild(letterElement);
    });
  }

  #renderGuessHistory(guessHistory) {
    this.guessedHistory.replaceChildren();

    guessHistory.forEach((guess) => {
      const { _, correctLetters, correctStats } = guess;

      const guessContainer = this.#createGuessContainer();

      const correctLettersElement =
        this.#createLetterCountElement(correctLetters);

      this.#renderLetter(correctStats, guessContainer);

      guessContainer.appendChild(correctLettersElement);
      this.guessedHistory.appendChild(guessContainer);
    });
  }

  #renderScore(score) {
    const scoreElement = this.scoreElement;
    scoreElement.innerText = `Score: ${Number(score)}`;
  }

  render(status) {
    const { guessed, guessedHistory, chanceLeft, score } = status;

    this.resultElement.innerText = guessed ? "Correct" : "Incorrect";
    this.chancesLeft.innerText = chanceLeft;
    this.#renderGuessHistory(guessedHistory);
    if (guessed || chanceLeft === 0) {
      this.#renderScore(score);
    }
  }
}

window.onload = () => {
  const guessButton = document.querySelector("#guess-button");
  const guessedWordElement = document.querySelector("#guess-area");
  const word = "brown";
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
