const players = [];

// PLAYER FACTORY

const createPlayer = (name, cpu, mark) => {

  return {name, cpu, mark}
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
  const squares = document.querySelectorAll('.square span');
  const inputs = document.querySelectorAll('.player input')

  const insertPlayers = () => {
    playerForm.hidden = true;
    playerInfo.hidden = false;
    for (let i = 0; i < 2; i++) {
      playerName[i].textContent = players[i].name;
      const cpu = document.createElement('em');
      cpu.textContent = 'CPU';
      players[i].cpu ? playerName[i].appendChild(cpu) : 0;
    }
  }
  const addToBoard = (index, mark) => {
    let square = document.querySelector('#_' + index + ' span')
    square.textContent = mark;
    console.log(square.textContent)
    if (square.textContent == '🞇') {
      square.classList.toggle('alignment');
    }
  }
  const resetDisplay = () => {
    playerForm.hidden = false;
    playerInfo.hidden = true;
    squares.forEach(square => {
      square.textContent = ''
      square.classList.remove('alignment');
    });
    inputs.forEach(input => input.value = '');
    info.textContent = 'Insert Player names!';
  }
  const showTurn = (player) => {
    player = player == players[0] ? players [1] : players[0];
    info.textContent = `${player.name}, It's your turn. 
    Click a square to put an ${player.mark}.`;
  }
  const showWon = (player) => {
    info.textContent = `Congratulations ${player.name}, you won!`;
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
    players.push(createPlayer(input[0].value, input[1].checked, '🞫'));
    players.push(createPlayer(input[2].value, input[3].checked, '🞇'));
    displayController.insertPlayers();
    players[0].cpu == true ? computerMoves() : 0;
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
        squares.forEach(square => { 
          square.removeEventListener('click', clickSquare)
        });
      }
      else if (round == 8) {
        displayController.showDraw();
      }
      changePlayer();
    }
    if (currentPlayer().cpu && !gameBoard.checkIfVictory(mark) && round <= 8) {
      computerMoves();
    }
  }
  const clickSquare = (e) => {
    let index = e.target.id.split('')[1];
    gameFlow(index, currentPlayer().mark);
  }
  const resetGame = () => {
    round = 0;
    players.length = 0;
    displayController.resetDisplay();
    gameBoard.resetBoard();
    squares.forEach(square => { 
      square.addEventListener('click', clickSquare)
    });
  }
  const computerMoves = () => {
    index = Math.floor(Math.random() * 9);
    gameFlow(index, currentPlayer().mark);
  }

  const squares = document.querySelectorAll('.square');
  squares.forEach(square => { 
    square.addEventListener('click', clickSquare)
  });
  const reset = document.querySelector('.reset');
  reset.addEventListener('click', resetGame);

  return { insertPlayers, currentPlayer, changePlayer }
})();
