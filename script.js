
// wordlist and dictionary are included in the HTML
const guessGrid = document.querySelector('[data-guess-grid]');

function handleKeyPress(e) {
  const key = e.key;
  if (key === 'Enter') {
    submitGuess();
    return;
  }
  if (key === 'Backspace' || key === 'Delete') {
    deleteLastLetter();
    return;
  }
  if (key.match(/^[a-zA-Z]$/)) {
    pressKey(key);
  }
}

function handleClick(e) {
  if (e.target.matches('[data-key]')) {
    const key = e.target.dataset.key;
    pressKey(key);
    return;
  }
  if (e.target.matches('[data-enter]')) {
    submitGuess();
    return;
  }
  if (e.target.matches('[data-backspace]')) {
    deleteLastLetter();
    return;
  }
}

function getActiveTiles() {
  // Returns an array of all unsubmitted tiles on a line.
  return guessGrid.querySelectorAll('[data-state="active"]');
}

function pressKey(key) {
  // Adds the letter to the guess and update the display
  console.log('Receiving key:', key);
  const activeTiles = getActiveTiles();
  if (activeTiles.length >= 5) return;

  const nextTile = guessGrid.querySelector(':not([data-letter])');
  nextTile.dataset.letter = key.toLowerCase();
  nextTile.textContent = key.toUpperCase();
  nextTile.dataset.state = 'active';
}
function submitGuess() {
  // TODO: Check if the guess is correct
  const correctWord = 'hello';
  let submittedWord = "";
  const activeTiles = getActiveTiles();
  if (activeTiles.length < 5) return;
  
  console.log('Submitting...');
  for (tile of activeTiles) {
    submittedWord += tile.dataset.letter;
  }
  if (submittedWord === correctWord) {
    console.log('Correct!');
    // Celebrate win
  } else {
    // Set next tile to active
    // Set all previous tiles to inactive
    // Decorate the current line with colors
  }

  return;
}
function deleteLastLetter() {
  // Delete the last letter from the guess (current row only)
  console.log('Deleting last letter...');
  const activeTiles = getActiveTiles();
  if (activeTiles.length === 0) return;

  const lastTile = activeTiles[activeTiles.length - 1];
  lastTile.removeAttribute('data-letter');
  lastTile.textContent = '';
  lastTile.dataset.state = 'active';
}


function updateGameBoard() {
  console.log('Updating game board...');
  // TODO: Update the game board
  return;
  // const cell = e.target;  
  // let state = cell.getAttribute('data-state');

  // if (state === 'active') {
  //   cell.innerText = 'X';
  //   cell.backgroundColor = 'red';
  //   cell.removeAttribute('data-state');
  // }
}

function startPlay() {
  document.addEventListener('keydown', handleKeyPress);
  document.addEventListener('click', handleClick);
}

function endPlay() {
  document.removeEventListener('keydown', handleKeyPress);
  document.removeEventListener('click', handleClick);
}

startPlay();