
// wordlist and dictionary are included in the HTML
const cells = document.querySelectorAll('.cell');

function handleKeyPress(e) {
  const key = e.key;
  if (key === 'Enter') {
    submitGuess(key.toUpperCase());
    return;
  }
  if (key === 'Backspace' || key === 'Delete') {
    deleteLastLetter();
    return;
  }
  pressKey(key);
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

function pressKey(key) {
  // TODO: Add the letter to the guess and update the display
  console.log('Receiving key:', key);
  return;
}
function submitGuess() {
  // TODO: Check if the guess is correct
  console.log('Submitting...');
  return;
}
function deleteLastLetter() {
  // TODO: Delete the last letter from the guess
  console.log('Deleting last letter...');
  return;
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