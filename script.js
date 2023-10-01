// module to control gameboard
const gameboard = (function() {

  // array defining marks at each square: 'x', 'o', or undefined (i.e. unmarked)
  const _boardData = [
    undefined, undefined, undefined,
    undefined, undefined, undefined,
    undefined, undefined, undefined
  ];
  
  // cache dom
  const _cells = document.querySelectorAll('.cell');
  
  // getters
  const getGameData = () => _boardData;

  _renderAll();

  // change mark in _boardData array and render cell
  function setMark (mark, index) {
    _boardData.splice(index, 1, mark);
    _render(_cells[index], index);
  }

  function _renderAll() {
    _cells.forEach((cell, i) => _render(cell, i));
  }

  function _render(cell, index) {
    if (_boardData[index] !== undefined) {
      const mark = _createSvg(_boardData[index]); // create appropriate svg
      cell.appendChild(mark); // append svg to cell
    }
  }

  // create an 'x' or 'o' inline SVG image
  function _createSvg(mark) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add(mark);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    if (mark === 'x') {
      svg.setAttribute('viewBox', '22 33.25 431 428.9');
      path.setAttribute('d', 'M336 248l88 -88q19 -18 25.5 -33.5t0.5 -31t-24 -33.5q-19 -19 -34.5 -25.5t-31 0t-33.5 24.5l-89 89l-89 -88q-18 -19 -34 -25.5t-31.5 0t-33.5 24.5q-19 19 -25 34.5t1 31t25 33.5l88 88l-90 90q-18 18 -24 33t0 30.5t25 34.5q19 18 34.5 23.5t31 -0.5t33.5 -23l89 -89l89 89q17 18 32.5 23.5t31.5 -0.5t35 -23q18 -19 24 -34.5t0 -30.5t-24 -33z');
    } else {
      svg.setAttribute('viewBox', '20 -18 519 520');
      path.setAttribute('d', 'M281 -17q-47 0 -93.5 18.5t-84.5 52.5t-60 81.5t-22 105.5q0 54 20 100.5t56 82.5t82.5 56.5t99.5 20.5q72 0 130.5 -34.5t93.5 -93.5t35 -131q0 -61 -22.5 -108.5t-60 -81.5t-83 -51.5t-91.5 -17.5zM279 134q24 0 49 12t42 36t17 61q0 32 -14 56t-38.5 37.5t-56.5 13.5q-30 0 -53.5 -14t-38 -38.5t-14.5 -55.5q0 -36 16.5 -60.5t41.5 -36t49 -11.5z');
    }

    svg.appendChild(path);

    return svg;
  }

  function clearBoard() {
    _boardData.forEach((el, i, array) => array[i] = undefined);
    _cells.forEach(cell => cell.replaceChildren());
  }

  return { getGameData, setMark, clearBoard };

})();


// factory function to create player objects
function Player(mark, name) {

  // getters
  const getMark = () => mark;
  const getName = () => name;

  return { getMark, getName };

};


// module to control misc display elements
const displayController = (function() {

  // cache DOM
  const _gameOverBanner = document.querySelector('#game-over');
  const _setup = document.querySelector('#setup');
  const _nameInput = _setup.querySelector('#name');
  const _submitBtn = _setup.querySelector('#submit');
  const _setup1 = _setup.querySelector('#setup1');
  const _h3 = _setup.querySelector('#setup2 h3');
  const _gameOverText = _gameOverBanner.querySelector('h2');
  const _congrats = _gameOverBanner.querySelector('h5');
  const scores = document.querySelectorAll('.score');
  const scoreP1 = scores[0];
  const scoreTies = scores[1];
  const scoreP2 = scores[2];
  
  // show 'Game Over' banner that announces result of game, congratulates winner
  function renderGameOver(result) {
    if (result === 'tie') { // if game resulted in a tie
      if (!_congrats.classList.contains('hidden')) _congrats.classList.add('hidden');
      _gameOverText.innerText = "It's a draw!";
    } else { // if game resulted in a win
      _congrats.classList.remove('hidden');
      _gameOverText.innerText = `${gameController.getActivePlayer().getName()} wins!`;
    }

    _gameOverBanner.classList.remove('hidden');
  }

  // hide 'Game Over' banner
  function hideGameOver() {
    _gameOverBanner.classList.add('hidden');
  }

  // remove setup1 HTML, change setup2 text
  function hideSetup1() {
    _setup1.classList.add('hidden');
    _nameInput.value = '';
    _submitBtn.innerText = 'Play Game';
    _h3.innerText = 'Player 2, enter your name';
  }

  function _showSetup1() {
    _setup1.classList.remove('hidden');
    _nameInput.value = '';
    _submitBtn.innerText = 'Next';
    _h3.innerText = 'Enter your name';
  }

  // toggle entire setup page
  function toggleSetup() {
    _setup.classList.toggle('hidden');
    if (_setup1.classList.contains('hidden')) _showSetup1();
  }

  function updateScore() {
    const score = gameController.getScore();
    scoreP1.children[1].innerText = score.p1;
    scoreP2.children[1].innerText = score.p2;
    scoreTies.children[1].innerText = score.ties;
  }

  function nameScoreBoard(player1, player2) {
    scoreP1.children[0].innerText = player1.getName();
    scoreP2.children[0].innerText = player2.getName();

    scoreP1.classList.remove('xlite', 'olite');
    scoreP2.classList.remove('xlite', 'olite');

    if (player1.getMark() === 'x') {
      scoreP1.classList.add('xlite');
      scoreP2.classList.add('olite');
    } else {
      scoreP1.classList.add('olite');
      scoreP2.classList.add('xlite');
    }
  }

  return { renderGameOver, hideGameOver, hideSetup1, toggleSetup, updateScore, nameScoreBoard };

})();


