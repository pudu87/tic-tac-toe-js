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
  const getBoard = () => board;

  return { checkIfMark, addToBoard, checkIfVictory, getBoard }
})();

// DISPLAY CONTROLLER MODULE

const displayController = (function() {

  const playerForm = document.querySelector('form');
  const playerInfo = document.querySelector('.player-info');
  const playerName = document.querySelectorAll('.player-name');

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
  const won = (player) => {
    // elaborate
    console.log('you won');
  }
  const draw = () => {
    // elaborate
    console.log('you draw');
  }

  return { insertPlayers, addToBoard, won, draw }
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
      if (gameBoard.checkIfVictory(mark)) {
        displayController.won(currentPlayer());
      }
      else if (round == 8) {
        displayController.draw();
      }
      changePlayer();
    }
  }

  const squares = document.querySelectorAll('.square');
  squares.forEach( square => {
    square.addEventListener('click', (e) => {
      let index = e.target.id.split('')[1];
      console.log(`EVENTLISTENER-index: ${index}`);
      console.log(`EVENTLISTENER-player: ${currentPlayer().mark}`)
      gameFlow(index, currentPlayer().mark);
    });
  })

  return { insertPlayers, currentPlayer, changePlayer }
})();
