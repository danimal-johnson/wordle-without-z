
// wordlist and dictionary are included in the HTML
const guessGrid = document.querySelector('[data-guess-grid]');
const keyboard = document.querySelector('[data-keyboard]');
const alertContainer = document.querySelector('[data-alert-container]');
const modalContainer = document.querySelector('#modal-container');
const modalContent = document.querySelector('#modal-content');

const WORD_LENGTH = 5;
const DANCE_ANIMATION_DURATION = 1000;
const FLIP_ANIMATION_DURATION = 500;

const startingDate = new Date(2022, 0, 1);
const timeSinceDate = Date.now() - startingDate;
const wordIndex = Math.floor(timeSinceDate / 1000 / 3600 / 24) % wordlist.length;
const targetWord = wordlist[wordIndex];
console.log(`Index ${wordIndex} = ${wordlist[wordIndex]}`);
let gameOver = false;

// ----- Handle clicks for all objects -----

function handleClick(e) {
  if (e.target.matches('[data-close-modal]')) {
    closeModal();
    return;
  }
  if (e.target.matches('[data-topic]')) {
    openModal(e.target.dataset.topic);
    return;
  }

  // Ignore all other clicks after game ends
  if (gameOver) return;

  if (e.target.matches('[data-key]')) {
    const key = e.target.dataset.key;
    if(key === 'Z') {
      console.error('Z clicked');
      openModal('about');
      return;
    }
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

// ----- Handle all keyboard inputs -----

function pressKey(key) {
  // Adds the letter to the guess and update the display
  const activeTiles = getActiveTiles();
  if (activeTiles.length >= WORD_LENGTH) return;

  const nextTile = guessGrid.querySelector(':not([data-letter])');
  nextTile.dataset.letter = key.toLowerCase();
  nextTile.textContent = key.toUpperCase();
  nextTile.dataset.state = 'active';
}

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
  if (key.match(/^[a-yA-Y]$/)) {
    pressKey(key);
  }
}

function submitGuess() {
  // If a full row has been entered, check if it's correct
  let submittedWord = '';
  const activeTiles = [...getActiveTiles()];
  if (activeTiles.length < WORD_LENGTH) {
    showAlert('Not enough letters');
    shakeTiles(activeTiles);
    return;
  }
  for (let tile of activeTiles) {
    submittedWord += tile.dataset.letter;
  }
  if (!dictionary.includes(submittedWord)) {
    showAlert(`Not in wordlist`);
    shakeTiles(activeTiles);
    return;
  }

  stopInteraction();
  activeTiles.forEach((...params) => flipTile(...params, submittedWord));
}

function deleteLastLetter() {
  // Delete the last letter from the guess (current row only)
  const activeTiles = getActiveTiles();
  if (activeTiles.length === 0) return;

  const lastTile = activeTiles[activeTiles.length - 1];
  lastTile.removeAttribute('data-letter');
  lastTile.textContent = '';
  delete lastTile.dataset.state;
  delete lastTile.dataset.letter;
}

// ----- Helper functions -----

function getActiveTiles() {
  // Returns an array of all unsubmitted tiles on a line.
  return guessGrid.querySelectorAll('[data-state="active"]');
}

function showAlert(message, duration = 1000) {
  const alert = document.createElement('div');
  alert.textContent = message;
  alert.classList.add('alert');
  alertContainer.prepend(alert);
  setTimeout(() => {
    alert.classList.add('hide');
    // Wait for animation to finish
    alert.addEventListener('transitionend', () => {
      alert.remove();
    });
  }, duration);
}

function shakeTiles(tiles) {
  for (let tile of tiles) {
    tile.classList.add('shake');
    tile.addEventListener('animationend', () => {
      tile.classList.remove('shake');
    }, { once: true });
  }
}

// ----- Game Logic -----

// FIXME: A tile is always marked yellow even if it has already been marked blue
function flipTile(tile, index, array, submittedWord) {
  const letter = tile.dataset.letter;
  const key = keyboard.querySelector(`[data-key=${letter.toUpperCase()}]`);
  setTimeout(() => {
    tile.classList.add('flip');
  }, index * 500);

  tile.addEventListener('transitionend', () => {
    tile.classList.remove('flip');
    if (targetWord[index] === letter) {
      key.classList.add('match');
      tile.classList.add('match');
      tile.dataset.state = 'match';
    } else if (targetWord.includes(letter)) {
      key.classList.add('wrong-position');
      tile.classList.add('wrong-position');
      tile.dataset.state = 'wrong-position';
    } else {
      key.classList.add('incorrect');
      tile.classList.add('incorrect');
      tile.dataset.state = 'incorrect';
    }

    if (index === array.length - 1) {
      tile.addEventListener('transitionend', () => {
        startInteraction();
        checkWinLose(submittedWord, array);
      }, { once: true });
    }
  }, { once: true });
}

function checkWinLose(submittedWord, tiles) {
  if (submittedWord === targetWord) {
    showAlert('You Win!', 5000);
    danceTiles(tiles);
    endGame();
    return;
  }
  const remainingTiles = guessGrid.querySelectorAll(':not([data-letter])');
  if (remainingTiles.length === 0) {
    showAlert(`${targetWord.toUpperCase()}`, null);
    shakeTiles(tiles);
    endGame();
  }
}

function danceTiles(tiles) {
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    setTimeout(() => {
      tile.classList.add('dance');
      tile.addEventListener('animationend', () => {
        tile.classList.remove('dance');
      }, { once: true });
    }, (i * DANCE_ANIMATION_DURATION) / 5);
  }
}

// ----- Modal functions -----
function openModal (topic) {
  // modalContent.innerHTML = `<object type="text/html" data="${topic}.html" ></object>`;
  // modalContent.innerHTML = `<iframe src="${topic}.html" frameborder="0" allowfullscreen></iframe>`;
  // modalContent.innerHTML = `<div id="modal-snippet" w3-include-html="${topic}.html"></div>`;
  modalContent.innerHTML = `<div id="modal-snippet"><h3>Loading...</h3></div>`;
  includeHTMLSnippet(document.getElementById('modal-snippet'), `${topic}.html`);
  modalContainer.classList.add('show');
}

function closeModal() {
  modalContainer.classList.remove('show');
}

function includeHTMLSnippet(targetElement, filename) {
  let xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      targetElement.innerHTML =
      this.responseText;
    }
  }
  xhttp.open("GET", filename, true);
  xhttp.send();
}


// ----- Interaction functions -----

function startInteraction() {
  document.addEventListener('keydown', handleKeyPress);
  document.addEventListener('click', handleClick);
}

function stopInteraction() {
  document.removeEventListener('keydown', handleKeyPress);
  document.removeEventListener('click', handleClick);
}

function endGame() {
  gameOver = true;
  document.removeEventListener('keydown', handleKeyPress);
}

// ----- Start the game -----
startInteraction();
