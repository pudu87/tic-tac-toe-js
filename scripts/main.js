const players = [];

// PLAYER FACTORY

const createPlayer = (name, cpu, mark) => {

  return { name, cpu, mark }
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

  return { checkIfMark, addToBoard, checkIfVictory, resetBoard }
})();

// DISPLAY CONTROLLER MODULE

const displayController = (function() {

  const info = document.querySelector('.info');
  const playerForm = document.querySelector('form');
  const playerInfo = document.querySelector('.player-info');
  const playerNames = document.querySelectorAll('.player-name');
  const squares = document.querySelectorAll('.square');
  const inputs = document.querySelectorAll('.player input');

  const insertPlayers = () => {
    playerForm.hidden = true;
    playerInfo.hidden = false;
    for (let i = 0; i < 2; i++) {
      playerNames[i].textContent = players[i].name;
      let cpu = document.createElement('em');
      cpu.textContent = 'CPU';
      players[i].cpu ? playerNames[i].appendChild(cpu) : 0;
    }
  }
  const addToBoard = (index, mark) => {
    let square = document.querySelector('#_' + index)
    mark == '🞫'? square.classList.add('display-x') : 
      square.classList.add('display-o');
  }
  const resetDisplay = () => {
    playerForm.hidden = false;
    playerInfo.hidden = true;
    squares.forEach(square => {
      square.classList.remove('display-x');
      square.classList.remove('display-o');
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
  const squares = document.querySelectorAll('.square');
  const reset = document.querySelector('.reset');

  const insertPlayers = () => {
    let input = Array.from(document.querySelectorAll('form input'));
    players.push(createPlayer(input[0].value, input[1].checked, '🞫'));
    players.push(createPlayer(input[2].value, input[3].checked, '🞇'));
    displayController.insertPlayers();
    players[0].cpu == true ? _computerMoves() : 0;
    return false;
  }
  const _currentPlayer = () => round % 2 == 0 ? players[0] : players[1];
  const _changePlayer = () => round ++;
  const _gameFlow = (index, mark) => {
    if (!gameBoard.checkIfMark(index)) {
      gameBoard.addToBoard(index, mark);
      displayController.addToBoard(index, mark);
      displayController.showTurn(_currentPlayer());
      if (gameBoard.checkIfVictory(mark)) {
        displayController.showWon(_currentPlayer());
        squares.forEach(square => { 
          square.removeEventListener('click', _clickSquare)
        });
      }
      else if (round == 8) {
        displayController.showDraw();
      }
      _changePlayer();
    }
    if (_currentPlayer().cpu && !gameBoard.checkIfVictory(mark) && round <= 8) {
      _computerMoves();
    }
  }
  const _clickSquare = (e) => {
    let index = e.target.id.split('')[1];
    _gameFlow(index, _currentPlayer().mark);
  }
  const _resetGame = () => {
    round = 0;
    players.length = 0;
    displayController.resetDisplay();
    gameBoard.resetBoard();
    squares.forEach(square => { 
      square.addEventListener('click', _clickSquare)
    });
  }
  const _computerMoves = () => {
    index = Math.floor(Math.random() * 9);
    _gameFlow(index, _currentPlayer().mark);
  }

  squares.forEach(square => { 
    square.addEventListener('click', _clickSquare)
  });
  reset.addEventListener('click', _resetGame);

  return { insertPlayers }
})();
