// module to return gameboard object
const gameboard = (function() {

  // array defining marks at each square: 'x', 'o', or undefined (i.e. unmarked)
  const _gameData = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  const getGameData = () => _gameData;
  const placeMark = (mark, loc) => _gameData.splice(loc, 1, mark);

  return { getGameData, placeMark };

})();

// factory function to create player objects
function Player(marker) {

  const getMarker = () => marker;

  return { getMarker };

};

// module to return gameController object
const gameController = (function() {

  // cache DOM

  // bind events

  // render function

  return {};

})();