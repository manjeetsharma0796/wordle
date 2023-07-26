class Controller {
  constructor(game, renderer, gameStorage) {
    this.game = game;
    this.renderer = renderer;
    this.gameStorage = gameStorage;
  }

  takeGuess(guessedWord) {
    this.game.updateGame(guessedWord);
    const status = { ...this.game.status };

    const { word, score } = status;
    if (this.game.isGameOver()) {
      this.gameStorage.registerScore({ word, score });
    }

    this.renderer.render(status);
  }

  renderPreviousScore() {
    const previousScore = this.gameStorage.gameScore;
    this.renderer.renderPreviousScore(previousScore);
  }
}

