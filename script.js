
// wordlist and dictionary are included in the HTML
const guessGrid = document.querySelector('[data-guess-grid]');
const WORD_LENGTH = 5;

const startingDate = new Date(2022, 0, 1);
const timeSinceDate = Date.now() - startingDate;
const wordIndex = Math.floor(timeSinceDate / 1000 / 3600 / 24) % wordlist.length;
const targetWord = wordlist[wordIndex];
console.log(`Index ${wordIndex} = ${wordlist[wordIndex]}`);

// targetWord = 'hello'; // TODO: Remove after testing


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

// ----- Handle all keyboard inputs -----

function pressKey(key) {
  // Adds the letter to the guess and update the display
  console.log('Receiving key:', key);
  const activeTiles = getActiveTiles();
  if (activeTiles.length >= WORD_LENGTH) return;

  const nextTile = guessGrid.querySelector(':not([data-letter])');
  nextTile.dataset.letter = key.toLowerCase();
  nextTile.textContent = key.toUpperCase();
  nextTile.dataset.state = 'active';
}

function submitGuess() {
  // If a full row has been entered, check if it's correct
  let submittedWord = '';
  const activeTiles = getActiveTiles();
  if (activeTiles.length < WORD_LENGTH) {
    showAlert('Please enter a full word.');
    shakeTiles(activeTiles);
    return;
  }
  
  console.log('Submitting...');
  for (tile of activeTiles) {
    submittedWord += tile.dataset.letter;
  }
  if (submittedWord === targetWord) {
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
  delete lastTile.dataset.state;
  delete lastTile.dataset.letter;
}

// ----- Helper functions -----
function showAlert(message) {
  const alertContainer = document.querySelector('[data-alert-container]');
  const alert = document .createElement('div');
  alert.textContent = message;
  alert.classList.add('alert');
  alertContainer.prepend(alert);
  setTimeout(() => {
    alert.classList.add('hide');
  }, 3000);
  setTimeout(() => {
    alertContainer.removeChild(alert);
  }, 4000);
}

function shakeTiles(tiles) {
  for (tile of tiles) {
    tile.classList.add('shake');
    setTimeout(() => {
      tile.classList.remove('shake');
    }, 500);
  }
}

// ----- Start the game -----
function startPlay() {
  document.addEventListener('keydown', handleKeyPress);
  document.addEventListener('click', handleClick);
}

function endPlay() {
  document.removeEventListener('keydown', handleKeyPress);
  document.removeEventListener('click', handleClick);
}

startPlay();