const cells = document.querySelectorAll('.cell');

function handleClick(e) {

  const cell = e.target;  
  let state = cell.getAttribute('data-state');

  if (state === 'active') {
    cell.innerText = 'X';
    cell.backgroundColor = 'red';
    cell.removeAttribute('data-state');
    // TODO: Change the state of the next cell to active
  }


  // const key = cell.getAttribute('data-key');
  
  // if (cellValue === '') {
  //   cell.innerText = 'X';
  //   cell.classList.add('x');
  //   cell.classList.remove('o');
  //   cell.classList.remove('empty');
  //   cell.classList.add('filled');
  //   checkWinner(cellIndex, cellRow, cellCol, cellDiag);

}

cells.forEach(cell => cell.addEventListener('click', handleClick));