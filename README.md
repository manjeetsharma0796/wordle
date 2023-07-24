Iteration 1:

- Ask user to guess a 5 letter secret word picked by you and let user know if the guess is correct or not.

Iteration 2:

- Allow user to make 2 guesses and also show user the guesses the user has made.

Iteration 3:

- Inform user about number of correct letters present in the secret word.

Iteration 4:

- Inform user about the correctness of user's guess by indicating following:

- Letters that are in the secret word but not in the correct position
- Letters that are in the secret word and are in the correct position as well

Iteration 5:

- Allow users to make a maximum of 6 guesses and score based on how many guesses user has taken to crack the secret word:

score = [(allowed_guesses) - (guesses_made) + 1 ] \* 10

If user is not able to guess score should be zero
