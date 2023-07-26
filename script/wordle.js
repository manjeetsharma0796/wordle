class Wordle {
  constructor(word) {
    this.correctWord = word;
  }

  isSame(guessedWord) {
    return this.correctWord === guessedWord;
  }

  #correctLetterEntries(word, guessedWord, stats) {
    [...guessedWord].forEach((letter, index) => {
      if (word[index] === guessedWord[index]) {
        stats[index] = { letter, isPresent: true, isCorrectPosition: true };
        word[index] = "'";
      }
    });
  }

  #restLetterEntries(word, guessedWord, stats) {
    [...guessedWord].forEach((letter, index) => {
      if (word.includes(letter) && stats[index] === undefined) {
        stats[index] = { letter, isPresent: true, isCorrectPosition: false };
        word[index] = "'";
      }

      if (word.includes(letter) === false && stats[index] === undefined) {
        stats[index] = {
          letter,
          isPresent: false,
          isCorrectPosition: false,
        };
      }
    });
  }

  calculateLetterStats(guessedWord) {
    const word = [...this.correctWord];
    const stats = [];
    this.#correctLetterEntries(word, guessedWord, stats);
    this.#restLetterEntries(word, guessedWord, stats);

    return stats;
  }
}
