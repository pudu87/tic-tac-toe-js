const players = [];

// PLAYER FACTORY

const createPlayer = (name, mark) => {

  return {name, mark}
}

// GAME BOARD MODULE

const gameBoard = (function() {

  const board = Array(9).fill(0);
  const winPattern = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const checkIfMark = (index) => board[index];
  const addToBoard = (index, mark) => board[index] = mark;
  const checkIfVictory = (mark) => {
    return winPattern.some( pattern => {
      return pattern.every( index => board[index] == mark )
    })
  };
  const resetBoard = () => board.fill(0);
  const getBoard = () => board;

  return { checkIfMark, addToBoard, checkIfVictory, resetBoard, getBoard }
})();

// DISPLAY CONTROLLER MODULE

const displayController = (function() {

  const info = document.querySelector('.info');
  const playerForm = document.querySelector('form');
  const playerInfo = document.querySelector('.player-info');
  const playerName = document.querySelectorAll('.player-name');
  const squares = document.querySelectorAll('.square');
  const inputs = document.querySelectorAll('.player input')

  const insertPlayers = () => {
    playerForm.hidden = true;
    playerInfo.hidden = false;
    playerName[0].textContent = players[0].name;
    playerName[1].textContent = players[1].name;
  }
  const addToBoard = (index, mark) => {
    let square = document.querySelector('#_' + index)
    square.textContent = mark;
  }
  const resetDisplay = () => {
    playerForm.hidden = false;
    playerInfo.hidden = true;
    squares.forEach(square => square.textContent = '');
    inputs.forEach(input => input.value = '');
  }
  const showTurn = (player) => {
    player = player == players[0] ? players [1] : players[0];
    info.textContent = `${player.name}, It's your turn. 
    Click a square to put an ${player.mark}.`;
  }
  const showWon = (player) => {
    info.textContent = `Congratulaions ${player.name}, you won!`;
  }
  const showDraw = () => {
    info.textContent = 'Nobody won. Try again';
  }

  return { insertPlayers, addToBoard, resetDisplay, showTurn, showWon, showDraw }
})();

// GAME CONTROLLER MODULE

const gameController = (function() {

  let round = 0;

  const insertPlayers = () => {
    let input = Array.from(document.querySelectorAll('form input'));
    players.push(createPlayer(input[0].value, 'x'));
    players.push(createPlayer(input[1].value, 'o'));
    displayController.insertPlayers();
    return false;
  }

  const currentPlayer = () => round % 2 == 0 ? players[0] : players[1];
  const changePlayer = () => round ++;
  const gameFlow = (index, mark) => {
    if (!gameBoard.checkIfMark(index)) {
      gameBoard.addToBoard(index, mark);
      displayController.addToBoard(index, mark);
      displayController.showTurn(currentPlayer());
      if (gameBoard.checkIfVictory(mark)) {
        displayController.showWon(currentPlayer());
      }
      else if (round == 8) {
        displayController.showDraw();
      }
      console.log(gameBoard.getBoard());
      changePlayer();
    }
  }
  const resetGame = () => {
    console.log('test')
    round = 0;
    players.length = 0;
    displayController.resetDisplay();
    gameBoard.resetBoard();
  }

  const squares = document.querySelectorAll('.square');
  squares.forEach(square => {
    square.addEventListener('click', (e) => {
      let index = e.target.id.split('')[1];
      console.log(`EVENTLISTENER-index: ${index}`);
      console.log(`EVENTLISTENER-player: ${currentPlayer().mark}`)
      gameFlow(index, currentPlayer().mark);
    });
  })
  const reset = document.querySelector('.reset');
  reset.addEventListener('click', resetGame);

  return { insertPlayers, currentPlayer, changePlayer }
})();
