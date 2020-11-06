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

  const won = () => console.log('you won');
  const draw = () => console.log('you draw');

  return { won, draw }
})();

// GAME CONTROLLER MODULE

const gameController = (function() {

  let round = 0;

  const players = [];
  players.push(createPlayer('pikachu', 'x'));
  players.push(createPlayer('snorlax', 'o'));

  const currentPlayer = () => round % 2 == 0 ? players[0] : players[1];
  const changePlayer = () => round ++;
  const gameFlow = (index, mark) => {
    if (!gameBoard.checkIfMark(index)) {
      gameBoard.addToBoard(index, mark);
      if (gameBoard.checkIfVictory(mark)) {
        displayController.won();
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
      gameFlow(index, currentPlayer().mark);
    });
  })

  return { currentPlayer, changePlayer }
})();
