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
  localStorage.setItem("word", word);
  const game = new Game(wordle, totalChance);
  const controller = new Controller(game, renderer);

  guessButton.onclick = () => {
    const guessedWord = guessedWordElement.value;
    controller.takeGuess(guessedWord);
  };
};