// module to control flow of game
const gameController = (function() {

  // cache DOM
  const _board = document.querySelector('#gameboard');
  const _markBtns = document.querySelectorAll('.mark-btn');
  const _nameInput = document.querySelector('#name');
  const _submitBtn = document.querySelector('#submit');
  const _playAgain = document.querySelector('#play-again');
  const _quitBtn = document.querySelector('#quit');

  // cache Player objects
  let _player1Selection;
  let _player2Selection;
  let _player1;
  let _player2;
  let _activePlayer;

  // cache scores
  const _score = {
    p1: 0,
    p2: 0,
    ties: 0
  };
  const getScore = () => _score;

  // bind events
  _markBtns.forEach(button => button.addEventListener('click', _selectMark));
  const _createPlayer = _createPlayerSetup();
  _submitBtn.addEventListener('click', _createPlayer);
  _playAgain.addEventListener('click', _playRound);
  _quitBtn.addEventListener('click', _quitGame);

  // getters
  const getActivePlayer = () => _activePlayer;

  function _playRound() {
    displayController.hideGameOver(); // remove 'game over' banner
    gameboard.clearBoard();
    _activePlayer = _player1.getMark() === 'x' ? _player1 : _player2;
    _board.addEventListener('click', _placeMark);
    _board.classList.add('active');
  }

  // place mark when board is clicked
  function _placeMark(e) {
    const cellIndex = e.target.dataset.index;
    const mark = _activePlayer.getMark();
    // if no mark on cell
    if (cellIndex !== undefined && gameboard.getGameData()[cellIndex] === undefined) {
      // add appropriate mark to square and change appropriate mark in _boardData array
      gameboard.setMark(mark, cellIndex);
      
      if (_checkGameOver()) return;
      _switchActivePlayer();
    }

    // change turn
    function _switchActivePlayer() {
      _activePlayer = mark === _player1.getMark() ? _player2 : _player1;
      console.log(`active player: ${_activePlayer.getName()}`);
    }

    // check if conditions are met to end game
    function _checkGameOver() {
      gameData = gameboard.getGameData();
      const mark = _activePlayer.getMark();
      
      const win = checkWin();
      const tie = checkTie();
      console.log('win? ' + win);
      console.log('tie? ' + tie);
      
      if (win) {
        _updateScore(_activePlayer.getName());
        displayController.renderGameOver('win');
      } else if (tie) {
        _updateScore();
        displayController.renderGameOver('tie');
      }
      
      if (win || tie) {
        _board.removeEventListener('click', _placeMark);
        _board.classList.remove('active');
        return true;
      } else {
        return false;
      }

      function checkWin() {
        console.log(gameData);
        // 8 possible ways to win
        const waysToWin = [
          // horizontal
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          // vertical
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          // diagonal
          [0, 4, 8],
          [2, 4, 6]
        ];

        // iterate over each way to win
        for (let i = 0; i < waysToWin.length; i++) {
          const wayToWin = waysToWin[i];
          let count = 0; // set count to 0
          // iterate over each n in wayToWin
          for (let j = 0; j < wayToWin.length; j++) {
            const n = wayToWin[j];
            // if gameData el at nth index doesn't equal mark, break out of loop
            if (gameData[n] !== mark) break;
            count++; // else, increment count
          }

          if (count === 3) return true; // if count is 3, return true
        }
          
        return false;
      }

      function checkTie() {
        // iterate over gameData
        for (let i = 0; i < gameData.length; i++) {
          if (!gameData[i]) return false; // if no mark, return false
        }

        return true;
      }
    }
  }

  // select player marks
  function _selectMark() {
    _markBtns.forEach(button => button.classList.remove('focus')); // remove focus from mark btns
    this.classList.add('focus'); // add focus to correct mark btn

    _player1Selection = this.dataset.value;
    _player2Selection = _player1Selection === 'x' ? 'o' : 'x';
  }

  function _createPlayerSetup() {
    let count = 0;

    return (function() {
      // if count is even
      if (count % 2 === 0) {
        count++;
        const name = _nameInput.value || 'Player 1'; // create player 1
        _player1 = Player(_player1Selection || 'x', name);
        displayController.hideSetup1();

      // if count is odd
      } else if (count % 2 === 1) {
        count++;
        const name = _nameInput.value || 'Player 2'; // create player 2
        _player2 = Player(_player2Selection || 'o', name);
        displayController.toggleSetup();

        displayController.nameScoreBoard(_player1, _player2);
        _playRound();
      }
    })
  }

  function _quitGame() {
    _resetScore();
    displayController.hideGameOver();
    displayController.toggleSetup();
  }

  function _updateScore(winner) {
    if (winner) {
      _player1.getName() === winner ? _score.p1++ : _score.p2++; // increment score of correct player
    } else {
      _score.ties++; // increment score.ties
    }
    displayController.updateScore();
  }

  function _resetScore() {
    for (let score in _score) {
      _score[score] = 0;
      displayController.updateScore();
    }
  }

  return { getActivePlayer, getScore };

})();