class Word {
  correctWord;

  constructor(word) {
    this.correctWord = word;
    this.stats = [];
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
